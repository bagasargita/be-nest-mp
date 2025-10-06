import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPublishedPackageTierPercentageBoolean1759459214999 implements MigrationInterface {
    name = 'AlterPublishedPackageTierPercentageBoolean1759459214999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "percentage" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "percentage" numeric(5,2)`);
    }

}
