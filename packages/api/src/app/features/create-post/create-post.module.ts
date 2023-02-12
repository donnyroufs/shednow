import { Module } from "@nestjs/common";
import { CreatePostController } from "./index";

@Module({
  controllers: [CreatePostController],
})
export class CreatePostModule {}
