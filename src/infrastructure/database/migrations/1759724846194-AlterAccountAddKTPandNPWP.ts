import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccountAddKTPandNPWP1759724846194 implements MigrationInterface {
    name = 'AlterAccountAddKTPandNPWP1759724846194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_ktp" character varying`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "no_npwp" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_npwp"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "no_ktp"`);
    }

}
