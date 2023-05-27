import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1683452993676 implements MigrationInterface {
    name = 'sync1683452993676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "description" jsonb NOT NULL DEFAULT '{}'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "description"
        `);
    }

}
