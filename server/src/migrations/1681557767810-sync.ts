import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1681557767810 implements MigrationInterface {
  name = "sync1681557767810";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "participant"
            ADD "postMatchAction" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "participant" DROP COLUMN "postMatchAction"
        `);
  }
}

