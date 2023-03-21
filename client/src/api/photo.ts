import ky from "ky";

export type Photo = {
  id: string;
  url: string;
};

// 存储cosLocation到数据库,这个不是图片url，需要app做临时签证，才能获得url,参考：cos.getObjectUrl
export async function savePhotoLocationByUser(params: {
  userId: string;
  cosLocation: string;
}) {
  const json = await ky
    .post(`http://localhost:4000/api/user/${params.userId}/photo-uploaded`, {
      json: { cosLocation: params.cosLocation },
    })
    .text();

  return json;
}

export async function getPhotosByUser(params: { userId: string }) {
  const json = await ky
    .get(`http://localhost:4000/api/user/${params.userId}/photos`)
    .json<Photo[]>();

  return json;
}
