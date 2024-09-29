import apiClient from "./ky";
import { MatchingEventResponse } from "./matching-event";

export type User = {
  id: string;
  name: string;
  gender: string;
  jobTitle: string;
  bio: Record<string, string>;
  graduatedFrom: string;
  dateOfBirth: string;
  age: number;
  photos: Photo[];
  loginToken: string;
  isProfileComplete: boolean;
  isBioComplete: boolean;
  isPhotosComplete: boolean;
  eventIds: string[];
  height: number;
  zodiacSign: string;
  hometown: string;
  mbti: string;
};

export type Photo = {
  id: string;
  cosLocation: string;
};

export async function loginOrSignupUserAndJoinEvent(params: {
  code: string;
  eventId: string;
  phoneNumber: string;
}) {
  const json = await apiClient
    .post("user/login-or-signup", { json: params })
    .json<User>();

  localStorage.setItem("access_token", json.loginToken);

  return json;
}

export async function getPhoneCode(params: { phoneNumber: string }) {
  return await apiClient.post("user/phone-code", { json: params }).text();
}

export async function updateUserProfile(params: {
  userId: string;
  data: Partial<
    Pick<
      User,
      | "bio"
      | "dateOfBirth"
      | "gender"
      | "graduatedFrom"
      | "height"
      | "hometown"
      | "jobTitle"
      | "mbti"
      | "name"
    >
  >;
}) {
  const json = await apiClient
    .put(`user/${params.userId}/profile`, {
      json: params.data,
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
    .json<{ cosLocation: string; id: string }>();

  return json;
}

export async function getMatchingEventsByUser({ userId }: { userId: string }) {
  const json = await apiClient
    .get(`user/${userId}/matching-events`)
    .json<MatchingEventResponse[]>();

  return json;
}

export const getUserByAccessToken = async () => {
  return apiClient.get(`user/me`).json<User>();
};

export const deletePhoto = async (params: {
  photoId: string;
  userId: string;
}) => {
  await apiClient.delete(`user/${params.userId}/photo/${params.photoId}`);
};
