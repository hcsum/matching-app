import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Pick } from "../pick/model";
import { User } from "../user/model";

@Entity()
export class Round {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "date" })
  startedAt: Date;

  @Column({ type: "varchar" })
  title: string;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Pick, (pick) => pick.round)
  picks: Pick[];
}
