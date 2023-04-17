import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1681744626653 implements MigrationInterface {
    name = 'sync1681744626653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "isInsistResponded" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "isInsistResponded"
        `);
    }

}
