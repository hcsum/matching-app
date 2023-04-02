import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1678554732314 implements MigrationInterface {
  name = "Sync1678554732314";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "startedAt"
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "hasEnded"
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "stage" character varying NOT NULL DEFAULT 'registration'
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "title"
            SET NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "title" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "stage"
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "hasEnded" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "startedAt" date NOT NULL
        `);
  }
}
