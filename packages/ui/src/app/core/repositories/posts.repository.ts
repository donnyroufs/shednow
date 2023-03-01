import { axios } from "../axios";
import { AxiosResponse } from "axios";

export class PostsRepository {
  public static async provideFeedback(
    authorName: string,
    slug: string,
    data: ProvideFeedbackDto
  ): Promise<void> {
    await axios.post(
      `/posts/${authorName}/${slug}/feedback`,
      JSON.stringify(data),
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  }

  public static async findOneByAuthorAndSlug(
    authorName: string,
    slug: string
  ): Promise<PostDetailsDto> {
    return axios
      .get<PostDetailsDto>(`/posts/${authorName}/${slug}`)
      .then(({ data, status }) => {
        if (status !== 200) {
          throw new Error("post not found");
        }

        return new PostDetailsDto(JSON.parse(data as any));
      });
  }

  public static create(data: CreatePostDto): Promise<AxiosResponse> {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("goal", data.goal);
    formData.append("file", data.file);

    return axios.post("/posts", formData);
  }
}

class ProvideFeedbackDto {
  public constructor(public readonly content: string) {}
}

class FeedbackDto {
  public readonly content: string;
  public readonly authorName: string;
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

export class PostDetailsDto {
  public readonly id: string;
  public readonly title: string;
  public readonly slug: string;
  public readonly url: string;
  public readonly hasProvidedFeedback: boolean;
  public readonly isMyPost: boolean;
  public readonly authorName: string;
  public readonly authorAvatar?: string;
  public readonly feedback: FeedbackDto[];
  public readonly goal: string;

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
    this.goal = data.goal;
  }
}

class CreatePostDto {
  public constructor(
    public readonly title: string,
    public readonly goal: string,
    public readonly file: File
  ) {}
}
