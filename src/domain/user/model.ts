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

export type UserInitParams = Pick<
  User,
  "age" | "name" | "gender" | "phoneNumber" | "jobTitle"
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

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  gender: Gender;

  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;

  @Column({ type: "int", nullable: false })
  age: number;

  @Column({ type: "varchar", nullable: false })
  jobTitle: string;

  @Column({ type: "varchar", nullable: true })
  wechatId: string;

  @Column({ type: "jsonb", default: "{}" })
  bio: Record<string, string>;

  @Column({
    type: "varchar",
    nullable: false,
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

  updateBio(bio: Record<string, string>) {
    this.bio = bio;
  }
}
