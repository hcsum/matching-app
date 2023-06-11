import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MatchingEvent } from "../matching-event/model";
import { User } from "../user/model";

export type PostMatchingAction = "insist" | "reverse" | undefined;

@Entity()
export class Participant {
  static init(params: {
    // hasPaid: boolean;
    userId: string;
    matchingEventId: string;
  }) {
    const participant = new Participant();
    // participant.hasPaid = params.hasPaid;
    participant.userId = params.userId;
    participant.matchingEventId = params.matchingEventId;
    return participant;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column({ type: "boolean", default: false })
  // hasPaid: boolean;

  @Column({ type: "boolean", default: false })
  hasConfirmedPicking: boolean;

  @ManyToOne(() => User, (user) => user.matchingEvents)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => MatchingEvent, (matchingEvent) => matchingEvent.participants)
  @JoinColumn({ name: "matchingEventId" })
  matchingEvent: MatchingEvent;

  @Column("uuid")
  matchingEventId: string;

  @Column("varchar", { nullable: true })
  postMatchingAction: PostMatchingAction;

  setHasConfirmedPicking(hasConfirmedPicking: boolean) {
    this.hasConfirmedPicking = hasConfirmedPicking;
  }
  setPostMatchAction(action: PostMatchingAction) {
    if (this.postMatchingAction)
      throw new Error("postMatchingAction already set");
    this.postMatchingAction = action;
  }
}

