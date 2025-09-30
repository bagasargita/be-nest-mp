import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePublishedPackagedTier1758522263387 implements MigrationInterface {
    name = 'AlterTablePublishedPackagedTier1758522263387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "uuid_be" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "uuid_be"`);
    }

}
