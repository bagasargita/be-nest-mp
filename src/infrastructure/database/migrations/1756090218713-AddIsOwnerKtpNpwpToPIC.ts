import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOwnerKtpNpwpToPIC1756090218713 implements MigrationInterface {
    name = 'AddIsOwnerKtpNpwpToPIC1756090218713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "no_ktp" character varying`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "no_npwp" character varying`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "is_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "m_account_address" ADD "website" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "is_owner"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "no_npwp"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "no_ktp"`);
    }

}
