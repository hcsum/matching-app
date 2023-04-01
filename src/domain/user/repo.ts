import dataSource from "../../data-source";
import { User } from "./model";

const UserRepository = dataSource.getRepository(User);

export default UserRepository;
