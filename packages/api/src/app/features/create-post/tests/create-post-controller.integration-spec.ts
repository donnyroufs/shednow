import { ExecutionContext, INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { AppModule } from "../../../app.module";
import request from "supertest";
import path from "path";
import { FileStorageServiceToken, IFileStorageService } from "..";
import { mock } from "jest-mock-extended";
import { IsAuthenticatedGuard } from "../../../auth";

describe("create post controller (integration)", () => {
  const mockedFileStorage = mock<IFileStorageService>();
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FileStorageServiceToken)
      .useValue(mockedFileStorage)
      .overrideGuard(IsAuthenticatedGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = {
            email: "john@gmail.com",
          };

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

  test("throws an exception when no title provided", async () => {
    return request(app.getHttpServer())
      .post("/posts")
      .attach("file", path.join(__dirname, "test.mp3"))
      .expect(400);
  });

  test("throws an exception when no file provided", async () => {
    return request(app.getHttpServer())
      .post("/posts")
      .field("title", "my title")
      .expect(400);
  });

  test("only allows mp3 files", async () => {
    return request(app.getHttpServer())
      .post("/posts")
      .field("title", "my title")
      .attach("file", path.join(__dirname, "test.txt"))
      .expect(400);
  });

  test("throws a bad request exception when trying to save a duplicate post", async () => {
    await request(app.getHttpServer())
      .post("/posts")
      .field("title", "my title")
      .attach("file", path.join(__dirname, "test.mp3"));

    return request(app.getHttpServer())
      .post("/posts")
      .field("title", "my title")
      .attach("file", path.join(__dirname, "test.mp3"))
      .expect(400);
  });
});
