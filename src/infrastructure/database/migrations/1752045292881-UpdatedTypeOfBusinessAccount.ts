import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTypeOfBusinessAccount1752045292881 implements MigrationInterface {
    name = 'UpdatedTypeOfBusinessAccount1752045292881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_type_of_business" ADD "parent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "m_type_of_business" ADD "is_other" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "type_of_business_detail" text`);
        await queryRunner.query(`ALTER TABLE "m_type_of_business" ADD CONSTRAINT "FK_f14167f163dbfb2f39374e481fa" FOREIGN KEY ("parent_id") REFERENCES "m_type_of_business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_type_of_business" DROP CONSTRAINT "FK_f14167f163dbfb2f39374e481fa"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "type_of_business_detail"`);
        await queryRunner.query(`ALTER TABLE "m_type_of_business" DROP COLUMN "is_other"`);
        await queryRunner.query(`ALTER TABLE "m_type_of_business" DROP COLUMN "parent_id"`);
    }

}
