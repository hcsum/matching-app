import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "../user/model"

@Entity()
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    url: string

    @ManyToOne(() => User, (user) => user.photos)
    user: User
}