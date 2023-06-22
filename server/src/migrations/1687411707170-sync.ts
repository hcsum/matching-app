import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1687411707170 implements MigrationInterface {
  name = "Sync1687411707170";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "participant"
            ADD "hasUpdatedProfile" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            COMMENT ON COLUMN "user"."wechatId" IS 'not in use due to wechat issue'
        `);
    await queryRunner.query(`
            COMMENT ON COLUMN "user"."loginToken" IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            COMMENT ON COLUMN "user"."loginToken" IS 'will replace with Wechat OAuth token'
        `);
    await queryRunner.query(`
            COMMENT ON COLUMN "user"."wechatId" IS NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "participant" DROP COLUMN "hasUpdatedProfile"
        `);
  }
}

