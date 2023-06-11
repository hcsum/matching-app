import dataSource from "../../data-source";
import { Participant } from "./model";

const ParticipantRepository = dataSource.getRepository(Participant).extend({
  //   getMatchingEventsByUserId({ userId }: { userId: string }) {
  //     const query = ParticipantRepository.createQueryBuilder("participant")
  //       .innerJoin("participant.matching_events", "participants")
  //       .innerJoin("participants.user", "user")
  //       .where("user.id = :userId", { userId });
  //     return query.getMany();
  //   },
});

export default ParticipantRepository;

