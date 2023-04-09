import apiClient from "./ky";

export type Picking = {
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

export async function confirmPickingByUser(params: {
  userId: string;
  matchingEventId: string;
}) {
  const json = await apiClient
    .post(
      `matching-event/${params.matchingEventId}/user/${params.userId}/participant/confirm-picking`,
      { json: {} }
    )
    .text();

  return json;
}

// todo: only return pickedUserId array is enough
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
