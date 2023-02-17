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

  @Column({
    unique: true,
  })
  public name!: string;

  @Column({
    nullable: true,
  })
  public avatarUrl?: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  public posts!: PostEntity[];
}

export class UserFactory {
  public static USER_ID = "19df2674-8c12-4269-9066-462c8ec4d8fa";

  public static create(name: string): UserEntity {
    const entity = new UserEntity();

    entity.name = name;

    return entity;
  }

  public static async createTemporaryDefaultUserAsync(): Promise<UserEntity> {
    const user = await UserEntity.findOne({
      where: {
        id: UserFactory.USER_ID,
      },
    });

    if (!user) {
      const user = new UserEntity();
      user.id = UserFactory.USER_ID;
      user.name = "default-user";
      user.avatarUrl = "https://api.dicebear.com/5.x/personas/svg";
      await user.save();
      return user;
    }

    return user;
  }
}
