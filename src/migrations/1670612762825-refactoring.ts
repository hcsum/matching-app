import { MigrationInterface, QueryRunner } from "typeorm"

export class refactoring1670612762825 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE ingredients (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                fullname VARCHAR ( 255 ) NOT NULL
                gender VARCHAR ( 6 ) NOT NULL 
                phone VARCHAR ( 6 ) UNIQUE NOT NULL  
                age int NOT NULL
                created_at DATE NOT NULL DEFAULT CURRENT_DATE 
                updated_At DATE NOT NULL DEFAULT CURRENT_DATE 
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
