import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreatePostModule } from "./features/create-post/create-post.module";

const features = [CreatePostModule];

@Module({
  imports: [
    ...features,
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://postgres:postgres@localhost/shednow-dev",
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
