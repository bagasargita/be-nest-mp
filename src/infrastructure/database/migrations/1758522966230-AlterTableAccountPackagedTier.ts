import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableAccountPackagedTier1758522966230 implements MigrationInterface {
    name = 'AlterTableAccountPackagedTier1758522966230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" ADD "uuid_be" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP COLUMN "uuid_be"`);
    }

}
