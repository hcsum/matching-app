import dataSource from "../../data-source";
import { Participant } from "./model";

const ParticipantRepository = dataSource.getRepository(Participant).extend({});

export default ParticipantRepository;

