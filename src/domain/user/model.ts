import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import jwt from "jsonwebtoken";
import { Photo } from "../photo/model";

type Gender = "male" | "female";

export type UserInitParams = Partial<
  Pick<User, "age" | "name" | "gender" | "phoneNumber" | "jobTitle">
>;

export type UserUpdateParams = Partial<
  Pick<User, "age" | "name" | "gender" | "jobTitle" | "bio">
>;

@Entity()
export class User {
  static init({ name, age, gender, phoneNumber, jobTitle }: UserInitParams) {
    const user = new User();
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.phoneNumber = phoneNumber;
    user.jobTitle = jobTitle;
    user.initBio();
    user.setLoginToken();

    return user;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  name: string;

  @Column({ type: "varchar", nullable: true })
  gender: Gender;

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "varchar", nullable: true })
  jobTitle: string;

  @Column({ type: "varchar", nullable: true })
  wechatId: string;

  @Column({ type: "jsonb", default: "{}" })
  bio: Record<string, string>;

  @Column({
    type: "varchar",
    nullable: true,
    comment: "will replace with Wechat OAuth token",
  })
  loginToken: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  initBio() {
    this.bio = {
      有什么业余兴趣爱好: "",
      你的理想型: "",
      关于你: "",
    };
  }

  setLoginToken() {
    this.loginToken = jwt.sign(this.phoneNumber, process.env.USER_TOKEN_SECRET);
  }

  verifyLoginToken(token: string): boolean {
    const payload = jwt.verify(token, process.env.USER_TOKEN_SECRET);

    return payload === this.phoneNumber;
  }

  update({ age, bio, gender, jobTitle, name }: UserUpdateParams) {
    this.bio = bio || this.bio;
    this.name = name || this.name;
    this.age = age || this.age;
    this.gender = gender || this.gender;
    this.jobTitle = jobTitle || this.jobTitle;
  }
}
