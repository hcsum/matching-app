import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableRoundAndPick1674636015963 implements MigrationInterface {
    name = 'createTableRoundAndPick1674636015963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "round" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "startedAt" date NOT NULL,
                "title" character varying NOT NULL,
                CONSTRAINT "PK_34bd959f3f4a90eb86e4ae24d2d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pick" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventIdId" uuid,
                CONSTRAINT "PK_f498e7313427eea815719241927" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "round_participants_user" (
                "roundId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_bd9ffcb42138c17eed9ca7d0f83" PRIMARY KEY ("roundId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5be74f622954f527a9a54eacd3" ON "round_participants_user" ("roundId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_58a4d3a536bbb0f3146ac53834" ON "round_participants_user" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "pick_owned_by_user" (
                "pickId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_4a16d331c2f1de928066bef873e" PRIMARY KEY ("pickId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f4b85d725f44d8067d2fe84262" ON "pick_owned_by_user" ("pickId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_603aef313523c9bbd0bb997a4b" ON "pick_owned_by_user" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "pick_picked_user" (
                "pickId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_349dbed6608f61f9186e4fb854f" PRIMARY KEY ("pickId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a86d2c25f772e93afecbd40f27" ON "pick_picked_user" ("pickId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bbac9c2dd7ac5158d64e734eb6" ON "pick_picked_user" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "pick"
            ADD CONSTRAINT "FK_956025823a2d0adea4b2bc1744f" FOREIGN KEY ("eventIdId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "round_participants_user"
            ADD CONSTRAINT "FK_5be74f622954f527a9a54eacd39" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "round_participants_user"
            ADD CONSTRAINT "FK_58a4d3a536bbb0f3146ac538347" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_owned_by_user"
            ADD CONSTRAINT "FK_f4b85d725f44d8067d2fe842628" FOREIGN KEY ("pickId") REFERENCES "pick"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_owned_by_user"
            ADD CONSTRAINT "FK_603aef313523c9bbd0bb997a4ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_picked_user"
            ADD CONSTRAINT "FK_a86d2c25f772e93afecbd40f272" FOREIGN KEY ("pickId") REFERENCES "pick"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_picked_user"
            ADD CONSTRAINT "FK_bbac9c2dd7ac5158d64e734eb61" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pick_picked_user" DROP CONSTRAINT "FK_bbac9c2dd7ac5158d64e734eb61"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_picked_user" DROP CONSTRAINT "FK_a86d2c25f772e93afecbd40f272"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_owned_by_user" DROP CONSTRAINT "FK_603aef313523c9bbd0bb997a4ba"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick_owned_by_user" DROP CONSTRAINT "FK_f4b85d725f44d8067d2fe842628"
        `);
        await queryRunner.query(`
            ALTER TABLE "round_participants_user" DROP CONSTRAINT "FK_58a4d3a536bbb0f3146ac538347"
        `);
        await queryRunner.query(`
            ALTER TABLE "round_participants_user" DROP CONSTRAINT "FK_5be74f622954f527a9a54eacd39"
        `);
        await queryRunner.query(`
            ALTER TABLE "pick" DROP CONSTRAINT "FK_956025823a2d0adea4b2bc1744f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_bbac9c2dd7ac5158d64e734eb6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a86d2c25f772e93afecbd40f27"
        `);
        await queryRunner.query(`
            DROP TABLE "pick_picked_user"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_603aef313523c9bbd0bb997a4b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f4b85d725f44d8067d2fe84262"
        `);
        await queryRunner.query(`
            DROP TABLE "pick_owned_by_user"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_58a4d3a536bbb0f3146ac53834"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_5be74f622954f527a9a54eacd3"
        `);
        await queryRunner.query(`
            DROP TABLE "round_participants_user"
        `);
        await queryRunner.query(`
            DROP TABLE "pick"
        `);
        await queryRunner.query(`
            DROP TABLE "round"
        `);
    }

}
