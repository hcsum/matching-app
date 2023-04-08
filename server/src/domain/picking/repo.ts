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
  confirmPickingsByUserIdAndEventId(params: {
    userId: string;
    eventId: string;
    pickedUserIds: string[];
  }) {
    const query = PickingRepository.createQueryBuilder("picking")
      .update()
      .set({ isConfirmed: true })
      .where('"picking"."madeByUserId" = :userId', { userId: params.userId })
      .andWhere('"picking"."matchingEventId" = :eventId', {
        eventId: params.eventId,
      })
      .andWhere('"picking"."pickedUserId" IN (:...pickedUserIds)', {
        pickedUserIds: params.pickedUserIds,
      });

    return query.execute();
  },
});

export default PickingRepository;

