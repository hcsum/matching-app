import dataSource from "../../data-source";
import { Participant } from "../participant/model";
import ParticipantRepository from "../participant/repo";
import { User } from "../user/model";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent).extend({
  getMatchingEventById({ id }: { id: string }) {
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
      .leftJoin("matching_event.participants", "participant")
      .leftJoinAndMapMany(
        "matching_event.participants",
        User, // participant.user doesn't work, it will only load participant
        "user",
        "participant.userId = user.id"
      )
      .leftJoinAndSelect("user.photos", "photo")
      .select([
        "matching_event",
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

  async findParticipantByEventIdAndUserId({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    return ParticipantRepository.findOne({
      where: { userId, matchingEventId: eventId },
    });
  },
});

export default MatchingEventRepository;

