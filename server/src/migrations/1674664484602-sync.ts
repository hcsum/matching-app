import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/naming-convention */

export class sync1674664484602 implements MigrationInterface {
  name = "sync1674664484602";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_09f1090024aaedd83134c7c7dfc"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_63c556218ad624c0413971447d8"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "ownedById"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "pickedId"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "madeByUserId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "pickedUserId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_941fab583d61f8f58ad038118d9" FOREIGN KEY ("madeByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc" FOREIGN KEY ("pickedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_941fab583d61f8f58ad038118d9"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "pickedUserId"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP COLUMN "madeByUserId"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "pickedId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD "ownedById" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_63c556218ad624c0413971447d8" FOREIGN KEY ("pickedId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_09f1090024aaedd83134c7c7dfc" FOREIGN KEY ("ownedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
