import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/naming-convention */

export class createTableMatchingEvent1674651604338
  implements MigrationInterface
{
  name = "createTableMatchingEvent1674651604338";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "gender" character varying,
                "phoneNumber" character varying,
                "age" integer,
                "wechatId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
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
            CREATE TABLE "picking_owned_by_user" (
                "pickingId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_1c492bdce1e6d6aed5f201054b7" PRIMARY KEY ("pickingId", "userId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8eb1a96748ecff50d85228d0f5" ON "picking_owned_by_user" ("pickingId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6f4ba243ddc99877b5dcf08443" ON "picking_owned_by_user" ("userId")
        `);
    await queryRunner.query(`
            CREATE TABLE "picking_picked_user" (
                "pickingId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_52cb88a93efe93ecd0097e2f921" PRIMARY KEY ("pickingId", "userId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e15779c72233ac86e00141c6dc" ON "picking_picked_user" ("pickingId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_811bcdf2fdbd98b6c4747ffd1d" ON "picking_picked_user" ("userId")
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
            ALTER TABLE "matching_event_participants_user"
            ADD CONSTRAINT "FK_8ec823fe2047e24fa3e85390b93" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user"
            ADD CONSTRAINT "FK_ac6266dd42ee1c753781bde9836" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_owned_by_user"
            ADD CONSTRAINT "FK_8eb1a96748ecff50d85228d0f5d" FOREIGN KEY ("pickingId") REFERENCES "picking"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_owned_by_user"
            ADD CONSTRAINT "FK_6f4ba243ddc99877b5dcf084430" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_picked_user"
            ADD CONSTRAINT "FK_e15779c72233ac86e00141c6dc7" FOREIGN KEY ("pickingId") REFERENCES "picking"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_picked_user"
            ADD CONSTRAINT "FK_811bcdf2fdbd98b6c4747ffd1d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "picking_picked_user" DROP CONSTRAINT "FK_811bcdf2fdbd98b6c4747ffd1d9"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_picked_user" DROP CONSTRAINT "FK_e15779c72233ac86e00141c6dc7"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_owned_by_user" DROP CONSTRAINT "FK_6f4ba243ddc99877b5dcf084430"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking_owned_by_user" DROP CONSTRAINT "FK_8eb1a96748ecff50d85228d0f5d"
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_ac6266dd42ee1c753781bde9836"
        `);
    await queryRunner.query(`
            ALTER TABLE "matching_event_participants_user" DROP CONSTRAINT "FK_8ec823fe2047e24fa3e85390b93"
        `);
    await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82"
        `);
    await queryRunner.query(`
            ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_811bcdf2fdbd98b6c4747ffd1d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e15779c72233ac86e00141c6dc"
        `);
    await queryRunner.query(`
            DROP TABLE "picking_picked_user"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6f4ba243ddc99877b5dcf08443"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8eb1a96748ecff50d85228d0f5"
        `);
    await queryRunner.query(`
            DROP TABLE "picking_owned_by_user"
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
