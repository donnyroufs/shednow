import { Module } from "@nestjs/common";
import { CreatePostModule } from "./features/create-post";
import { ViewPostsModule } from "./features/view-posts";
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./auth";
import { LoginWithGoogleModule } from "./features/login-with-google";
import { LogoutModule } from "./features/logout";
import { GetMeModule } from "./features/get-me";
import { ProvideFeedbackModule } from "./features/provide-feedback";
import { ViewPostModule } from "./features/view-post";

const features = [
  CreatePostModule,
  ViewPostsModule,
  LoginWithGoogleModule,
  LogoutModule,
  GetMeModule,
  ProvideFeedbackModule,
  ViewPostModule,
];

@Module({
  imports: [...features, CoreModule, AuthModule],
})
export class AppModule {}
