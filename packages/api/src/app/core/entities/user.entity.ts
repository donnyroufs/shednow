import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Entity,
} from "typeorm";
import { PostEntity } from "./post.entity";

@Entity({
  name: "Users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @Column({
    unique: true,
  })
  public email!: string;

  @Column({
    nullable: true,
  })
  public avatarUrl?: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  public posts!: PostEntity[];
}

export class UserFactory {
  public static USER_ID = "19df2674-8c12-4269-9066-462c8ec4d8fa";

  public static create(
    name: string,
    email: string,
    avatarUrl?: string
  ): UserEntity {
    const entity = new UserEntity();

    entity.name = name;
    entity.email = email;
    entity.avatarUrl = avatarUrl;

    return entity;
  }
}
