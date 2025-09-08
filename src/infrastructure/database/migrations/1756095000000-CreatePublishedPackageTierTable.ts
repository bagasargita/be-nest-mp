import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePublishedPackageTierTable1756095000000 implements MigrationInterface {
    name = 'CreatePublishedPackageTierTable1756095000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create published package tier table
        await queryRunner.query(`
            CREATE TABLE "m_published_package_tier" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_value" decimal(15,2) NOT NULL,
                "max_value" decimal(15,2) NOT NULL,
                "amount" decimal(15,2) NOT NULL,
                "percentage" decimal(5,2),
                "start_date" TIMESTAMP NOT NULL,
                "end_date" TIMESTAMP NOT NULL,
                "created_by" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_by" uuid,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_published_package_tier" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_date_range" ON "m_published_package_tier" ("start_date", "end_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_value_range" ON "m_published_package_tier" ("min_value", "max_value")`);
        await queryRunner.query(`CREATE INDEX "IDX_published_package_tier_active" ON "m_published_package_tier" ("is_active")`);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "FK_published_package_tier_created_by" 
            FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "FK_published_package_tier_updated_by" 
            FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        // Add check constraints
        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "CHK_published_package_tier_value_range" 
            CHECK ("min_value" < "max_value")
        `);

        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "CHK_published_package_tier_date_range" 
            CHECK ("start_date" < "end_date")
        `);

        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "CHK_published_package_tier_positive_values" 
            CHECK ("min_value" >= 0 AND "max_value" > 0 AND "amount" >= 0)
        `);

        await queryRunner.query(`
            ALTER TABLE "m_published_package_tier" 
            ADD CONSTRAINT "CHK_published_package_tier_percentage" 
            CHECK ("percentage" IS NULL OR ("percentage" >= 0 AND "percentage" <= 100))
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop check constraints
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_percentage"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_positive_values"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_date_range"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "CHK_published_package_tier_value_range"`);
        
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "FK_published_package_tier_updated_by"`);
        await queryRunner.query(`ALTER TABLE "m_published_package_tier" DROP CONSTRAINT "FK_published_package_tier_created_by"`);
        
        // Drop indexes
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_value_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_published_package_tier_date_range"`);
        
        // Drop table
        await queryRunner.query(`DROP TABLE "m_published_package_tier"`);
    }
}
