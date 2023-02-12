import { Controller, Post } from "@nestjs/common";

@Controller("posts")
export class CreatePostController {
  @Post()
  public async handle(): Promise<any> {}
}
