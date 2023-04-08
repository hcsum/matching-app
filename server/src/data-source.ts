import { DataSource } from "typeorm";
import { Photo } from "./domain/photo/model";
import { Picking } from "./domain/picking/model";
import { MatchingEvent } from "./domain/matching-event/model";
import { User } from "./domain/user/model";
import { Participant } from "./domain/participant/model";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Photo, Picking, MatchingEvent, Participant],
  synchronize: false,
  migrations: [`${__dirname}/migrations/*`],
});

export default AppDataSource;

