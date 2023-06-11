import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1686492976314 implements MigrationInterface {
    name = 'Sync1686492976314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "participant" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "hasConfirmedPicking" boolean NOT NULL DEFAULT false,
                "postMatchingAction" character varying,
                "userId" uuid,
                "matchingEventId" uuid,
                CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "matching_event" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "phase" character varying NOT NULL DEFAULT 'inactive',
                "startChoosingAt" TIMESTAMP NOT NULL,
                "title" character varying NOT NULL,
                "description" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_65624d28d02d4d1e9d01e227776" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "picking" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "matchingEventId" uuid NOT NULL,
                "madeByUserId" uuid NOT NULL,
                "pickedUserId" uuid NOT NULL,
                "isInsisted" boolean NOT NULL DEFAULT false,
                "isReverse" boolean NOT NULL DEFAULT false,
                "isInsistResponded" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_ca69806eaffe87469fec16ad0b1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "gender" character varying,
                "phoneNumber" character varying,
                "age" integer,
                "jobTitle" character varying,
                "wechatId" character varying,
                "bio" jsonb NOT NULL DEFAULT '{}',
                "loginToken" character varying,
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
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "participant"
            ADD CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "photo"
            ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"
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
            ALTER TABLE "participant" DROP CONSTRAINT "FK_74c88acd49c4572ed56ba7b31bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"
        `);
        await queryRunner.query(`
            DROP TABLE "photo"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "picking"
        `);
        await queryRunner.query(`
            DROP TABLE "matching_event"
        `);
        await queryRunner.query(`
            DROP TABLE "participant"
        `);
    }

}
