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
  getMatchingEventWithParticipantsByEventId({
    eventId,
    gender,
  }: {
    eventId: string;
    gender: "male" | "female";
  }) {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .leftJoinAndSelect("matching_event.participants", "participant")
      .leftJoinAndSelect("participant.photos", "photo")
      .select([
        "matching_event",
        "participant.name",
        "participant.jobTitle",
        "participant.age",
        "participant.id",
        "photo",
      ])
      .where("matching_event.id = :eventId", { eventId })
      .andWhere("participant.gender = :gender", { gender });

    return query.getOne();
  },
});

export default MatchingEventRepository;

