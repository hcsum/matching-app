import { QueryBuilder } from "typeorm";
import dataSource from "../../data-source";
import { Picking } from "./model";

const PickingRepository = dataSource.getRepository(Picking).extend({
  getPickedUsersByUserIdAndEventId(params: {
    madeByUserId: string;
    matchingEventId: string;
  }): Promise<Picking[]> {
    return this.createQueryBuilder("picking")
      .leftJoinAndSelect("picking.pickedUser", "pickedUser")
      .leftJoinAndSelect("pickedUser.photos", "photo")
      .where("picking.madeByUserId = :madeByUserId", {
        madeByUserId: params.madeByUserId,
      })
      .andWhere("picking.matchingEventId = :matchingEventId", {
        matchingEventId: params.matchingEventId,
      })
      .getMany();
  },
});

export default PickingRepository;

