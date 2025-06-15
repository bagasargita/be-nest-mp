import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccountAddressTable1749917545157 implements MigrationInterface {
    name = 'AlterAccountAddressTable1749917545157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" ADD "phone_no" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" DROP COLUMN "phone_no"`);
    }

}
