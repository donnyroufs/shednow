import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({
  name: "Posts",
})
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({
    unique: true,
  })
  public title!: string;

  @Column({
    unique: true,
  })
  public url!: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn()
  public author!: UserEntity;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

export class PostFactory {
  public static create(
    title: string,
    url: string,
    authorId: string,
    createdAt?: Date
  ): PostEntity {
    const entity = new PostEntity();
    const author = new UserEntity();

    entity.title = title;
    entity.url = url;

    if (createdAt) {
      entity.createdAt = createdAt;
    }

    author.id = authorId;
    entity.author = author;

    return entity;
  }
}
