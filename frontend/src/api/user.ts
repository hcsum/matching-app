import ky from "ky";

export async function addUser(params: {
  name: string;
  gender: string;
  phoneNumber: string;
  jobTitle: string;
  age: number;
}) {
  const json = await ky
    .post("http://localhost:4000/user", { json: params })
    .json();

  return json;
}
