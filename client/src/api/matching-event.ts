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
};

export type Picking = {
  matchingEventId: string;
  madeByUserId: string;
  pickedUserId: string;
};

export type Matching = Pick<User, "name" | "age" | "jobTitle"> & {
  photoUrl: string;
};

export type Participant = {
  hasConfirmedPicking: boolean;
  // hasPaid: boolean;
  // hasConfirmedMatching: boolean;
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

export async function toggleUserPick(
  params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
) {
  const json = await apiClient
    .put(
      `matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picking`,
      { json: { pickedUserId: params.pickedUserId } }
    )
    .text();

  return json;
}

export async function confirmPickingByUser(params: {
  userId: string;
  matchingEventId: string;
}) {
  const json = await apiClient
    .post(
      `matching-event/${params.matchingEventId}/user/${params.userId}/picking/confirm`,
      { json: {} }
    )
    .text();

  return json;
}

export async function getPickingsByUserAndEvent(
  params: Pick<Picking, "madeByUserId" | "matchingEventId">
) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picking`
    )
    // todo: only return pickedUserId array is enough
    .json<Picking[]>();

  return json;
}

export async function getMatchingsByUserAndEvent(params: {
  userId: string;
  matchingEventId: string;
}) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.userId}/matching`
    )
    .json<Matching[]>();

  return json;
}

export async function getParticipantByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .get(`matching-event/${params.eventId}/user/${params.userId}/participant`)
    .json<Participant>();

  return json;
}
