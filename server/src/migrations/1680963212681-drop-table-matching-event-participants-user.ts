import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680963212681 implements MigrationInterface {
  name = "sync1680963212681";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_ac6266dd42ee1c753781bde9836"
    `);
    await queryRunner.query(`
        ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_8ec823fe2047e24fa3e85390b93"
    `);
    await queryRunner.query(`
        DROP TABLE "matching_event_participants_user"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("This migration cannot be reverted.");
  }
}

