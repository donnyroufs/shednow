import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedbackEntity } from "./entities/feedback.entity";
import { PostEntity } from "./entities/post.entity";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [PostEntity, UserEntity, FeedbackEntity],
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    }),
  ],
})
export class CoreModule {}
