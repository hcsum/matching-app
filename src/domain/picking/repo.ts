import dataSource from "../../dataSource";
import { Picking } from "./model";

const PickingRepository = dataSource.getRepository(Picking).extend({
  getAllPickingsByUserId(id: string) {
    const query = PickingRepository.createQueryBuilder("picking")
      .leftJoinAndSelect("picking.pickedUser", "pickedUser")
      .where("picking.madeByUser = :id", { id });

    return query.getMany();
  },
});

export default PickingRepository;
