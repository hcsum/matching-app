import dataSource from "../../data-source";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent);

export default MatchingEventRepository;
