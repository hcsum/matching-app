import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Photo } from "../photo/model";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: false })
  gender!: string;

  @Column({ type: 'varchar', nullable: false })
  phoneNumber!: string;

  @Column({ type: 'int', nullable: false })
  age!: number;

  @Column({ type: 'varchar', nullable: false })
  wechatId!: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}