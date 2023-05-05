import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1683304210683 implements MigrationInterface {
    name = 'sync1683304210683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant"
                RENAME COLUMN "postMatchAction" TO "postMatchingAction"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant"
                RENAME COLUMN "postMatchingAction" TO "postMatchAction"
        `);
    }

}
