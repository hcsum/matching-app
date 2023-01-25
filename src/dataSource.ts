import { DataSource } from "typeorm";
import { Photo } from "./domain/photo/model";
import { Pick } from "./domain/pick/model";
import { Round } from "./domain/round/model";
import { User } from "./domain/user/model";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Photo, Pick, Round],
  synchronize: false,
  migrations: [__dirname + "/migrations/*"],
});

export default AppDataSource;
