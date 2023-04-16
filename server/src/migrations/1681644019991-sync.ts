import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1681644019991 implements MigrationInterface {
    name = 'sync1681644019991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "isReverse" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "isReverse"
        `);
    }

}
