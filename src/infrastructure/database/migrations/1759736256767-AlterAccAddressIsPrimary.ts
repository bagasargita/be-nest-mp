import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccAddressIsPrimary1759736256767 implements MigrationInterface {
    name = 'AlterAccAddressIsPrimary1759736256767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" ADD "is_primary" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" DROP COLUMN "is_primary"`);
    }

}
