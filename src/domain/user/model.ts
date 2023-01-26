import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Photo } from "../photo/model";

type Gender = "male" | "female";

@Entity()
export class User {
  static init({ name, wechatId }: Pick<User, "wechatId" | "name">) {
    const user = new User();
    user.wechatId = wechatId;
    user.name = name;

    return user;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: true })
  gender: Gender;

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "varchar", nullable: true })
  wechatId: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
