import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMasterPaymentGateway1757423271429 implements MigrationInterface {
    name = 'CreateTableMasterPaymentGateway1757423271429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."m_master_payment_gateway_category_enum" AS ENUM('DISBURSEMENT', 'VIRTUAL_ACCOUNT', 'PAYMENT', 'OTHERS')`);
        await queryRunner.query(`CREATE TABLE "m_master_payment_gateway" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "category" "public"."m_master_payment_gateway_category_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b2d318ca898e521b1835d63e85f" UNIQUE ("name"), CONSTRAINT "PK_89436f9b8e1d2d48348154edfe9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "m_master_payment_gateway"`);
        await queryRunner.query(`DROP TYPE "public"."m_master_payment_gateway_category_enum"`);
    }

}
