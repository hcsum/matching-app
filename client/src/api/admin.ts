import apiClient from "./ky";
import { MatchingEventResponse } from "./matching-event";

type ResultParticipant = {
  id: string;
  name: string;
  gender: string;
  eventNumber: number;
  isProfileValid: boolean;
};

export type GetAdminMatchingEventResultResponse = {
  matches: ResultParticipant[][];
};

export const getAdminMatchingEvent = async (params: {
  eventId: string;
  userId: string;
}) => {
  const json = await apiClient
    .get(`admin/${params.userId}/matching-event/${params.eventId}`)
    .json<MatchingEventResponse>();

  return json;
};

export const getAdminMatchingEventParticipants = async (params: {
  eventId: string;
  userId: string;
}) => {
  const json = await apiClient
    .get(`admin/${params.userId}/matching-event/${params.eventId}/participants`)
    .json<ResultParticipant[]>();

  return json;
};

export const getAdminMatchingEventResult = async (params: {
  eventId: string;
  userId: string;
}) => {
  const json = await apiClient
    .get(
      `admin/${params.userId}/matching-event/${params.eventId}/matching-results`
    )
    .json<GetAdminMatchingEventResultResponse>();

  return json;
};

export const updateMatchingEventSettings = async (params: {
  eventId: string;
  userId: string;
  data: {
    choosingStartsAt?: string;
    matchingStartsAt?: string;
    title?: string;
    phase?: string;
  };
}) => {
  const json = await apiClient
    .put(`admin/${params.userId}/matching-event/${params.eventId}/settings`, {
      json: params.data,
    })
    .json<MatchingEventResponse>();

  return json;
};
