import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680969800276 implements MigrationInterface {
    name = 'sync1680969800276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant"
                RENAME COLUMN "has_confirmed_picking" TO "hasConfirmedPicking"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "isConfirmed"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "isConfirmed" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
                RENAME COLUMN "hasConfirmedPicking" TO "has_confirmed_picking"
        `);
    }

}
