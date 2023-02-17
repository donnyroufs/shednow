import { Module } from "@nestjs/common";
import { CreatePostModule } from "./features/create-post";
import { ViewPostsModule } from "./features/view-posts";
import { CoreModule } from "./core/core.module";

const features = [CreatePostModule, ViewPostsModule];

@Module({
  imports: [...features, CoreModule],
})
export class AppModule {}
