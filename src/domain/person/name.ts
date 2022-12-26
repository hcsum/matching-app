import { Column } from "typeorm"

export class Name {
    @Column({ type: 'varchar', nullable: true })
    first?: string

    @Column({ type: 'varchar', nullable: true })
    last?: string
}