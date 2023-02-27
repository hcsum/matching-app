import ky from "ky";

export type User = {
  id: string;
  name: string;
  gender: string;
  phoneNumber: string;
  jobTitle: string;
  age: number;
  bio: Record<string, string>;
};

export async function loginOrSignupUser(params: Pick<User, "phoneNumber">) {
  const json = await ky
    .post("http://localhost:4000/api/user/upsert", { json: params })
    .json<User>();

  return json;
}

export async function getUser(params: { id: string }) {
  const json = await ky
    .get(`http://localhost:4000/api/user/${params.id}`)
    .json<User>();

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
  const json = await ky
    .put(`http://localhost:4000/api/user/${params.id}`, {
      json: params,
    })
    .json<User>();

  return json;
}
