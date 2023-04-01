import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1678590932593 implements MigrationInterface {
  name = "sync1678590932593";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event"
                RENAME COLUMN "stage" TO "phase"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event"
                RENAME COLUMN "phase" TO "stage"
        `);
  }
}
