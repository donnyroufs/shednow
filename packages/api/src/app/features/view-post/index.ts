import {
  Controller,
  Get,
  Module,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { PostEntity } from "../../core/entities/post.entity";
import { IsAuthenticatedGuard, User } from "../../auth";
import { UserEntity } from "../../core/entities/user.entity";

export class PostDetailsDto {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly title: string;
  @ApiProperty()
  public readonly slug: string;
  @ApiProperty()
  public readonly url: string;
  @ApiProperty()
  public readonly hasProvidedFeedback: boolean;
  @ApiProperty()
  public readonly isMyPost: boolean;
  @ApiProperty()
  public readonly authorName: string;
  @ApiProperty()
  public readonly authorAvatar?: string;
  @ApiProperty()
  public readonly feedback: FeedbackDto[];

  public constructor(data: PostDetailsDto) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.url = data.url;
    this.hasProvidedFeedback = data.hasProvidedFeedback;
    this.isMyPost = data.isMyPost;
    this.authorName = data.authorName;
    this.feedback = data.feedback;
    this.authorAvatar = data.authorAvatar;
  }
}

class FeedbackDto {
  @ApiProperty()
  public readonly content: string;
  @ApiProperty()
  public readonly authorName: string;
  @ApiProperty()
  public readonly authorAvatar?: string;

  public constructor(
    content: string,
    authorName: string,
    authorAvatar?: string
  ) {
    this.content = content;
    this.authorName = authorName;
    this.authorAvatar = authorAvatar;
  }
}

@Controller("/posts/:author/:slug")
@UseGuards(IsAuthenticatedGuard)
export class ViewPostController {
  @Get()
  public async handle(
    @Param("author") author: string,
    @Param("slug") slug: string,
    @User() user: UserEntity
  ): Promise<PostDetailsDto> {
    const post = await PostEntity.findOne({
      where: {
        author: {
          displayName: author,
        },
        slug,
      },
      relations: {
        author: true,
        feedback: {
          author: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return new PostDetailsDto({
      id: post.id,
      isMyPost: post.author.id === user.id,
      hasProvidedFeedback: post.feedback.some(
        (feedback) => feedback.author.id === user.id
      ),
      url: post.url,
      slug: post.slug,
      title: post.title,
      authorName: post.author.displayName,
      authorAvatar: post.author.avatarUrl,
      feedback: post.feedback.map(
        (feedback) =>
          new FeedbackDto(
            feedback.content,
            feedback.author.displayName,
            feedback.author.avatarUrl
          )
      ),
    });
  }
}

@Module({
  controllers: [ViewPostController],
})
export class ViewPostModule {}
