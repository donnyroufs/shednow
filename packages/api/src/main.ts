import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app/app.module";
import session from "express-session";
import passport from "passport";
import createRedisStore from "connect-redis";
import IoRedis from "ioredis";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  });
  app.set("trust proxy", 1);

  const config = new DocumentBuilder()
    .setTitle("shednow")
    .setVersion("0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const RedisStore = createRedisStore(session);
  const redisClient = new IoRedis(process.env.REDIS_URL);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: new RedisStore({ client: redisClient as any }),
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.DOMAIN,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
