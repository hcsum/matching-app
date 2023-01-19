import express, { NextFunction } from "express";
import cors from "cors";
import AppDataSource from "./dataSource";
import UserRepository from "./domain/person/repository";
import bodyParser from 'body-parser';
import { Person } from "./domain/person/model";
import { Name } from "./domain/person/name";

const port = process.env.PORT;

const connectToDB = async () => {
  return AppDataSource.initialize()
    .then(() => { 
        console.log("Data Source has been initialized!")
    })
    // .then(async () => {
    //   const person1 = AppDataSource.manager.create(Person);
    //   person1.phone = '333999'
    //   await AppDataSource.manager.save(person1)


    //   const person2 = AppDataSource.manager.create(Person);
    //   const name = new Name()
    //   name.first = 'Jim'
    //   name.last = 'Zhan'
    //   person2.name = name
    //   await AppDataSource.manager.save(person2)
    // })
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

  person.firstName = req.body.firstName;
  person.lastName = req.body.lastName;
  
  res.send(await AppDataSource.manager.save(person))  
});

app.get("/person/:id", async (req, res, next) => {
  console.log('req query', req.params)
  const result = await UserRepository.findById(req.params.id)
  console.log('result', result)
  res.send(result);
});

app.get("/persons", async (req, res, next) => {
  const result = await UserRepository.find()
  console.log('result', result)
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
