import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679823259825 implements MigrationInterface {
  name = "sync1679823259825";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "isConfirmed" boolean NOT NULL DEFAULT FALSE 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "isConfirmed"
        `);
  }
}

