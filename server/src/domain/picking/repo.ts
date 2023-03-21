import dataSource from "../../data-source";
import { Picking } from "./model";

const PickingRepository = dataSource.getRepository(Picking).extend({
  getAllPickingsByUserId(userId: string) {
    const query = PickingRepository.createQueryBuilder("picking")
      .leftJoinAndSelect("picking.pickedUser", "pickedUser")
      .where("picking.madeByUser = :userId", { userId });

    return query.getMany();
  },
});

export default PickingRepository;
