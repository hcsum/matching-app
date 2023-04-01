/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { User } from "../user/model";
import { MatchingEvent } from "../matching-event/model";

@Entity()
export class Picking {
  static init({
    matchingEventId,
    madeByUserId,
    pickedUserId,
  }: Pick<Picking, "matchingEventId" | "madeByUserId" | "pickedUserId">) {
    const picking = new Picking();
    picking.matchingEventId = matchingEventId;
    picking.madeByUserId = madeByUserId;
    picking.pickedUserId = pickedUserId;

    return picking;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MatchingEvent, (matchingEvent) => matchingEvent.pickings)
  @JoinColumn({ name: "matchingEventId" })
  matchingEvent: MatchingEvent;

  @Column("uuid")
  matchingEventId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "madeByUserId" })
  madeByUser: User;

  @Column("uuid")
  madeByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "pickedUserId" })
  pickedUser: User;

  @Column("uuid")
  pickedUserId: string;

  @Column("bool", { default: false })
  isConfirmed: Boolean = false;
}

