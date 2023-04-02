import dataSource from "../../data-source";
import { Picking } from "./model";

const PickingRepository = dataSource.getRepository(Picking).extend({
  getAllPickingsByUserIdAndEventId(userId: string, eventId: string) {
    const query = PickingRepository.createQueryBuilder("picking")
      .leftJoinAndSelect("picking.pickedUser", "pickedUser")
      .where("picking.madeByUserId = :userId", { userId })
      .andWhere("picking.matchingEventId = :eventId", { eventId });

    return query.getMany();
  },
});

export default PickingRepository;

