import dataSource from "../../data-source";
import { Participant } from "../participant/model";
import ParticipantRepository from "../participant/repo";
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

  getMatchingEventsByUserId(userId: string): Promise<MatchingEvent[]> {
    const query = MatchingEventRepository.createQueryBuilder("matching_event")
      .innerJoin("matching_event.participants", "participants")
      .innerJoin("participants.user", "user")
      .where("user.id = :userId", { userId });

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

  async createParticipantInMatchingEvent({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    const event = await MatchingEventRepository.findOneOrFail({
      where: { id: eventId },
    });

    const participant = await ParticipantRepository.save(
      Participant.init({ matchingEventId: event.id, userId })
    );

    return participant;
  },
});

export default MatchingEventRepository;

