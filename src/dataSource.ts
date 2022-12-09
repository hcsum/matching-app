import { DataSource } from "typeorm"
import { Person } from "./domain/person/model"

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Person],
    synchronize: true
})

export default AppDataSource