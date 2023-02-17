import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";
import { UserEntity, UserFactory } from "./app/core/entities/user.entity";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: "*",
  });

  const config = new DocumentBuilder()
    .setTitle("shednow")
    .setVersion("0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await UserFactory.createTemporaryDefaultUserAsync();

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
