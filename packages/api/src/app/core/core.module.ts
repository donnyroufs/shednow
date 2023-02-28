import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedbackEntity } from "./entities/feedback.entity";
import { PostEntity } from "./entities/post.entity";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://postgres:postgres@localhost/shednow-dev",
      synchronize: true,
      entities: [PostEntity, UserEntity, FeedbackEntity],
    }),
  ],
})
export class CoreModule {}
