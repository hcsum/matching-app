/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1674664190143 implements MigrationInterface {
  name = "sync1674664190143";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "ownedById" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "pickedId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_09f1090024aaedd83134c7c7dfc" FOREIGN KEY ("ownedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_63c556218ad624c0413971447d8" FOREIGN KEY ("pickedId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_63c556218ad624c0413971447d8"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_09f1090024aaedd83134c7c7dfc"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "pickedId"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "ownedById"
        `);
  }
}
