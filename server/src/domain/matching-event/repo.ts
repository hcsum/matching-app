import dataSource from "../../data-source";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent).extend({
  getMatchingEventsByUserId({ userId }: { userId: string }) {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .leftJoin("matching_event.participants", "participants")
      .where("participants.id = :userId", { userId });

    return query.getMany();
  },
});

export default MatchingEventRepository;
