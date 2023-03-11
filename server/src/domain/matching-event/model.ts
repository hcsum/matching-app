/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Picking } from "../picking/model";
import { User } from "../user/model";

// inactive 未对外开放的活动，不能参加
// matching 包括了反选和坚持
type Stage = "inactive" | "registration" | "choosing" | "matching" | "ended";

@Entity()
class MatchingEvent {
  static init({ title }: Pick<MatchingEvent, "title">) {
    const matchingEvent = new MatchingEvent();
    matchingEvent.title = title;

    return matchingEvent;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", default: "registration" })
  stage: Stage = "registration";

  @Column({ type: "varchar" })
  title: string;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Picking, (picking) => picking.matchingEvent)
  pickings: Picking[];
}

export { MatchingEvent, Stage };
