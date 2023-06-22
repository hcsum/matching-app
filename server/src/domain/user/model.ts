/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import jwt from "jsonwebtoken";
import { Photo } from "../photo/model";
import { Picking } from "../picking/model";
import { MatchingEvent } from "../matching-event/model";
import { Participant } from "../participant/model";

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

  @Column({
    type: "varchar",
    nullable: true,
    comment: "not in use due to wechat issue",
  })
  wechatId: string;

  @Column({ type: "jsonb", default: "{}" })
  bio: Record<string, string>;

  @Column({
    type: "varchar",
    nullable: true,
  })
  loginToken: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Picking, (picking) => picking.madeByUser)
  pickings: Picking[];

  @OneToMany(() => Participant, (participant) => participant.user)
  matchingEvents: MatchingEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  initBio() {
    this.bio = {
      关于我: "",
      我的理想型: "",
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

