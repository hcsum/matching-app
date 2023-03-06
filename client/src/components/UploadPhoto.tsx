import { useState } from "react";
import { ImageUploader, Toast, Dialog } from "antd-mobile";
import axios from "axios";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { cos, getPhotoUrl, uploadToCos } from "../utils/tencent-cos";

const MAX_COUNT = 9;
const UploadPhoto = () => {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
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

  const handleCountExceed = (exceed: any) => {
    Toast.show(`最多选择 ${MAX_COUNT} 张图片，你多选了 ${exceed} 张`);
  };

  const handleDelete = () => {
    return Dialog.confirm({
      content: "是否确认删除",
    });
  };
  // TODO: user id should be accessed somewhere somehow
  const userIdSample = "81962b1f-765d-44fb-a9dd-012f7b144007";
  const cosConfig = {
    bucket: "cpchallenge-1258242169",
    region: "ap-guangzhou",
  };
  const userId = userIdSample;
  async function handleUpload(file: any) {
    const { bucket, region } = cosConfig;
    // TODO: check login state
    const fileName = `${encodeURI(file.name)}-${Date.now()}`;
    const key = `images/${userId}/${fileName}`;
    let imgUrl = "";
    const uploadResult = await uploadToCos({
      Bucket: bucket,
      Region: region,
      Key: key,
      Body: file, // 上传文件对象
    });
    if (uploadResult.err) {
      console.log("上传出错", uploadResult.err);
    } else {
      console.log("上传成功", uploadResult.data);
      // 存储URL到数据库,这个url并不能直接下载数据，需要app做临时签证，参考：cos.getObjectUrl
      // format: <bucket>.cos.<region>.myqcloud.com/<key>
      // sample: cpchallenge-1258242169.cos.ap-guangzhou.myqcloud.com/images/87617a55-12d8-404f-ab1e-7cfadbfa5dc2/%25E7%2588%25AC%25E5%25B1%25B12.webp
      try {
        // TODO:  目前存在找不到userId的情况，是否应该先检查登录态？
        // TODO: webpack web server
        await axios.post(
          `http://localhost:4000/api/user/${userId}/cos-location`,
          {
            userId,
            cosLocation: uploadResult.data?.Location,
          }
        );
      } catch (error) {
        console.log(error);
        return { url: "" };
      }
      const downloadUrl = await getPhotoUrl({
        Bucket: bucket,
        Region: region,
        Key: key,
      });
      imgUrl = downloadUrl;
    }
    return {
      url: imgUrl,
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

export default UploadPhoto;
