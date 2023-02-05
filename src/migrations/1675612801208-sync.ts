import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1675612801208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "picking_owned_by_user"
    `);
    await queryRunner.query(`
        DROP TABLE "picking_picked_user"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
