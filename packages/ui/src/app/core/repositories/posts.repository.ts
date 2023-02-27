import { axios } from "../axios";

export class PostsRepository {
  public static async provideFeedback(
    authorName: string,
    slug: string,
    data: ProvideFeedbackDto
  ): Promise<void> {
    await axios.post(`/posts/${authorName}/${slug}/feedback`, data);
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
}

class ProvideFeedbackDto {
  public constructor(public readonly content: string) {}
}

export class PostDetailsDto {
  public readonly id: string;
  public readonly title: string;
  public readonly slug: string;
  public readonly url: string;
  public readonly hasProvidedFeedback: boolean;
  public readonly isMyPost: boolean;

  public constructor(data: PostDetailsDto) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.url = data.url;
    this.hasProvidedFeedback = data.hasProvidedFeedback;
    this.isMyPost = data.isMyPost;
  }
}
