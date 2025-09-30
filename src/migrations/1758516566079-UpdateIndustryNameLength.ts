import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndustryNameLength1758516566079 implements MigrationInterface {
    name = 'UpdateIndustryNameLength1758516566079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_industry" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "m_industry" ADD "name" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_industry" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "m_industry" ADD "name" character varying(100) NOT NULL`);
    }

}
