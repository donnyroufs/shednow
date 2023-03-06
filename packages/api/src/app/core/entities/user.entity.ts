import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Entity,
  BeforeInsert,
} from "typeorm";
import { PostEntity } from "./post.entity";

@Entity({
  name: "Users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({
    unique: false,
  })
  public name!: string;

  @Column({
    unique: true,
  })
  public displayName!: string;

  @Column({
    unique: true,
  })
  public email!: string;

  @Column({
    nullable: true,
  })
  public avatarUrl?: string;

  @BeforeInsert()
  public async setDisplayName(): Promise<void> {
    const count = await UserEntity.countBy({
      name: this.name,
    });

    const displayName = this.name.replace(/ /g, "").toLowerCase();

    this.displayName = count === 0 ? displayName : displayName + count;
  }

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
