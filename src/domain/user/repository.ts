import dataSource from "../../dataSource"
import { User } from "./model"

const UserRepository = dataSource.getRepository(User).extend({
    findByName(name: string) {
        return this.createQueryBuilder("user")
            .where("user.name = :name", { name })
            .getMany()
    },
    findById(id: string) {
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne()
    },
    updateName(id: number, name: string) {
      return this.createQueryBuilder("user")
        .update()
        .set({ name: name })
        .where("people.id = :id", { id })
        .execute();
    }
})

export default UserRepository;