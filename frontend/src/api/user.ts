import ky from "ky";

export async function addUser() {
  const json = await ky
    .post("http://localhost:4000/user", { json: { foo: true } })
    .json();

  return json;
}
