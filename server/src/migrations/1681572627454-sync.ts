import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1681572627454 implements MigrationInterface {
    name = 'sync1681572627454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "isInsisted" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "isInsisted"
        `);
    }

}
