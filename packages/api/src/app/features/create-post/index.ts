import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Inject,
  Module,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsString } from "class-validator";
import { ApiConsumes, ApiProperty } from "@nestjs/swagger";

import credentials from "./creds.json";
import { PostEntity } from "./post.entity";

class CreatePostRequest {
  @IsString()
  @ApiProperty({
    description: "post title",
    default: "my amazing post",
  })
  public readonly title!: string;

  // Required for open api spec
  @ApiProperty({ type: "file", name: "file" })
  private _file?: any;
}

class CreatePostResponse {
  @ApiProperty()
  public readonly id: string;

  public constructor(id: string) {
    this.id = id;
  }
}

export interface IFileStorageService {
  store(fileName: UniqueFileName, file: Buffer): Promise<string>;
}

export const FileStorageServiceToken = Symbol("IFileStorageService");

class UniqueFileName {
  public readonly value: string;

  public constructor(
    { title }: CreatePostRequest,
    userId: string,
    { originalname }: ExpressMulter
  ) {
    this.value = `${userId}-${title}-${originalname}`;
  }
}

export type ExpressMulter = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Controller("posts")
export class CreatePostController {
  public constructor(
    @Inject(FileStorageServiceToken)
    private readonly _fileStorageService: IFileStorageService
  ) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  public async handle(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeValidator({
            fileType: "audio/mpeg",
          }),
        ],
      })
    )
    file: ExpressMulter,
    @Body(new ValidationPipe()) data: CreatePostRequest
  ): Promise<CreatePostResponse> {
    const userId = "123456-fake-user-id";

    try {
      const downloadUrl = await this.storeFile(data, userId, file);
      const post = await this.createPost(data, downloadUrl, userId);
      return new CreatePostResponse(post.id);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  private async storeFile(
    data: CreatePostRequest,
    userId: string,
    file: ExpressMulter
  ): Promise<string> {
    // TODO: Write contract tests against this.
    return this._fileStorageService.store(
      new UniqueFileName(data, userId, file),
      file.buffer
    );
  }

  private async createPost(
    data: CreatePostRequest,
    downloadUrl: string,
    userId: string
  ): Promise<PostEntity> {
    const post = new PostEntity(data.title, downloadUrl, userId);
    await post.save();
    return post;
  }
}

class GCPFileStorageImpl implements IFileStorageService {
  public constructor(private readonly _storage: Storage) {}

  public async store(fileName: UniqueFileName, file: Buffer): Promise<string> {
    await this._storage
      .bucket("shednow_uploads")
      .file(fileName.value)
      .save(file);

    return "https://storage.cloud.google.com/shednow_uploads/" + fileName.value;
  }
}

@Module({
  controllers: [CreatePostController],
  providers: [
    {
      provide: FileStorageServiceToken,
      useFactory: (): IFileStorageService =>
        new GCPFileStorageImpl(
          new Storage({
            credentials,
          })
        ),
    },
  ],
})
export class CreatePostModule {}
