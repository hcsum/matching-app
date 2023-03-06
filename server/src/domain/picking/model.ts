/* eslint-disable import/no-cycle */
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../user/model";
import { MatchingEvent } from "../matching-event/model";

@Entity()
export class Picking {
  static init({
    matchingEvent,
    madeByUser,
    pickedUser,
  }: Pick<Picking, "matchingEvent" | "madeByUser" | "pickedUser">) {
    const picking = new Picking();
    picking.matchingEvent = matchingEvent;
    picking.madeByUser = madeByUser;
    picking.pickedUser = pickedUser;

    return picking;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MatchingEvent, (matchingEvent) => matchingEvent.pickings)
  matchingEvent: string;

  @ManyToOne(() => User)
  madeByUser: User;

  @ManyToOne(() => User)
  pickedUser: User;
}
