import ky from "ky";
import { User } from "./user";

export type Picking = {
  id: string;
  matchingEventId: string;
  madeByUserId: string;
  pickedUserId: string;
};

export async function toggleUserPick(
  params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
) {
  const json = await ky
    .put(
      `http://localhost:4000/api/matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picking`,
      { json: { pickedUserId: params.pickedUserId } }
    )
    .text();

  return json;
}

export async function getPickingsByUserAndEvent(
  params: Pick<Picking, "madeByUserId" | "matchingEventId">
) {
  const json = await ky
    .get(
      `http://localhost:4000/api/matching-event/${params.matchingEventId}/user/${params.madeByUserId}/picking`
    )
    .json<Picking[]>();

  return json;
}

