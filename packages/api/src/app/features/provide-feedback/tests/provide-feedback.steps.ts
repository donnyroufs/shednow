import { ExecutionContext, INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { defineFeature, loadFeature } from "jest-cucumber";
import crypto from "crypto";
import { mock } from "jest-mock-extended";
import path from "path";
import request from "supertest";
import { DataSource } from "typeorm";
import { AppModule } from "../../../app.module";
import { ProvideFeedbackDto } from "../index";
import { PostEntity, PostFactory } from "../../../core/entities/post.entity";
import { UserEntity, UserFactory } from "../../../core/entities/user.entity";
import {
  FileStorageServiceToken,
  IFileStorageService,
} from "../../create-post";
import { IsAuthenticatedGuard } from "../../../auth";
import { FeedbackEntity } from "../../../core/entities/feedback.entity";

const feature = loadFeature(
  path.join(__dirname, "../provide-feedback.feature")
);

defineFeature(feature, (test) => {
  const mockedFileStorage = mock<IFileStorageService>();
  let app: INestApplication;
  let dataSource: DataSource;
  let currentUser = UserFactory.create("Jim", "jim@gmail.com");

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FileStorageServiceToken)
      .useValue(mockedFileStorage)
      .overrideGuard(IsAuthenticatedGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = currentUser;

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

  test("I have not given feedback", ({ given, when, then }) => {
    let POST_SLUG: string;
    let POST_AUTHOR: string;

    given(
      /^We have a post with the title "(.*)" created by "(.*)" with no feedback$/,
      async (postTitle: string, authorName: string) => {
        const user = UserFactory.create(authorName, createRandomUserEmail());
        const { id, displayName } = await UserEntity.save(user, {
          reload: true,
        });
        const post = PostFactory.create(postTitle, createRandomUrl(), id);
        const createdPost = await PostEntity.save(post, { reload: true });
        POST_SLUG = createdPost.slug;
        POST_AUTHOR = displayName;
      }
    );

    let statusCode: number;
    let givenFeedback: string;

    when(
      /^"(.*)" gives the feedback "(.*)"$/,
      async (feedbackProvider, content) => {
        const user = UserFactory.create(
          feedbackProvider,
          createRandomUserEmail()
        );
        currentUser = await UserEntity.save(user);
        const response = await request(app.getHttpServer())
          .post(`/posts/${POST_AUTHOR}/${POST_SLUG}/feedback`)
          .send(new ProvideFeedbackDto(content));

        givenFeedback = content;
        statusCode = response.statusCode;
      }
    );

    then(
      /^"(.*)" should see the feedback given by "(.*)" on his post "(.*)"$/,
      async (authorName, feedbackProvider, postTitle) => {
        const post = await dataSource.getRepository(PostEntity).findOne({
          where: {
            slug: POST_SLUG,
            author: {
              name: authorName,
            },
          },
          relations: {
            author: true,
            feedback: {
              author: true,
            },
          },
        });

        expect(statusCode).toBe(201);
        expect(post).not.toEqual(null);
        expect(post!.title).toBe(postTitle);
        expect(post!.feedback).toHaveLength(1);
        expect(post!.feedback.at(0)!.content).toEqual(givenFeedback);
        expect(post!.feedback.at(0)!.author.name).toEqual(feedbackProvider);
      }
    );
  });

  test("I have given feedback", ({ given, when, then }) => {
    let POST_SLUG: string;
    let POST_AUTHOR: string;
    let POST_TITLE: string;

    given(
      /^We have a post with the title "(.*)" created by "(.*)" with feedback "(.*)" by "(.*)"$/,
      async (
        postTitle: string,
        postAuthor: string,
        feedbackContent: string,
        feedbackProvider: string
      ) => {
        const user = UserFactory.create(postAuthor, createRandomUserEmail());
        const { id, displayName } = await UserEntity.save(user, {
          reload: true,
        });
        const post = PostFactory.create(postTitle, createRandomUrl(), id);
        const createdPost = await PostEntity.save(post, { reload: true });
        const feedback = new FeedbackEntity();
        const author = UserFactory.create(
          feedbackProvider,
          createRandomUserEmail()
        );
        const createdAuthor = await UserEntity.save(author, { reload: true });
        feedback.author = createdAuthor;
        feedback.content = feedbackContent;
        feedback.post = createdPost;
        await FeedbackEntity.save(feedback);
        POST_TITLE = createdPost.title;
        POST_SLUG = createdPost.slug;
        POST_AUTHOR = displayName;
      }
    );

    let statusCode: number;

    when(/^"(.*)" tries to give feeback$/, async (feedbackProvider) => {
      const author = await UserEntity.findOneBy({
        name: feedbackProvider,
      });
      currentUser = author!;

      const response = await request(app.getHttpServer())
        .post(`/posts/${POST_AUTHOR}/${POST_SLUG}/feedback`)
        .send(new ProvideFeedbackDto("some feedback"));

      statusCode = response.status;
    });

    then(
      /^he cannot give feedback because he already has given feedback on "(.*)"$/,
      async (postTitle) => {
        expect(POST_TITLE).toEqual(postTitle);
        expect(statusCode).toBe(400);
      }
    );
  });

  test("Attempts to give feedback on their own post", ({
    given,
    when,
    then,
  }) => {
    let POST_SLUG: string;
    let POST_AUTHOR: string;
    let statusCode: number;

    given(/^"(.*)" has a post$/, async (authorName) => {
      const user = UserFactory.create(authorName, createRandomUserEmail());
      const { id, displayName } = await UserEntity.save(user, {
        reload: true,
      });
      const post = PostFactory.create("my post", createRandomUrl(), id);
      const createdPost = await PostEntity.save(post, { reload: true });
      POST_SLUG = createdPost.slug;
      POST_AUTHOR = displayName;
    });

    when(/^"(.*)" tries to give feedback$/, async (authorName) => {
      const response = await request(app.getHttpServer())
        .post(`/posts/${POST_AUTHOR}/${POST_SLUG}/feedback`)
        .send(new ProvideFeedbackDto("some content"));

      statusCode = response.statusCode;
    });

    then(
      /^"(.*)" will be told that he is not allowed to give feedback on his own post$/,
      () => {
        expect(statusCode).toBe(400);
      }
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});

function createRandomUserEmail(): string {
  return crypto.randomUUID().replace("-", " ");
}

function createRandomUrl(): string {
  return "https://" + crypto.randomUUID() + ".com";
}
