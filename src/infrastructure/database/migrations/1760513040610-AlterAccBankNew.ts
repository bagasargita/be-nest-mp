import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccBankNew1760513040610 implements MigrationInterface {
    name = 'AlterAccBankNew1760513040610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP COLUMN "uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD "uuid_be" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP COLUMN "uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD "uuid_be" character varying(50)`);
    }

}
