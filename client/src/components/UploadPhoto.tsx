import { useState } from "react";
import { ImageUploader, Toast, Dialog } from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { cosConfig } from "../utils/tencent-cos";
import { useParams } from "react-router-dom";
import { photoApi } from "../api";
import { cosHelper } from "..";

const MAX_COUNT = 9;

const UploadPhoto = ({ list = [] }: { list: ImageUploadItem[] }) => {
  const { userId = "" } = useParams();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const handleCountExceed = (exceed: number) => {
    Toast.show(`最多选择 ${MAX_COUNT} 张图片，你多选了 ${exceed} 张`);
  };

  const handleDelete = () => {
    return Dialog.confirm({
      content: "是否确认删除",
    });
  };

  async function handleUpload(file: File) {
    const { bucket, region } = cosConfig;
    const fileName = `${encodeURI(file.name)}-${Date.now()}`;
    const key = `images/${userId}/${fileName}`;
    const uploadResult = await cosHelper.uploadToCos({
      Bucket: bucket,
      Region: region,
      Key: key,
      Body: file,
    });

    if (uploadResult.err || !uploadResult.data) {
      console.log("上传出错", uploadResult.err);
      throw uploadResult.err;
    }

    await photoApi.savePhotoLocationByUser({
      userId,
      cosLocation: uploadResult.data?.Location,
    });

    const url = await cosHelper.getPhotoUrl({
      Bucket: bucket,
      Region: region,
      Key: key,
    });

    return {
      url,
    };
  }

  return (
    <ImageUploader
      value={fileList}
      onChange={setFileList}
      multiple={true}
      beforeUpload={beforeUpload}
      maxCount={MAX_COUNT}
      onCountExceed={handleCountExceed}
      onDelete={handleDelete}
      upload={handleUpload}
    />
  );
};

function beforeUpload(file: File) {
  // TODO: 是否限制图片大小
  // 压缩
  // if (file.size > 1024 * 1024) {
  //   Toast.show('请选择小于 1M 的图片')
  //   return null
  // }
  // TODO: 进度条?
  return file;
}

export default UploadPhoto;
