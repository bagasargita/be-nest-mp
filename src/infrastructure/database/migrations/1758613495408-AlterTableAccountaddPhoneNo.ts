import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableAccountaddPhoneNo1758613495408 implements MigrationInterface {
    name = 'AlterTableAccountaddPhoneNo1758613495408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" ADD "phone_no" character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "phone_no"`);
    }

}
