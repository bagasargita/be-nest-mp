import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccBankUuidBe1760497715284 implements MigrationInterface {
    name = 'AlterAccBankUuidBe1760497715284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD "uuid_be" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP COLUMN "uuid_be"`);
    }

}
