import dataSource from "../../data-source";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent).extend({
  getMatchingEventById({ id }: { id: string }) {
    return MatchingEventRepository.findOneBy({ id });
  },

  async getLatestMatchingEvent(): Promise<MatchingEvent> {
    const result = await MatchingEventRepository.find({
      order: {
        startChoosingAt: "DESC",
      },
      take: 1,
    });

    return result[0];
  },

  getMatchingEventsByUserId({ userId }: { userId: string }) {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .leftJoin("matching_event.participants", "participants")
      .where("participants.userId = :userId", { userId });

    return query.getMany();
  },

  getMatchingEventWithParticipantsByEventId({
    eventId,
    gender,
  }: {
    eventId: string;
    gender: "male" | "female";
  }) {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .leftJoin("matching_event.participants", "participant")
      .leftJoin("participant.user", "user")
      .leftJoin("user.photos", "photo")
      .select([
        "matching_event",
        "participant",
        // "user",
        "user.name",
        "user.jobTitle",
        "user.age",
        "user.id",
        "user.bio",
        "photo",
      ])
      .where("matching_event.id = :eventId", { eventId })
      .andWhere("user.gender = :gender", { gender });

    return query.getOne();
  },
});

export default MatchingEventRepository;

