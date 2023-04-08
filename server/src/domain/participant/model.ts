import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MatchingEvent } from "../matching-event/model";
import { User } from "../user/model";

@Entity()
export class Participant {
  static init(params: {
    // has_paid: boolean;
    userId: string;
    matchingEventId: string;
  }) {
    const participant = new Participant();
    // participant.has_paid = params.has_paid;
    participant.userId = params.userId;
    participant.matchingEventId = params.matchingEventId;
    return participant;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column({ type: "boolean", default: false })
  // has_paid: boolean;

  @Column({ type: "boolean", default: false })
  has_confirmed_picking: boolean = false;

  @ManyToOne(() => User, (user) => user.matchingEvents)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => MatchingEvent, (matchingEvent) => matchingEvent.participants)
  @JoinColumn({ name: "matchingEventId" })
  matchingEvent: MatchingEvent;

  @Column("uuid")
  userId: string;

  @Column("uuid")
  matchingEventId: string;
}

