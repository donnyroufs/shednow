import { TestingModule, Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { DataSource } from "typeorm";
import request from "supertest";
import { AppModule } from "../../../app.module";
import { FileStorageServiceToken, IFileStorageService } from "..";
import { mock } from "jest-mock-extended";
import { UserFactory } from "../../../core/entities/user.entity";

const feature = loadFeature(path.join(__dirname, "../create-post.feature"));

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
    await UserFactory.createTemporaryDefaultUserAsync();
  });

  test("A post gets created and published", ({ when, then }) => {
    let status: number;
    let body: Record<string, unknown>;

    when(
      /^I create a post with the title "(.*)" and recording "(.*)"$/,
      async (title, recording) => {
        mockedFileStorage.store.mockResolvedValue("my-url");
        const response = await request(app.getHttpServer())
          .post("/posts")
          .field("title", title)
          .attach("file", path.join(__dirname, recording));

        status = response.statusCode;
        body = response.body;
      }
    );

    then("I will get a confirmation that its published", () => {
      expect(status).toBe(201);
      expect(body.id).toBeDefined();
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
