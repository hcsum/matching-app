import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTablePick1674636407664 implements MigrationInterface {
    name = 'alterTablePick1674636407664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pick" DROP CONSTRAINT "FK_956025823a2d0adea4b2bc1744f"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick"
                RENAME COLUMN "eventIdId" TO "roundId"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick"
            ADD CONSTRAINT "FK_3b8be57b57b080e7f3cfae0f7d0" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pick" DROP CONSTRAINT "FK_3b8be57b57b080e7f3cfae0f7d0"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick"
                RENAME COLUMN "roundId" TO "eventIdId"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick"
            ADD CONSTRAINT "FK_956025823a2d0adea4b2bc1744f" FOREIGN KEY ("eventIdId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
