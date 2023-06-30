import apiClient from "./ky";
import { MatchingEvent } from "./matching-event";

export type User = {
  id: string;
  name: string;
  gender: string;
  phoneNumber: string;
  jobTitle: string;
  age: number;
  bio: Record<string, string>;
  photos: Photo[];
  loginToken: string;
  hasValidProfile: boolean;
};

export type Photo = {
  id: string;
  url: string;
};

export async function loginOrSignupUserAndJoinEvent(
  params: Pick<User, "phoneNumber"> & { code: string; eventId: string }
) {
  const json = await apiClient
    .post("user/login-or-signup", { json: params })
    .json<User>();

  localStorage.setItem("token", json.loginToken);

  return json;
}

export async function getPhoneCode(params: Pick<User, "phoneNumber">) {
  return await apiClient.post("user/phone-code", { json: params }).text();
}

export async function getUser(params: { id: string }) {
  const json = await apiClient.get(`user/${params.id}`).json<User>();

  return json;
}

export async function updateUserProfile(params: {
  id: string;
  bio?: Record<string, string>;
  age?: number;
  name?: string;
  gender?: string;
  jobTitle?: string;
}) {
  const json = await apiClient
    .put(`user/${params.id}/profile`, {
      json: params,
    })
    .json<User>();

  return json;
}

// 存储cosLocation到数据库,这个不是图片url，需要app做临时签证，才能获得url,参考：cos.getObjectUrl
// location使用时需要decode
export async function savePhotoLocationByUser(params: {
  userId: string;
  cosLocation: string;
}) {
  const json = await apiClient
    .post(`user/${params.userId}/photo-uploaded`, {
      json: { cosLocation: params.cosLocation },
    })
    .text();

  return json;
}

export async function getPhotosByUser(params: { userId: string }) {
  const json = await apiClient
    .get(`user/${params.userId}/photos`)
    .json<Photo[]>();

  return json;
}

export async function getMatchingEventsByUser(userId: string) {
  const json = await apiClient
    .get(`user/${userId}/matching-events`)
    .json<MatchingEvent[]>();

  return json;
}
