import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeAccountPICEmailNullable1760064050391 implements MigrationInterface {
    name = 'MakeAccountPICEmailNullable1760064050391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" ALTER COLUMN "email" SET NOT NULL`);
    }

}
