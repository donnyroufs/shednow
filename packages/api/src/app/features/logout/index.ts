import { Controller, Delete, HttpCode, Module, Req } from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
export class LogoutController {
  @Delete("/logout")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  public logout(@Req() req: Request): void {
    req.logOut((err) => err);
  }
}

@Module({
  controllers: [LogoutController],
})
export class LogoutModule {}
