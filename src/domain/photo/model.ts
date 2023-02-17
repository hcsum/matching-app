import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "../user/model"


export type PhotoInitParams = Pick<
  Photo,
  "user"| "url"
  >
@Entity()
export class Photo {
    static init({url, user}:PhotoInitParams): Photo {
        const photo = new Photo();
        photo.url = url;
        photo.user = user;
        return photo;
      }
      
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    url: string

    @ManyToOne(() => User, (user) => user.photos)
    user: User

 
}