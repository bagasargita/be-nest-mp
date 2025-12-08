import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMasterAccountLength2551764687585789 implements MigrationInterface {
    name = 'AlterMasterAccountLength2551764687585789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_ktp"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_ktp" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_npwp"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_npwp" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "branch_uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "branch_uuid_be" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "branch_uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "branch_uuid_be" character varying`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_npwp"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_npwp" character varying`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_ktp"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_ktp" character varying`);
    }

}
