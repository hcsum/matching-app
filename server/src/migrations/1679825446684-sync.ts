import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679825446684 implements MigrationInterface {
    name = 'sync1679825446684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_941fab583d61f8f58ad038118d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ALTER COLUMN "madeByUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ALTER COLUMN "pickedUserId"
            SET NOT NULL
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
            ALTER TABLE "picking"
            ALTER COLUMN "pickedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ALTER COLUMN "madeByUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc" FOREIGN KEY ("pickedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_941fab583d61f8f58ad038118d9" FOREIGN KEY ("madeByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
