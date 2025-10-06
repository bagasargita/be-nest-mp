import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBankUuidBe1759735578323 implements MigrationInterface {
    name = 'AlterBankUuidBe1759735578323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_bank" ADD "uuid_be" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_bank" DROP COLUMN "uuid_be"`);
    }

}
