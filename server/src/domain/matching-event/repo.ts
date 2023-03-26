import dataSource from "../../data-source";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent).extend({
  getMatchingEventsByUserId({ userId }: { userId: string }) {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .leftJoin("matching_event.participants", "participants")
      .where("participants.id = :userId", { userId });

    return query.getMany();
  },
  getMatchingEvent({ id }: { id: string }) {
    return MatchingEventRepository.findOneBy({ id });
  },
  getMatchingEventWithParticipantsByEventId({ eventId }: { eventId: string }) {
    // const query = MatchingEventRepository.createQueryBuilder("matching_event")
    //   .leftJoinAndSelect("matching_event.participants", "participants")
    //   .where("matching_event.id = :eventId", { eventId });

    // return query.getOne();
    return MatchingEventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ["participants"],
    });
  },
});

export default MatchingEventRepository;

