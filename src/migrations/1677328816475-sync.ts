import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1677328816475 implements MigrationInterface {
    name = 'sync1677328816475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "loginToken" character varying NOT NULL
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "user"."loginToken" IS 'will replace with Wechat OAuth token'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            COMMENT ON COLUMN "user"."loginToken" IS 'will replace with Wechat OAuth token'
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "loginToken"
        `);
    }

}
