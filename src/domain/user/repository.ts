import dataSource from "../../dataSource"
import { User } from "./model"

const UserRepository = dataSource.getRepository(User).extend({
    findByName(fullname: string) {
        return this.createQueryBuilder("user")
            .where("user.fullname = :fullname", { fullname })
            .getMany()
    },
})

export default UserRepository;