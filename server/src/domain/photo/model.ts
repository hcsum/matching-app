/* eslint-disable import/no-cycle */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../user/model";

export type PhotoInitParams = Pick<Photo, "user" | "cosLocation">;
@Entity()
export class Photo {
  static init({ cosLocation, user }: PhotoInitParams): Photo {
    const photo = new Photo();
    photo.cosLocation = cosLocation;
    photo.user = user;
    return photo;
  }

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column("varchar")
  cosLocation: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}

