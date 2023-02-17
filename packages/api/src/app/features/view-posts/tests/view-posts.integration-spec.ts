import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import crypto from "crypto";
import { DataSource } from "typeorm";
import request from "supertest";
import { AppModule } from "../../../app.module";
import {
  IFileStorageService,
  FileStorageServiceToken,
} from "../../create-post";
import { UserFactory } from "../../../core/entities/user.entity";
import { PostFactory } from "../../../core/entities/post.entity";

describe("view posts controller", () => {
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

  describe("pagination", () => {
    test("when we have 10 posts then we have 1 page", async () => {
      await UserFactory.createTemporaryDefaultUserAsync();
      const posts = Array.from({ length: 10 }).map(() =>
        PostFactory.create(
          createRandomTitle(),
          createRandomUrl(),
          UserFactory.USER_ID
        ).save()
      );
      await Promise.all(posts);

      const result = await request(app.getHttpServer()).get("/posts?page=1");

      expect(result.body.totalPages).toBe(1);
    });

    test("when we have 2 posts then we have 1 page", async () => {
      await UserFactory.createTemporaryDefaultUserAsync();
      const posts = Array.from({ length: 2 }).map(() =>
        PostFactory.create(
          createRandomTitle(),
          createRandomUrl(),
          UserFactory.USER_ID
        ).save()
      );
      await Promise.all(posts);

      const result = await request(app.getHttpServer()).get("/posts?page=1");

      expect(result.body.totalPages).toBe(1);
    });

    test("when we have 11 posts then we have 2 pages", async () => {
      await UserFactory.createTemporaryDefaultUserAsync();
      const posts = Array.from({ length: 11 }).map(() =>
        PostFactory.create(
          createRandomTitle(),
          createRandomUrl(),
          UserFactory.USER_ID
        ).save()
      );
      await Promise.all(posts);

      const result = await request(app.getHttpServer()).get("/posts?page=1");

      expect(result.body.totalPages).toBe(2);
    });

    test("when we have 20 posts then we have 2 pages", async () => {
      await UserFactory.createTemporaryDefaultUserAsync();
      const posts = Array.from({ length: 20 }).map(() =>
        PostFactory.create(
          createRandomTitle(),
          createRandomUrl(),
          UserFactory.USER_ID
        ).save()
      );
      await Promise.all(posts);

      const result = await request(app.getHttpServer()).get("/posts?page=1");

      expect(result.body.totalPages).toBe(2);
    });
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
