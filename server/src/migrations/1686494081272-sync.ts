import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1686494081272 implements MigrationInterface {
    name = 'Sync1686494081272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ALTER COLUMN "userId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ALTER COLUMN "matchingEventId"
            SET NOT NULL
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
            ALTER TABLE "participant"
            ALTER COLUMN "matchingEventId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ALTER COLUMN "userId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
