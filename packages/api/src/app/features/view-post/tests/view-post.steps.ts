import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { mock } from "jest-mock-extended";
import {
  FileStorageServiceToken,
  IFileStorageService,
} from "../../create-post";
import { ExecutionContext, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../app.module";
import { PostEntity, PostFactory } from "../../../core/entities/post.entity";
import crypto from "crypto";
import request from "supertest";
import { UserEntity, UserFactory } from "../../../core/entities/user.entity";
import { IsAuthenticatedGuard } from "../../../auth";
import { PostDetailsDto } from "../index";

const feature = loadFeature(path.join(__dirname, "../view-post.feature"));

defineFeature(feature, (test) => {
  const mockedFileStorage = mock<IFileStorageService>();
  let app: INestApplication;
  let dataSource: DataSource;
  let CURRENT_USER: UserEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FileStorageServiceToken)
      .useValue(mockedFileStorage)
      .overrideGuard(IsAuthenticatedGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = CURRENT_USER;

          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    dataSource = await moduleFixture.get(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  test("View a post not owned by me", ({ when, given, and, then }) => {
    let CREATED_USER: UserEntity;
    let POST_ID: string;

    given(
      /^The post "(.*)" by "(.*)"$/,
      async (postTitle: string, authorName: string) => {
        const user = UserFactory.create(authorName, authorName + "@gmail.com");
        CREATED_USER = await UserEntity.save(user, { reload: true });
        const post = PostFactory.create(
          postTitle,
          createRandomUrl(),
          CREATED_USER.id,
          "goal"
        );
        const createdPost = await PostEntity.save(post, { reload: true });
        POST_ID = createdPost.id;
      }
    );

    and(/^I am "(.*)"$/, async (authorName: string) => {
      CURRENT_USER = CREATED_USER;
    });

    let body: PostDetailsDto;

    when(
      /^I look at "(.*)" by "(.*)"$/,
      async (postTitle: string, authorName: string) => {
        const { slug } = await PostEntity.findOneOrFail({
          where: {
            title: postTitle,
            author: {
              name: authorName,
            },
          },
        });

        const response = await request(app.getHttpServer()).get(
          `/posts/${CURRENT_USER.displayName}/${slug}`
        );

        body = response.body;
      }
    );

    then(
      /^we will "(.*)" by "(.*)" owned by me$/,
      (postTitle: string, authorName: string) => {
        expect(body.title).toBe(postTitle);
        expect(body.authorName).toBe(authorName.toLowerCase());
        expect(body.isMyPost).toBe(true);
      }
    );
  });

  test("View a post owned by me", ({ given, and, then, when }) => {
    let POST_ID: string;

    given(
      /^The post "(.*)" by "(.*)"$/,
      async (postTitle: string, authorName: string) => {
        const user = UserFactory.create(authorName, authorName + "@gmail.com");
        const createdUser = await UserEntity.save(user, { reload: true });
        const post = PostFactory.create(
          postTitle,
          createRandomUrl(),
          createdUser.id,
          "goal"
        );
        const createdPost = await PostEntity.save(post, { reload: true });
        POST_ID = createdPost.id;
      }
    );

    and(/^I am "(.*)"$/, async (name) => {
      const user = UserFactory.create(name, name + "@gmail.com");
      CURRENT_USER = await UserEntity.save(user, { reload: true });
    });

    let body: PostDetailsDto;

    when(
      /^I look at "(.*)" by "(.*)"$/,
      async (postTitle: string, authorName: string) => {
        const { displayName } = await UserEntity.findOneOrFail({
          where: {
            name: authorName,
          },
        });
        const { slug } = await PostEntity.findOneOrFail({
          where: {
            title: postTitle,
            author: {
              name: authorName,
            },
          },
        });

        const response = await request(app.getHttpServer()).get(
          `/posts/${displayName}/${slug}`
        );

        body = response.body;
      }
    );

    then(
      /^we will find "(.*)" by "(.*)" not owned by me$/,
      (postTitle: string, authorName: string) => {
        expect(body.title).toBe(postTitle);
        expect(body.authorName).toBe(authorName.toLowerCase());
        expect(body.isMyPost).toBe(false);
      }
    );
  });
});

function createRandomUrl(): string {
  return "https://" + crypto.randomUUID() + ".com";
}
