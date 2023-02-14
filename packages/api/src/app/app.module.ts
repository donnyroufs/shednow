import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreatePostModule } from "./features/create-post";
import { PostEntity } from "./features/create-post/post.entity";

const features = [CreatePostModule];

@Module({
  imports: [
    ...features,
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://postgres:postgres@localhost/shednow-dev",
      synchronize: true,
      entities: [PostEntity],
    }),
  ],
})
export class AppModule {}
