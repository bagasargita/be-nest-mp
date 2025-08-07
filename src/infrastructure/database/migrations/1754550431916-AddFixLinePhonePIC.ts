import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFixLinePhonePIC1754550431916 implements MigrationInterface {
    name = 'AddFixLinePhonePIC1754550431916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add column as nullable since fix phone number is optional
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD "fix_phone_no" character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP COLUMN "fix_phone_no"`);
    }

}
