import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountRevenueRuleTable1750669569054 implements MigrationInterface {
    name = 'CreateAccountRevenueRuleTable1750669569054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_revenue_rules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "account_service_id" uuid NOT NULL, "rule_category" character varying NOT NULL, "rule_path" character varying NOT NULL, "rule_value" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_ad72a1d67f3afb4d13d86601885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules" ADD CONSTRAINT "FK_5f4b88b5d553a02a971db932f1c" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules" ADD CONSTRAINT "FK_d770fefa5a6ec0fc22d715acbb6" FOREIGN KEY ("account_service_id") REFERENCES "m_account_service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules" DROP CONSTRAINT "FK_d770fefa5a6ec0fc22d715acbb6"`);
        await queryRunner.query(`ALTER TABLE "m_account_revenue_rules" DROP CONSTRAINT "FK_5f4b88b5d553a02a971db932f1c"`);
        await queryRunner.query(`DROP TABLE "m_account_revenue_rules"`);
    }

}
