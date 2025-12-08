import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCustomerPIC1764580387317 implements MigrationInterface {
    name = 'AlterCustomerPIC1764580387317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "password" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "password"`);
    }

}
