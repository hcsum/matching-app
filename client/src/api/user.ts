import apiClient from "./ky";
import { MatchingEventResponse } from "./matching-event";

export type User = {
  id: string;
  name: string;
  gender: string;
  phoneNumber: string;
  jobTitle: string;
  bio: Record<string, string>; // deprecated
  questionnaire: Record<string, string>;
  graduatedFrom: string;
  monthAndYearOfBirth: string;
  age: number;
  photos: Photo[];
  loginToken: string;
  hasValidProfile: boolean;
  eventIds: string[];
  height: string;
};

export type Photo = {
  id: string;
  cosLocation: string;
};

export async function loginOrSignupUserAndJoinEvent(
  params: Pick<User, "phoneNumber"> & { code: string; eventId: string }
) {
  const json = await apiClient
    .post("user/login-or-signup", { json: params })
    .json<User>();

  localStorage.setItem("access_token", json.loginToken);

  return json;
}

export async function getPhoneCode(params: Pick<User, "phoneNumber">) {
  return await apiClient.post("user/phone-code", { json: params }).text();
}

export async function updateUserProfile(params: {
  bio?: Record<string, string>;
  age?: number;
  name?: string;
  gender?: string;
  jobTitle?: string;
}) {
  const json = await apiClient
    .put(`user/profile`, {
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
    .post(`user/photo-uploaded`, {
      json: { cosLocation: params.cosLocation },
    })
    .json<{ cosLocation: string; id: string }>();

  return json;
}

export async function getPhotosByUser() {
  const json = await apiClient.get(`user/photos`).json<Photo[]>();

  return json;
}

export async function getMatchingEventsByUser() {
  const json = await apiClient
    .get(`user/matching-events`)
    .json<MatchingEventResponse[]>();

  return json;
}

export const getUserByAccessToken = async () => {
  return apiClient.get(`user/me`).json<User>();
};

export const deletePhoto = async (params: { photoId: string }) => {
  await apiClient.delete(`user/photo/${params.photoId}`);
};
