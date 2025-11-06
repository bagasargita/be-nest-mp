import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVendorEmailPhoneAndTypeArray1762416281842 implements MigrationInterface {
    name = 'AddVendorEmailPhoneAndTypeArray1762416281842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ADD "email" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ADD "phone" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ADD "vendor_uuid_be" character varying(255)`);
        
        // Change vendor_type from varchar to jsonb
        // First, we need to convert existing string values to JSON array format
        await queryRunner.query(`
            UPDATE "m_account_vendor" 
            SET "vendor_type" = CASE 
                WHEN "vendor_type" IS NOT NULL AND "vendor_type" != '' 
                THEN ('["' || "vendor_type" || '"]')::jsonb
                ELSE NULL
            END
        `);
        
        // Alter column type to jsonb
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ALTER COLUMN "vendor_type" TYPE jsonb USING "vendor_type"::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Convert jsonb back to varchar (take first element if array)
        await queryRunner.query(`
            UPDATE "m_account_vendor" 
            SET "vendor_type" = CASE 
                WHEN "vendor_type" IS NOT NULL AND jsonb_typeof("vendor_type") = 'array' AND jsonb_array_length("vendor_type") > 0
                THEN ("vendor_type"->>0)::varchar
                WHEN "vendor_type" IS NOT NULL
                THEN "vendor_type"::text::varchar
                ELSE NULL
            END
        `);
        
        // Alter column type back to varchar
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ALTER COLUMN "vendor_type" TYPE character varying(50) USING "vendor_type"::text`);
        
        // Drop new columns
        await queryRunner.query(`ALTER TABLE "m_account_vendor" DROP COLUMN "vendor_uuid_be"`);
        await queryRunner.query(`ALTER TABLE "m_account_vendor" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "m_account_vendor" DROP COLUMN "email"`);
    }
}

