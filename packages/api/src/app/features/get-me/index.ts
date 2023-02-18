import { Controller, Get, Module, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsAuthenticatedGuard, User } from "../../auth";
import { UserEntity } from "../../core/entities/user.entity";

@Controller("auth")
@ApiTags("auth")
export class GetMeController {
  @Get("/me")
  @UseGuards(IsAuthenticatedGuard)
  public async me(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}

@Module({
  controllers: [GetMeController],
})
export class GetMeModule {}
