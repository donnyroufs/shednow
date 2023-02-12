import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "Posts",
})
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column({
    unique: true,
  })
  public readonly title: string;

  @Column({
    unique: true,
  })
  public readonly url: string;

  @Column()
  public readonly authorId: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  public constructor(title: string, url: string, authorId: string) {
    super();

    this.title = title;
    this.url = url;
    this.authorId = authorId;
  }
}
