import { MigrationInterface, QueryRunner } from "typeorm";

export class ReGenerateMigration1750561956803 implements MigrationInterface {
    name = 'ReGenerateMigration1750561956803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "account_category_id"`);
        await queryRunner.query(`ALTER TABLE "m_account_category" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "m_account_category" ADD CONSTRAINT "FK_304aa1af063da2b062c55341830" FOREIGN KEY ("parentId") REFERENCES "m_account_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_category" DROP CONSTRAINT "FK_304aa1af063da2b062c55341830"`);
        await queryRunner.query(`ALTER TABLE "m_account_category" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "account_category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a" FOREIGN KEY ("account_category_id") REFERENCES "m_account_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
