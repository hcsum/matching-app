import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MatchingEvent } from "../matching-event/model";
import { User } from "../user/model";

// todo: 可能会难维护，不如直接通过query participant的所有picking来生成这些状态
export type PostMatchAction =
  | "insist"
  | "wait-for-insist-response"
  | "reverse"
  | "done";

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
  // hasPaid: boolean;

  // todo: 这个其实也可以通过query所有picking的状态来获得，没必要再存一个这个
  @Column({ type: "boolean", default: false })
  hasConfirmedPicking: boolean;

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

  @Column("varchar", { nullable: true })
  postMatchAction: PostMatchAction;

  setHasConfirmedPicking(hasConfirmedPicking: boolean) {
    this.hasConfirmedPicking = hasConfirmedPicking;
  }
  setPostMatchAction(action: PostMatchAction) {
    if (this.postMatchAction) throw new Error("postMatchAction already set");
    this.postMatchAction = action;
  }
  markPostMatchActionAsDone() {
    if (!this.postMatchAction)
      throw new Error("can not mark null action as done");
    this.postMatchAction = "done";
  }
}

