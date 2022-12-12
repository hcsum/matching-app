import { DataSource } from "typeorm"
import { Person } from "./domain/person/model"

const AppDataSource = new DataSource({
    type: "postgres",
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'password',
    database: 'matching_app',
    entities: [Person],
    synchronize: false,
    migrations: ['./migrations/{*}.ts']
})

export default AppDataSource