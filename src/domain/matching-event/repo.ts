import dataSource from "../../dataSource";
import { MatchingEvent } from "./model";

const MatchingEventRepository = dataSource.getRepository(MatchingEvent)

export default MatchingEventRepository;
