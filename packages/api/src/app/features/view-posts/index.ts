import {
  Controller,
  Get,
  Module,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsAuthenticatedGuard } from "../../auth";
import { PostEntity } from "../../core/entities/post.entity";

export class PostDto {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly title: string;
  @ApiProperty()
  public readonly authorName: string;
  @ApiProperty()
  public readonly url: string;
  @ApiProperty()
  public readonly avatarUrl?: string;

  public constructor(
    id: string,
    title: string,
    authorName: string,
    url: string,
    avatarUrl?: string
  ) {
    this.id = id;
    this.title = title;
    this.authorName = authorName;
    this.url = url;
    this.avatarUrl = avatarUrl;
  }
}

export class GetPostsResponse {
  @ApiProperty({
    type: PostDto,
    isArray: true,
  })
  public readonly posts: PostDto[];

  @ApiProperty()
  public readonly currentPage: number;

  @ApiProperty()
  public readonly totalPages: number;

  public constructor(
    posts: PostDto[],
    currentPage: number,
    totalPages: number
  ) {
    (this.currentPage = currentPage), (this.posts = posts);
    this.totalPages = totalPages;
  }
}

@Controller("posts")
@ApiTags("posts")
class ViewPostsController {
  private static PAGE_SIZE = 10;

  @Get("/")
  @ApiResponse({
    type: GetPostsResponse,
    status: 200,
  })
  public async handle(
    @Query("page", ParseIntPipe) page: number
  ): Promise<GetPostsResponse> {
    const [posts, count] = await PostEntity.findAndCount({
      relations: ["author"],
      take: ViewPostsController.PAGE_SIZE,
      skip: ViewPostsController.PAGE_SIZE * (page - 1),
      order: {
        createdAt: "DESC",
      },
    });

    const totalPages = Math.ceil(count / ViewPostsController.PAGE_SIZE);
    const currentPage = page;

    const postDtos = posts.map(
      (post) =>
        new PostDto(
          post.id,
          post.title,
          post.author.name,
          post.url,
          post.author.avatarUrl
        )
    );

    return new GetPostsResponse(postDtos, currentPage, totalPages);
  }
}

@Module({
  controllers: [ViewPostsController],
})
export class ViewPostsModule {}
