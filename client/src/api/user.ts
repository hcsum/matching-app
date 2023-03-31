import apiClient from "./ky";
import { Photo } from "./photo";

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
};

export async function loginOrSignupUser(params: Pick<User, "phoneNumber">) {
  const json = await apiClient
    .post("user/upsert", { json: params })
    .json<User>();

  localStorage.setItem("token", json.loginToken);

  return json;
}

export async function getUser(params: { id: string }) {
  const json = await apiClient.get(`user/${params.id}`).json<User>();

  return json;
}

export async function updateUser(params: {
  id: string;
  bio?: Record<string, string>;
  age?: number;
  name?: string;
  gender?: string;
  jobTitle?: string;
}) {
  const json = await apiClient
    .put(`user/${params.id}`, {
      json: params,
    })
    .json<User>();

  return json;
}

