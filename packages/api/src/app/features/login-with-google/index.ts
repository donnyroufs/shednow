import {
  Controller,
  ExecutionContext,
  Get,
  Injectable,
  Module,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { UserEntity, UserFactory } from "../../core/entities/user.entity";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  public override async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const activate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return activate as boolean;
  }
}

@Controller("auth/google")
@ApiTags("auth")
class LoginWithGoogleController {
  @Get()
  @UseGuards(GoogleAuthGuard)
  public async googleAuth(): Promise<void> {}

  @Get("redirect")
  @UseGuards(GoogleAuthGuard)
  public googleAuthRedirect(@Res() res: Response): any {
    return res.redirect(process.env.REDIRECT_URI!);
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  public constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  public async validate(
    _: string,
    __: string,
    profile: any
  ): Promise<UserEntity> {
    const { displayName, emails, photos } = profile;

    const foundUser = await UserEntity.findOneBy({
      email: emails.at(0).value,
    });

    const user = UserFactory.create(
      displayName,
      emails.at(0)?.value,
      photos.at(0)?.value
    );

    if (!foundUser) {
      await user.save();
    }

    return foundUser || user;
  }
}

@Module({
  providers: [GoogleAuthGuard, GoogleStrategy],
  controllers: [LoginWithGoogleController],
})
export class LoginWithGoogleModule {}
