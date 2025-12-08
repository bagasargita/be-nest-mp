import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleAccountPIC1765000908153 implements MigrationInterface {
    name = 'AddRoleAccountPIC1765000908153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "role" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "role"`);
    }

}
