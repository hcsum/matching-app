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

@Entity()
export class MatchingEvent {
  static init({
    startedAt,
    title,
  }: Pick<MatchingEvent, "startedAt" | "title">) {
    const matchingEvent = new MatchingEvent();
    matchingEvent.startedAt = startedAt;
    matchingEvent.title = title;

    return matchingEvent;
  }
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date" })
  startedAt: Date;

  @Column({ type: "varchar", nullable: true })
  title: string;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Picking, (picking) => picking.matchingEvent)
  pickings: Picking[];
}
