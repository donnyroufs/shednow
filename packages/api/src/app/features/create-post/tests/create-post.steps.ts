import { TestingModule, Test } from "@nestjs/testing";
import { ExecutionContext, INestApplication } from "@nestjs/common";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { DataSource } from "typeorm";
import request from "supertest";
import { AppModule } from "../../../app.module";
import { FileStorageServiceToken, IFileStorageService } from "..";
import { mock } from "jest-mock-extended";
import { UserEntity, UserFactory } from "../../../core/entities/user.entity";
import { IsAuthenticatedGuard } from "../../../auth";

const feature = loadFeature(path.join(__dirname, "../create-post.feature"));

defineFeature(feature, (test) => {
  const mockedFileStorage = mock<IFileStorageService>();
  let app: INestApplication;
  let dataSource: DataSource;
  let USER: UserEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FileStorageServiceToken)
      .useValue(mockedFileStorage)
      .overrideGuard(IsAuthenticatedGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = USER;

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
    const user = UserFactory.create("john", "johny@gmail.com");
    const createdUser = await user.save({ reload: true });
    USER = createdUser;
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
