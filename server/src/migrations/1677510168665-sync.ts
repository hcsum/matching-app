/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1677510168665 implements MigrationInterface {
  name = "sync1677510168665";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "name" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "gender" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "age" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "jobTitle" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "loginToken" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "loginToken"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "jobTitle"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "age"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "gender"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "name"
            SET NOT NULL
        `);
  }
}
