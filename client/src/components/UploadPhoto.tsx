import { useState } from "react";
import ImageUploader from "antd-mobile/es/components/image-uploader";
import Toast from "antd-mobile/es/components/toast";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { userApi } from "../api";
import { cosHelper } from "..";
import { useAuthState } from "./AuthProvider";

const MAX_COUNT = 3;

const UploadPhoto = ({
  onDelete,
}: {
  onDelete: (item: ImageUploadItem) => Promise<void>;
}) => {
  const { user } = useAuthState();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const handleCountExceed = (exceed: number) => {
    Toast.show(`最多选择 ${MAX_COUNT} 张图片，你多选了 ${exceed} 张`);
  };

  const handleDelete = (item: ImageUploadItem) => {
    window.confirm("是否确认删除") && onDelete(item);
  };

  async function handleUpload(file: File) {
    const fileName = `${Date.now()}-${encodeURI(file.name)}`;
    const key = `images/${user!.id}/${fileName}`;
    const uploadResult = await cosHelper.uploadToCos({
      Key: key,
      Body: file,
    });

    if (uploadResult.err || !uploadResult.data) {
      throw uploadResult.err;
    }

    const result = await userApi.savePhotoLocationByUser({
      userId: user!.id,
      cosLocation: uploadResult.data?.Location,
    });

    const url = await cosHelper.getPhotoUrl({
      Key: key,
    });

    return {
      url,
      extra: {
        cosLocation: uploadResult.data?.Location,
        photoId: result.id,
      },
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
      // deleteIcon={<CloseIcon color="action" />}
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
