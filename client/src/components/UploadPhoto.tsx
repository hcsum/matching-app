import "antd-mobile/es/global";
import ImageUploader from "antd-mobile/es/components/image-uploader";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { userApi } from "../api";
import { cosHelper } from "..";
import { useAuthState } from "./AuthProvider";
import { useGlobalState, useSnackbarState } from "./GlobalContext";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button, IconButton } from "@mui/material";

const MAX_COUNT = 3;

const UploadPhoto = ({
  onDelete,
  onUpload,
}: {
  onDelete: (item: ImageUploadItem) => Promise<void>;
  onUpload: (item: { cosLocation: string; photoId: string }) => void;
}) => {
  const { user } = useAuthState();
  const { setSnackBarContent } = useSnackbarState();

  const handleCountExceed = (exceed: number) => {
    setSnackBarContent(`最多选择 ${MAX_COUNT} 张图片，你多选了 ${exceed} 张`);
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

    onUpload({
      cosLocation: uploadResult.data?.Location,
      photoId: result.id,
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
      multiple={true}
      beforeUpload={beforeUpload}
      maxCount={MAX_COUNT}
      onCountExceed={handleCountExceed}
      onDelete={handleDelete}
      upload={handleUpload}
      deletable={false}
      renderItem={(originNode, file, fileList) => {
        return null;
      }}
    >
      <Button variant="contained" color="primary">
        选择照片
        <FileUploadIcon />
      </Button>
    </ImageUploader>
  );
};

function beforeUpload(file: File) {
  // TODO: 是否限制图片大小
  // 压缩
  // if (file.size > 1024 * 1024) {
  //   Toast.show('请选择小于 1M 的图片')
  //   return null
  // }
  return file;
}

export default UploadPhoto;
