import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679828761779 implements MigrationInterface {
    name = 'sync1679828761779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ALTER COLUMN "matchingEventId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "picking" DROP CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82"
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ALTER COLUMN "matchingEventId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "picking"
            ADD CONSTRAINT "FK_c810aa9c2884f17395d27ea6f82" FOREIGN KEY ("matchingEventId") REFERENCES "matching_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
