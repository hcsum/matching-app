import apiClient from "./ky";
import { User } from "./user";

export type Phase =
  | "inactive"
  | "enrolling"
  | "choosing"
  | "matching"
  | "ended";

export type MatchingEvent = {
  id: string;
  title: string;
  participants: User[];
  phase: Phase;
  startChoosingAt: Date;
  // pickings: Picking[]
};

export async function getMatchingEventById(id: string) {
  const json = await apiClient
    .get(`matching-event/${id}`)
    .json<MatchingEvent>();

  return json;
}

export async function getLatestMatchingEvent() {
  const json = await apiClient.get(`matching-event`).json<MatchingEvent>();

  return json;
}

export async function getMatchingEventForUser(eventId: string, userId: string) {
  const json = await apiClient
    .get(`matching-event/${eventId}/user/${userId}`)
    .json<MatchingEvent>();

  return json;
}

export async function getMatchingEventsByUserId(userId: string) {
  const json = await apiClient
    .get(`matching-events/user/${userId}`)
    .json<MatchingEvent[]>();

  return json;
}
