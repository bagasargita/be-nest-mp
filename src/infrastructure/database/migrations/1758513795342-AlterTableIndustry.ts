import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableIndustry1758513795342 implements MigrationInterface {
    name = 'AlterTableIndustry1758513795342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_industry" ADD "code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_industry" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_industry" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "m_industry" DROP COLUMN "code"`);
    }

}
