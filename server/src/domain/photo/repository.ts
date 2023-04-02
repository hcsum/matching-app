import dataSource from "../../data-source";
import { Photo } from "./model";

const PhotoRepository = dataSource.getRepository(Photo).extend({
  async getPhotosByUser(userId: string) {
    return PhotoRepository.createQueryBuilder("photo")
      .leftJoin("photo.user", "user")
      .where("user.id = :userId", { userId })
      .getMany();
  },
});

export default PhotoRepository;
