import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1678290416057 implements MigrationInterface {
    name = 'sync1678290416057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "hasEnded" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "hasEnded"
        `);
    }

}
