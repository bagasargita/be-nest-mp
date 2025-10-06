import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccountPackageTierPercentageBoolean1759733811368 implements MigrationInterface {
    name = 'AlterAccountPackageTierPercentageBoolean1759733811368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" ADD "percentage" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP COLUMN "percentage"`);
    }

}
