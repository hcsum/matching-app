import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680963212680 implements MigrationInterface {
    name = 'sync1680963212680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "PK_64da4237f502041781ca15d4c41"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "PK_64da4237f502041781ca15d4c41"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id")
        `);
    }

}
