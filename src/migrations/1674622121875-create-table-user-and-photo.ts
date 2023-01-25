import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableUserAndPhoto1674622121875 implements MigrationInterface {
    name = 'createTableUserAndPhoto1674622121875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "gender" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "age" integer NOT NULL,
                "wechatId" character varying NOT NULL,
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
            ALTER TABLE "photo"
            ADD CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "photo" DROP CONSTRAINT "FK_4494006ff358f754d07df5ccc87"
        `);
        await queryRunner.query(`
            DROP TABLE "photo"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
