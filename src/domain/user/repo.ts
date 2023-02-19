import dataSource from "../../dataSource";
import { User } from "./model";

const UserRepository = dataSource.getRepository(User).extend({
  findByName(name: string) {
    return this.createQueryBuilder("user")
      .where("user.name = :name", { name })
      .getMany();
  },
});

export default UserRepository;
