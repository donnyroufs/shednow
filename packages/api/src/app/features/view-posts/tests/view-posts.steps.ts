import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { mock } from "jest-mock-extended";
import path from "path";
import { DataSource } from "typeorm";
import { AppModule } from "../../../app.module";
import { GetPostsResponse } from "../../view-posts/index";
import { uniqBy } from "lodash";
import crypto from "crypto";
import {
  IFileStorageService,
  FileStorageServiceToken,
} from "../../create-post";
import { PostEntity, PostFactory } from "../../../core/entities/post.entity";
import { UserEntity, UserFactory } from "../../../core/entities/user.entity";

const feature = loadFeature(path.join(__dirname, "../view-posts.feature"));

defineFeature(feature, (test) => {
  const mockedFileStorage = mock<IFileStorageService>();
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FileStorageServiceToken)
      .useValue(mockedFileStorage)
      .compile();

    app = moduleFixture.createNestApplication();
    dataSource = await moduleFixture.get(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  test("We have no posts", ({ given, when, then }) => {
    let result: GetPostsResponse;

    given("there are no posts", async () => {
      const result = await dataSource.getRepository(PostEntity).count();

      expect(result).toBe(0);
    });

    when("I look for posts", async () => {
      const response = await request(app.getHttpServer()).get("/posts?page=1");

      result = response.body;
    });

    then("I will find nothing", () => {
      expect(result.posts).toEqual([]);
    });
  });

  test("There are posts", ({ given, when, then }) => {
    let result: GetPostsResponse;

    type TableRow = {
      title: string;
      createdAt: string;
    };

    given("we have the posts", async (rows: TableRow[]) => {
      const user = UserFactory.create("john", "john@gmail.com");
      const { id } = await UserEntity.save(user, {
        reload: true,
      });
      const posts = rows.map((row) =>
        PostFactory.create(
          row.title,
          createRandomUrl(),
          id,
          "goal",
          new Date(row.createdAt)
        )
      );
      await PostEntity.save(posts);
    });

    when("I look for posts", async () => {
      const response = await request(app.getHttpServer()).get("/posts?page=1");

      result = response.body;
    });

    then(/^I will first see "(.*)" and then "(.*)"$/, (titleOne, titleTwo) => {
      expect(result.posts.at(0)!.title).toBe(titleOne);
      expect(result.posts.at(1)!.title).toBe(titleTwo);
    });
  });

  test("There are posts created by multiple users", ({ given, when, then }) => {
    let result: GetPostsResponse;

    type TableRow = {
      title: string;
      authorName: string;
    };

    given("we have the posts", async (rows: TableRow[]) => {
      for (const row of rows) {
        const user = UserFactory.create(
          row.authorName,
          createRandomUserEmail()
        );
        const { id } = await UserEntity.save(user, { reload: true });
        const post = PostFactory.create(
          row.title,
          createRandomUrl(),
          id,
          "goal"
        );

        await PostEntity.save(post);
      }
    });

    when("I look for posts", async () => {
      const response = await request(app.getHttpServer()).get("/posts?page=1");
      result = response.body;
    });

    then(/^I will find "(.*)" posts with each a seperate author$/, (count) => {
      const unique = uniqBy(result.posts, (x) => x.authorName);

      expect(unique.length).toBe(Number(count));
    });
  });

  test("Look through the next set of posts", ({ given, when, then }) => {
    let result: GetPostsResponse;

    given(
      /^we have "(.*)" posts and the (.*) has the title "last post"$/,
      async (amount: number, title: string) => {
        const { id } = await UserFactory.create(
          "john",
          "johny@gmail.com"
        ).save();
        const posts = Array.from({ length: amount }).map((_, index) =>
          PostFactory.create(
            index === amount - 1 ? title : createRandomTitle(),
            createRandomUrl(),
            id,
            "goal",
            index === amount - 1
              ? new Date("02-16-2023")
              : new Date("02-17-2023")
          ).save()
        );

        await Promise.all(posts);

        expect(await PostEntity.count()).toBe(Number(amount));
      }
    );

    when("we look through the next set of posts", async () => {
      const response = await request(app.getHttpServer()).get("/posts?page=2");
      result = response.body;
    });

    then(
      /^we find "(.*)" post with the title "(.*)"$/,
      (amount: number, title: string) => {
        expect(result.posts.length).toBe(Number(amount));
        expect(result.posts.some((post) => post.title === title)).toBe(true);
      }
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});

function createRandomUrl(): string {
  return "https://" + crypto.randomUUID() + ".com";
}

function createRandomTitle(): string {
  return crypto.randomUUID().replace("-", " ");
}

function createRandomUserEmail(): string {
  return crypto.randomUUID().replace("-", " ");
}
