import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680867426539 implements MigrationInterface {
  name = "sync1680867426539";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ADD "startChoosingAt" timestamp NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "phase"
            SET DEFAULT 'enrolling'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "matching_event"
            ALTER COLUMN "phase"
            SET DEFAULT 'registration'
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event" DROP COLUMN "startChoosingAt"
        `);
  }
}

