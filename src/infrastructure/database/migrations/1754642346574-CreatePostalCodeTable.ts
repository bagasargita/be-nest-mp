import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostalCodeTable1754642346574 implements MigrationInterface {
    name = 'CreatePostalCodeTable1754642346574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_postal_code" ("id" SERIAL NOT NULL, "postal_code" character varying(50) NOT NULL, "sub_district" character varying(255) NOT NULL, "district" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "province" character varying(255) NOT NULL, "country" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_a471376e3924c05e572d381867e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD "bank_account_holder_firstname" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD "bank_account_holder_lastname" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP COLUMN "bank_account_holder_lastname"`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP COLUMN "bank_account_holder_firstname"`);
        await queryRunner.query(`DROP TABLE "m_postal_code"`);
    }

}
