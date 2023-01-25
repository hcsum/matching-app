import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "../user/model";
import { Round } from "../round/model";

@Entity()
export class Pick {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => Round, (round) => round.picks)
  round: string;

  @ManyToMany(() => User)
  @JoinTable()
  ownedBy: User;

  @ManyToMany(() => User)
  @JoinTable()
  picked: User;
}
