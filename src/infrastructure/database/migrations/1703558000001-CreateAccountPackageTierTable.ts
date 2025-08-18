import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountPackageTierTable1703558000000 implements MigrationInterface {
    name = 'CreateAccountPackageTierTable1703558000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the m_account_package_tier table
        await queryRunner.query(`
            CREATE TABLE "m_account_package_tier" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "account_id" uuid NOT NULL, 
                "min_value" decimal(15,2) NOT NULL, 
                "max_value" decimal(15,2) NOT NULL, 
                "amount" decimal(15,2) NOT NULL, 
                "start_date" date NOT NULL, 
                "end_date" date NOT NULL, 
                "is_active" boolean NOT NULL DEFAULT true, 
                "created_by" character varying(50) NOT NULL, 
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                "updated_by" character varying(50), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                CONSTRAINT "PK_account_package_tier" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_account_package_tier_account_id" ON "m_account_package_tier" ("account_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_account_package_tier_date_range" ON "m_account_package_tier" ("start_date", "end_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_account_package_tier_value_range" ON "m_account_package_tier" ("min_value", "max_value")`);
        await queryRunner.query(`CREATE INDEX "IDX_account_package_tier_active" ON "m_account_package_tier" ("is_active")`);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "m_account_package_tier" 
            ADD CONSTRAINT "FK_account_package_tier_account" 
            FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Add check constraints
        await queryRunner.query(`
            ALTER TABLE "m_account_package_tier" 
            ADD CONSTRAINT "CHK_account_package_tier_value_range" 
            CHECK ("min_value" < "max_value")
        `);

        await queryRunner.query(`
            ALTER TABLE "m_account_package_tier" 
            ADD CONSTRAINT "CHK_account_package_tier_date_range" 
            CHECK ("start_date" < "end_date")
        `);

        await queryRunner.query(`
            ALTER TABLE "m_account_package_tier" 
            ADD CONSTRAINT "CHK_account_package_tier_positive_values" 
            CHECK ("min_value" >= 0 AND "max_value" > 0 AND "amount" >= 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop check constraints
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "CHK_account_package_tier_positive_values"`);
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "CHK_account_package_tier_date_range"`);
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "CHK_account_package_tier_value_range"`);
        
        // Drop foreign key constraint
        await queryRunner.query(`ALTER TABLE "m_account_package_tier" DROP CONSTRAINT "FK_account_package_tier_account"`);
        
        // Drop indexes
        await queryRunner.query(`DROP INDEX "public"."IDX_account_package_tier_active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_account_package_tier_value_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_account_package_tier_date_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_account_package_tier_account_id"`);
        
        // Drop table
        await queryRunner.query(`DROP TABLE "m_account_package_tier"`);
    }
}
