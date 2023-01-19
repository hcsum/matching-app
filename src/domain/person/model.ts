import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Name } from "./name";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @Column(() => Name)
  name?: Name;

  @Column({ type: 'varchar', nullable: true })
  gender?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  age?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get fullName() {
    return this.firstName + ' ' + this.lastName
  } 
}