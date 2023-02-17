import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1677479564056 implements MigrationInterface {
    name = 'sync1677479564056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "gender" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "age" integer NOT NULL,
                "jobTitle" character varying NOT NULL,
                "wechatId" character varying,
                "bio" jsonb NOT NULL DEFAULT '{}',
                "loginToken" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "user"."loginToken" IS 'will replace with Wechat OAuth token'
        `);
        await queryRunner.query(`
            CREATE TABLE "photo" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "userId" uuid,
                CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "matching_event" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "startedAt" date NOT NULL,
                "title" character varying,
                CONSTRAINT "PK_65624d28d02d4d1e9d01e227776" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "picking" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "matchingEventId" uuid,
                "madeByUserId" uuid,
                "pickedUserId" uuid,
                CONSTRAINT "PK_ca69806eaffe87469fec16ad0b1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "matching_event_participants_user" (
                "matchingEventId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_b7eb2d9c3e3e8d9a72ea68d5f40" PRIMARY KEY ("matchingEventId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8ec823fe2047e24fa3e85390b9" ON "matching_event_participants_user" ("matchingEventId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ac6266dd42ee1c753781bde983" ON "matching_event_participants_user" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "photo"
            ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_941fab583d61f8f58ad038118d9" FOREIGN KEY ("madeByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc" FOREIGN KEY ("pickedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user"
            ADD CONSTRAINT "FK_8ec823fe2047e24fa3e85390b93" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user"
            ADD CONSTRAINT "FK_ac6266dd42ee1c753781bde9836" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_ac6266dd42ee1c753781bde9836"
        `);
        await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_8ec823fe2047e24fa3e85390b93"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_0e6c0767733d3dc7d0cd32591bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_941fab583d61f8f58ad038118d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82"
        `);
        await queryRunner.query(`
            ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ac6266dd42ee1c753781bde983"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8ec823fe2047e24fa3e85390b9"
        `);
        await queryRunner.query(`
            DROP TABLE "matching_event_participants_user"
        `);
        await queryRunner.query(`
            DROP TABLE "picking"
        `);
        await queryRunner.query(`
            DROP TABLE "matching_event"
        `);
        await queryRunner.query(`
            DROP TABLE "photo"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
