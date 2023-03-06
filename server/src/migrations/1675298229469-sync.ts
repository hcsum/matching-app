import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/naming-convention */

export class sync1675298229469 implements MigrationInterface {
  name = "sync1675298229469";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "jobTitle" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "bio" jsonb NOT NULL DEFAULT '{}'
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "gender"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "age"
            SET NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "age" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "gender" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "bio"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "jobTitle"
        `);
  }
}
