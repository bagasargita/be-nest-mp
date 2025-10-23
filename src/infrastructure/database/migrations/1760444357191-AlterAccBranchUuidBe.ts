import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAccBranchUuidBe1760444357191 implements MigrationInterface {
    name = 'AlterAccBranchUuidBe1760444357191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" ADD "branch_uuid_be" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "branch_uuid_be"`);
    }

}
