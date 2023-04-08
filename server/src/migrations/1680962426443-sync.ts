import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680962426443 implements MigrationInterface {
    name = 'sync1680962426443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "participant" (
                "id" SERIAL NOT NULL,
                "has_confirmed_picking" boolean NOT NULL DEFAULT false,
                "userId" uuid NOT NULL,
                "matchingEventId" uuid NOT NULL,
                CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "phase"
            SET DEFAULT 'inactive'
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"
        `);
        await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "phase"
            SET DEFAULT 'enrolling'
        `);
        await queryRunner.query(`
            DROP TABLE "participant"
        `);
    }

}
