import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionDeposit1762163603485 implements MigrationInterface {
    name = 'CreateTransactionDeposit1762163603485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255) NOT NULL, "total_deposit" numeric(15,2) NOT NULL DEFAULT '0', "charging_fee" numeric(15,2) NOT NULL DEFAULT '0', "total_transfer" numeric(15,2) NOT NULL DEFAULT '0', "transaction_status" character varying(50) NOT NULL, "machine_info" text, "machine_id" uuid, "cdm_trx_no" character varying(100), "cdm_trx_date" date, "cdm_trx_time" TIME, "cdm_trx_date_time" TIMESTAMP, "jam_posting" TIMESTAMP, "denominations" jsonb, "user" jsonb, "customer" jsonb, "beneficiary_account" jsonb, "machine" jsonb, "service_product" jsonb, "pjpur_status" jsonb, "gateway_status" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b5579bb75c34d867b4cd4aaee9e" UNIQUE ("code"), CONSTRAINT "PK_0b9f8e4e71a5827742138350bb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b5579bb75c34d867b4cd4aaee9" ON "transaction_deposit" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_91eb93a3f12477014c6fe2e43f" ON "transaction_deposit" ("transaction_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_ea46ad29b314f878796548c647" ON "transaction_deposit" ("machine_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96f0943ce7187d65ea2593621a" ON "transaction_deposit" ("cdm_trx_no") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2ae1202ee85a60d7a19eae20c" ON "transaction_deposit" ("cdm_trx_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_618945bf4aacc2b7042917ef64" ON "transaction_deposit" ("cdm_trx_date_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_cae5cb6f9e84d8d19457e26ca5" ON "transaction_deposit" ("jam_posting") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cae5cb6f9e84d8d19457e26ca5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_618945bf4aacc2b7042917ef64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2ae1202ee85a60d7a19eae20c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96f0943ce7187d65ea2593621a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea46ad29b314f878796548c647"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91eb93a3f12477014c6fe2e43f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5579bb75c34d867b4cd4aaee9"`);
        await queryRunner.query(`DROP TABLE "transaction_deposit"`);
    }

}
