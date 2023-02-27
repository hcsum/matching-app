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

export async function addUser(params: Omit<User, "id" | "bio">) {
  const json = await ky
    .post("http://localhost:4000/api/user", { json: params })
    .json<User>();

  return json;
}

export async function loginUser(params: Pick<User, "phoneNumber">) {
  const json = await ky
    .post("http://localhost:4000/api/user/login", { json: params })
    .json<User>();

  return json;
}

export async function getUser(params: { id: string }) {
  const json = await ky
    .get(`http://localhost:4000/api/user/${params.id}`)
    .json<User>();

  return json;
}

export async function updateBio(params: {
  id: string;
  bio: Record<string, string>;
}) {
  const json = await ky
    .post(`http://localhost:4000/api/user/${params.id}/bio`, {
      json: { bio: params.bio },
    })
    .json<User>();

  return json;
}
