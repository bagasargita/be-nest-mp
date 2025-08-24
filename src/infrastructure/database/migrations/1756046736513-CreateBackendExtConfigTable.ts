import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBackendExtConfigTable1756046736513 implements MigrationInterface {
    name = 'CreateBackendExtConfigTable1756046736513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "FK_account_package_tier_billing_method"`);
        await queryRunner.query(`ALTER TABLE "m_account_add_ons" DROP CONSTRAINT "FK_account_add_ons_billing_method"`);
        await queryRunner.query(`CREATE TABLE "m_backend_ext_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "base_url" character varying(500) NOT NULL, "client_id" character varying(100) NOT NULL, "client_secret" character varying(255) NOT NULL, "default_scope" text, "description" text, "is_active" boolean NOT NULL DEFAULT true, "token_expires_in" integer NOT NULL DEFAULT '3600', "additional_headers" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, CONSTRAINT "PK_a5472ed26bf5333fe46b4c069ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "m_account_package_tier"."billing_method_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "m_account_add_ons"."billing_method_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" ADD CONSTRAINT "FK_4f81cefbed6e250ee522a16c84b" FOREIGN KEY ("billing_method_id") REFERENCES "m_account_billing_method"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_add_ons" ADD CONSTRAINT "FK_2e7db9411a44491b3d7d43608d5" FOREIGN KEY ("billing_method_id") REFERENCES "m_account_billing_method"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_add_ons" DROP CONSTRAINT "FK_2e7db9411a44491b3d7d43608d5"`);
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "FK_4f81cefbed6e250ee522a16c84b"`);
        await queryRunner.query(`COMMENT ON COLUMN "m_account_add_ons"."billing_method_id" IS 'FK to m_account_billing_method'`);
        await queryRunner.query(`COMMENT ON COLUMN "m_account_package_tier"."billing_method_id" IS 'FK to m_account_billing_method'`);
        await queryRunner.query(`DROP TABLE "m_backend_ext_config"`);
        await queryRunner.query(`ALTER TABLE "m_account_add_ons" ADD CONSTRAINT "FK_account_add_ons_billing_method" FOREIGN KEY ("billing_method_id") REFERENCES "m_account_billing_method"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" ADD CONSTRAINT "FK_account_package_tier_billing_method" FOREIGN KEY ("billing_method_id") REFERENCES "m_account_billing_method"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
