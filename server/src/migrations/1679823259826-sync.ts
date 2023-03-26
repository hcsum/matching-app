import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679823259826 implements MigrationInterface {
  name = "sync1679823259826";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE "picking"
            SET "isConfirmed" = FALSE 
        `);
  }

  public async down(): Promise<void> {
    throw new Error("method not implemented");
  }
}

