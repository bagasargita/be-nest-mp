import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableAccountAndAccountPIC1758610910948 implements MigrationInterface {
    name = 'AlterTableAccountAndAccountPIC1758610910948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" ADD "email" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "uuid_be" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "username" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "uuid_be" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "email"`);
    }

}
