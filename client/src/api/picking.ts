import apiClient from "./ky";

export type Picking = {
  id: string;
  matchingEventId: string;
  madeByUserId: string;
  pickedUserId: string;
};

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

export async function confirmPickingsByUser(params: {
  madeByUserId: string;
  matchingEventId: string;
  pickedUserIds: string[];
}) {
  const json = await apiClient
    .post(
      `matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picking/confirm`,
      { json: { pickedUserIds: params.pickedUserIds } }
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
