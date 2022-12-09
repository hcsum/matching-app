import express, { NextFunction } from "express";
import cors from "cors";
import AppDataSource from "./dataSource";
import UserRepository from "./domain/person/repository";
import bodyParser from 'body-parser';
import { Person } from "./domain/person/model";

const port = process.env.PORT;

const connectToDB = async () => {
  return AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
};


const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/person", async (req, res, next) => {
  const person = AppDataSource.manager.create(Person);

  person.fullname = req.body.fullname;
  
  res.send(await AppDataSource.manager.save(person))  
});

app.get("/persons", async (req, res, next) => {
  const result = await UserRepository.find()
  res.send(result);
});

app.use((err: Error, req: any, res: any, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("error");
});

app.listen(port, () => {
  connectToDB().then(() => 
    console.log(`App listening on port ${port}`)
  ).catch(err => console.log(err));
});
