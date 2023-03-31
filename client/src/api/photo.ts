import apiClient from "./ky";

export type Photo = {
  id: string;
  url: string;
};

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

