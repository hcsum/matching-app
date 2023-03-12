import ky from "ky";
import { User } from "./user";

export type Phase =
  | "inactive"
  | "registration"
  | "choosing"
  | "matching"
  | "ended";

export type MatchingEvent = {
  id: string;
  title: string;
  participants: User[];
  phase: Phase;
  // pickings: Picking[]
};

export async function getMatchingEvent(id: string) {
  const json = await ky
    .get(`http://localhost:4000/api/matching-event/${id}`)
    .json<MatchingEvent>();

  return json;
}

export async function getMatchingEventForUser(eventId: string, userId: string) {
  const json = await ky
    .get(`http://localhost:4000/api/matching-event/${eventId}/user/${userId}`)
    .json<MatchingEvent>();

  return json;
}

export async function getMatchingEventsByUserId(userId: string) {
  const json = await ky
    .get(`http://localhost:4000/api/matching-events/user/${userId}`)
    .json<MatchingEvent[]>();

  return json;
}
