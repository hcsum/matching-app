import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "people" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;
}