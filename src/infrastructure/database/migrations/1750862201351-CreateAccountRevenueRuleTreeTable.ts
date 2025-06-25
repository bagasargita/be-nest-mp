import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountRevenueRuleTreeTable1750862201351 implements MigrationInterface {
    name = 'CreateAccountRevenueRuleTreeTable1750862201351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_revenue_rules_tree" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "account_service_id" uuid NOT NULL, "charging_metric" jsonb NOT NULL, "billing_rules" jsonb NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_28597d283c650658d79bd0a6a88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules_tree" ADD CONSTRAINT "FK_9ad0fc6c13103755affa52a5312" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules_tree" ADD CONSTRAINT "FK_fe0210e5e54d33a61cdd800aa1d" FOREIGN KEY ("account_service_id") REFERENCES "m_account_service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules_tree" DROP CONSTRAINT "FK_fe0210e5e54d33a61cdd800aa1d"`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules_tree" DROP CONSTRAINT "FK_9ad0fc6c13103755affa52a5312"`);
        await queryRunner.query(`DROP TABLE "m_account_revenue_rules_tree"`);
    }

}
