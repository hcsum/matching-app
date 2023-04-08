import dataSource from "../../data-source";
import { Picking } from "./model";

const PickingRepository = dataSource.getRepository(Picking).extend({});

export default PickingRepository;

