import ky from "ky";
import { User } from "./user";

export type MatchingEvent = {
  id: string;
  startedAt: Date;
  hasEnded: boolean;
  title: string;
  participants: User[];
  // pickings: Picking[]
};

export async function getMatchingEvent(id: string) {
  const json = await ky
    .get(`http://localhost:4000/api/matching-event/${id}`)
    .json<MatchingEvent>();

  return json;
}

export async function getMatchingEventsByUserId(userId: string) {
  const json = await ky
    .get(`http://localhost:4000/api/matching-event/user/${userId}`)
    .json<MatchingEvent[]>();

  return json;
}
