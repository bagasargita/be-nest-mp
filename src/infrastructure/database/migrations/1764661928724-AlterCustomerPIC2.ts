import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCustomerPIC21764661928724 implements MigrationInterface {
    name = 'AlterCustomerPIC21764661928724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "role_access" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "role_access_mobile" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "web_portal" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "mobile" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "web_portal"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "role_access_mobile"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "role_access"`);
    }

}
