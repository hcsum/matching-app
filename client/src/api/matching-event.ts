import apiClient from "./ky";
import { User } from "./user";

export type GetParticipantResponse = {
  participant: {
    hasConfirmedPicking: boolean;
    hasValidProfile: boolean;
    postMatchingAction: PostMatchingAction;
    hasPerformedPostMatchingAction: boolean;
  };
  participantsToPick: EventUser[];
};

export type Phase =
  | "INACTIVE"
  | "ENROLLING"
  | "CHOOSING"
  | "MATCHING"
  | "FINISHED";

export type MatchingEventResponse = {
  id: string;
  title: string;
  phase: Phase;
  choosingStartsAt: string;
  matchingStartsAt: string;
  description: Record<string, string>;
  isPrepaid: boolean;
};

export type Picking = {
  matchingEventId: string;
  madeByUserId: string;
  pickedUserId: string;
};

export type EventUser = Pick<
  User,
  "id" | "name" | "age" | "jobTitle" | "bio" | "photos" | "graduatedFrom"
>;

export type MatchedUser = EventUser & {
  isInsisted: boolean;
  isInsistResponded: boolean;
  isReverse: boolean;
};

export type MatchingResponse = {
  matched: MatchedUser[];
  insisted: MatchedUser[];
  waitingForInsistResponse: MatchedUser[];
};

export type PostMatchingAction = "INSIST" | "REVERSE" | undefined;

export async function getMatchingEventById(id: string) {
  const json = await apiClient
    .get(`matching-event/${id}`)
    .json<MatchingEventResponse>();

  return json;
}

export async function getLatestMatchingEvent() {
  const json = await apiClient
    .get(`matching-event`)
    .json<MatchingEventResponse>();

  return json;
}

export async function toggleUserPick(params: Picking) {
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
    .json<Picking[]>();

  return json;
}

export async function getMyPickingsByUserAndEvent(
  params: Pick<Picking, "madeByUserId" | "matchingEventId">
) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picked-users`
    )
    .json<EventUser[]>();

  return json;
}

export async function getUsersPickedMeByUserAndEvent(
  params: Pick<Picking, "pickedUserId" | "matchingEventId">
) {
  const json = await apiClient
    .get(
      `matching-event/${params.matchingEventId}/user/${params.pickedUserId}/users-picked-me`
    )
    .json<EventUser[]>();

  return json;
}

export async function getMatchingsByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient
    .get(`matching-event/${params.eventId}/user/${params.userId}/matches`)
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

export async function insistPickingByUser(params: {
  userId: string;
  eventId: string;
  pickedUserId: string;
}) {
  await apiClient.put(
    `matching-event/${params.eventId}/user/${params.userId}/post-matching-action/insist`,
    { json: { pickedUserId: params.pickedUserId } }
  );
}

export async function reversePickingByUser(params: {
  userId: string;
  eventId: string;
  madeByUserId: string;
}) {
  await apiClient.put(
    `matching-event/${params.eventId}/user/${params.userId}/post-matching-action/reverse`,
    { json: { madeByUserId: params.madeByUserId } }
  );
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

export async function getAllMatchingEvents() {
  const json = await apiClient
    .get(`matching-event/list`)
    .json<MatchingEventResponse[]>();

  return json;
}

export async function joinPrepaidMatchingEventByUserAndEvent(params: {
  userId: string;
  eventId: string;
}) {
  const json = await apiClient.post(
    `matching-event/${params.eventId}/user/${params.userId}/join-prepaid`
  );

  return json;
}
