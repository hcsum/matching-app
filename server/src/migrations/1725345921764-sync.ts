import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1725345921764 implements MigrationInterface {
    name = 'Sync1725345921764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "wechatOpenId" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "wechatOpenId"
        `);
    }

}
