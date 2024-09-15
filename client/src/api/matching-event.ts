import apiClient from "./ky";
import { User } from "./user";

export type GetParticipantResponse = {
  participant: Participant;
  event: MatchingEvent;
};

export type Phase =
  | "inactive"
  | "enrolling"
  | "choosing"
  | "matching"
  | "result";

export type MatchingEvent = {
  id: string;
  title: string;
  participants: User[];
  phase: Phase;
  startChoosingAt: string;
  description: Record<string, string>;
};

export type Picking = {
  matchingEventId: string;
  madeByUserId: string;
  pickedUserId: string;
};

export type MatchedUser = Pick<User, "id" | "name" | "age" | "jobTitle"> & {
  photoUrl: string;
  isInsisted?: boolean;
  isInsistResponded?: boolean;
};

export type MatchingResponse = {
  matched: MatchedUser[];
  insisted: MatchedUser[];
  reverse: MatchedUser[];
};

export type PostMatchingAction = "insist" | "reverse" | undefined;

export type PostMatchingStaus = "wait-for-insist-response" | "done" | "not-set";

export type Participant = {
  hasConfirmedPicking: boolean;
  postMatchingAction: PostMatchingAction;
  id: string;
  matchingEvent: MatchingEvent;
  userId: string;
  postMatchingStatus: PostMatchingStaus;
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
    .put(
      `matching-event/${params.matchingEventId}/user/${params.userId}/picking/confirm`
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

export type PickedUser = Pick<User, "id" | "name" | "age" | "jobTitle"> & {
  photoUrl: string;
  pickingId: string;
};

export async function getMyPickingsByUserAndEvent(
  params: Pick<Picking, "madeByUserId" | "matchingEventId">
) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picked-users`
    )
    .json<PickedUser[]>();

  return json;
}

export async function getUsersPickedMeByUserAndEvent(
  params: Pick<Picking, "pickedUserId" | "matchingEventId">
) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.pickedUserId}/users-picked-me`
    )
    .json<PickedUser[]>();

  return json;
}

export async function getMatchingsByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .get(`matching-event/${params.eventId}/user/${params.userId}/matching`)
    .json<MatchingResponse>();

  return json;
}

export async function getParticipantByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .get(`matching-event/${params.eventId}/user/${params.userId}/participant`)
    .json<GetParticipantResponse>();

  return json;
}

export async function setParticipantPostMatchAction(params: {
  userId: string;
  eventId: string;
  action: PostMatchingAction;
}) {
  const json = await apiClient
    .put(
      `matching-event/${params.eventId}/user/${params.userId}/post-matching-action`,
      { json: { action: params.action } }
    )
    .text();

  return json;
}

export async function insistChoosingByUser(params: {
  userId: string;
  eventId: string;
  pickedUserId: string;
}) {
  const json = await apiClient
    .put(
      `matching-event/${params.eventId}/user/${params.userId}/post-matching-action/insist`,
      { json: { pickedUserId: params.pickedUserId } }
    )
    .json<Participant>();

  return json;
}

export async function reverseChoosingByUser(params: {
  userId: string;
  eventId: string;
  madeByUserId: string;
}) {
  const json = await apiClient
    .put(
      `matching-event/${params.eventId}/user/${params.userId}/post-matching-action/reverse`,
      { json: { madeByUserId: params.madeByUserId } }
    )
    .json<Participant>();

  return json;
}

export async function responseInsistPickingByUser(params: {
  userId: string;
  eventId: string;
  insistedUserId: string;
}) {
  const json = await apiClient
    .put(
      `matching-event/${params.eventId}/user/${params.userId}/post-matching-action/response-insist`,
      { json: { insistedUserId: params.insistedUserId } }
    )
    .text();

  return json;
}

export async function joinMatchingEventByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .post(`matching-event/${params.eventId}/user/${params.userId}/join`)
    .json<{ form: string }>();

  return json;
}

export async function checkParticipantByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .get(
      `matching-event/${params.eventId}/user/${params.userId}/participant/check`
    )
    .json<{ isParticipant: boolean }>();

  return json;
}
