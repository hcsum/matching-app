import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/naming-convention */

export class sync1675612801208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "picking_owned_by_user"
    `);
    await queryRunner.query(`
        DROP TABLE "picking_picked_user"
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }
}
