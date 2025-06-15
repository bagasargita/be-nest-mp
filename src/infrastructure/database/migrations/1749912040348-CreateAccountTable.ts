import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTable1749912040348 implements MigrationInterface {
    name = 'CreateAccountTable1749912040348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "parent_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" ADD "parent_id" uuid`);
    }

}
