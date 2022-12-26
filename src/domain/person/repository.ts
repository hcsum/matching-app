import dataSource from "../../dataSource"
import { Person } from "./model"

const UserRepository = dataSource.getRepository(Person).extend({
    findByName(fullname: string) {
        return this.createQueryBuilder("person")
            .where("person.fullname = :fullname", { fullname })
            .getMany()
    },
    findById(id: string) {
        return this.createQueryBuilder("person")
            .where("person.id = :id", { id })
            .getOne()
    },
    updateName(id: number, fullname: string) {
      return this.createQueryBuilder("person")
        .update()
        .set({ fullname: fullname })
        .where("people.id = :id", { id })
        .execute();
    }
})

export default UserRepository;