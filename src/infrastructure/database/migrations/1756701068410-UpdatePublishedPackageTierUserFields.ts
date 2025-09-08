import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePublishedPackageTierUserFields1756701068410 implements MigrationInterface {
    name = 'UpdatePublishedPackageTierUserFields1756701068410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "FK_published_package_tier_updated_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "FK_published_package_tier_created_by"`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" DROP CONSTRAINT "FK_backend_ext_logs_account_id"`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" DROP CONSTRAINT "FK_backend_ext_logs_user_id"`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" DROP CONSTRAINT "FK_backend_ext_logs_config_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_date_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_value_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_backend_ext_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_backend_ext_logs_response_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_backend_ext_logs_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_backend_ext_logs_account_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_backend_ext_logs_config_id"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_value_range"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_date_range"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_positive_values"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_percentage"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "created_by" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "updated_by" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_7f652db0350338ab6016c3a2bd" ON "m_backend_ext_logs" ("account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b96d248c736f058757ceff0e26" ON "m_backend_ext_logs" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e167f402a614571d63c05facb8" ON "m_backend_ext_logs" ("response_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2e612052fc85228345c385fa8" ON "m_backend_ext_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_93e55a83148a5499cab7d8b24a" ON "m_backend_ext_logs" ("config_id") `);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ADD CONSTRAINT "FK_93e55a83148a5499cab7d8b24a6" FOREIGN KEY ("config_id") REFERENCES "m_backend_ext_config"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" DROP CONSTRAINT "FK_93e55a83148a5499cab7d8b24a6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93e55a83148a5499cab7d8b24a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2e612052fc85228345c385fa8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e167f402a614571d63c05facb8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b96d248c736f058757ceff0e26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f652db0350338ab6016c3a2bd"`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "CHK_published_package_tier_percentage" CHECK (((percentage IS NULL) OR ((percentage >= (0)::numeric) AND (percentage <= (100)::numeric))))`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "CHK_published_package_tier_positive_values" CHECK (((min_value >= (0)::numeric) AND (max_value > (0)::numeric) AND (amount >= (0)::numeric)))`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "CHK_published_package_tier_date_range" CHECK ((start_date < end_date))`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "CHK_published_package_tier_value_range" CHECK ((min_value < max_value))`);
        await queryRunner.query(`CREATE INDEX "IDX_backend_ext_logs_config_id" ON "m_backend_ext_logs" ("config_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_backend_ext_logs_account_id" ON "m_backend_ext_logs" ("account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_backend_ext_logs_user_id" ON "m_backend_ext_logs" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_backend_ext_logs_response_status" ON "m_backend_ext_logs" ("response_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_backend_ext_logs_created_at" ON "m_backend_ext_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_active" ON "m_published_package_tier" ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_value_range" ON "m_published_package_tier" ("max_value", "min_value") `);
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_date_range" ON "m_published_package_tier" ("end_date", "start_date") `);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ADD CONSTRAINT "FK_backend_ext_logs_config_id" FOREIGN KEY ("config_id") REFERENCES "m_backend_ext_config"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ADD CONSTRAINT "FK_backend_ext_logs_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_logs" ADD CONSTRAINT "FK_backend_ext_logs_account_id" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "FK_published_package_tier_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" ADD CONSTRAINT "FK_published_package_tier_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
