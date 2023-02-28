import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: "Feedback",
})
@Unique("post_author", ["post.id", "author.id"])
export class FeedbackEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({
    type: "text",
  })
  public content!: string;

  @ManyToOne(() => PostEntity, (post) => post.feedback)
  public post!: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn()
  public author!: UserEntity;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
