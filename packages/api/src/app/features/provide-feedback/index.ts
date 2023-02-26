import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Module,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { IsAuthenticatedGuard, User } from "../../auth";
import { FeedbackEntity } from "../../core/entities/feedback.entity";
import { PostEntity } from "../../core/entities/post.entity";
import { UserEntity } from "../../core/entities/user.entity";

export class ProvideFeedbackDto {
  @ApiProperty()
  public readonly content: string;

  public constructor(content: string) {
    this.content = content;
  }
}

@Controller("posts/:author/:title/feedback")
@UseGuards(IsAuthenticatedGuard)
class ProvideFeedbackController {
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  public async handle(
    @Body() data: ProvideFeedbackDto,
    @User() user: UserEntity,
    @Param("author") authorName: string,
    @Param("title") title: string
  ): Promise<void> {
    const feedback = new FeedbackEntity();
    const post = await PostEntity.findOne({
      where: {
        title,
        author: {
          name: authorName,
        },
      },
      relations: {
        feedback: {
          author: true,
        },
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException("No post");
    }

    const author = await UserEntity.findOneBy({
      name: user.name,
    });

    if (!author) {
      throw new UnauthorizedException();
    }

    if (post.author.name === user.name) {
      throw new BadRequestException("cannot give feedback on your own post");
    }

    feedback.author = author;
    feedback.post = post;
    feedback.content = data.content;

    await feedback.save().catch(err => {
      throw new BadRequestException(err.message)
    });
  }
}

@Module({
  controllers: [ProvideFeedbackController],
})
export class ProvideFeedbackModule {}
