import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  Module,
} from "@nestjs/common";
import { PassportSerializer, PassportModule } from "@nestjs/passport";
import { UserEntity } from "../core/entities/user.entity";

type VerifyCallback = (error: Error | null, user: UserEntity | null) => void;

export class IsAuthenticatedGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return Boolean(context.switchToHttp().getRequest().user);
  }
}

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public serializeUser(user: UserEntity, done: any): void {
    done(null, user);
  }

  public async deserializeUser(
    payload: any,
    done: VerifyCallback
  ): Promise<any> {
    const user = await UserEntity.findOneBy({
      email: payload.email,
    });

    return user ? done(null, user) : done(new Error("not allowed"), null);
  }
}

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [SessionSerializer, IsAuthenticatedGuard],
})
export class AuthModule {}
