import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { FeedbackEntity } from "./feedback.entity";
import { UserEntity } from "./user.entity";
import slugify from "slugify";

@Entity({
  name: "Posts",
})
@Unique("title_author", ["title", "author"]) // TODO: write tests against unique constraint
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public title!: string;

  @Column({
    unique: true,
  })
  public url!: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn()
  public author!: UserEntity;

  @Column()
  public slug!: string;

  @Column({ nullable: false })
  public goal!: string;

  @BeforeInsert()
  public setSlug(): void {
    this.slug = slugify(this.title, {
      lower: true,
      trim: true,
      replacement: "-",
    });
  }

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.post)
  public feedback!: FeedbackEntity[];

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
    goal: string,
    createdAt?: Date
  ): PostEntity {
    const entity = new PostEntity();
    const author = new UserEntity();

    entity.title = title;
    entity.url = url;
    entity.goal = goal;

    if (createdAt) {
      entity.createdAt = createdAt;
    }

    author.id = authorId;
    entity.author = author;

    return entity;
  }
}
