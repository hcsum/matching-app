import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1687197512011 implements MigrationInterface {
    name = 'Sync1687197512011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "UQ_b421dfc701991352786fd102baa" UNIQUE ("userId", "matchingEventId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "UQ_b421dfc701991352786fd102baa"
        `);
    }

}
