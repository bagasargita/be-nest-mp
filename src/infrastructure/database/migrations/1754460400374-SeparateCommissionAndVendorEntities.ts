import { MigrationInterface, QueryRunner } from "typeorm";

export class SeparateCommissionAndVendorEntities1754460400374 implements MigrationInterface {
    name = 'SeparateCommissionAndVendorEntities1754460400374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_commission_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "commission_type" character varying(50) NOT NULL, "commission_rate" numeric(5,2), "rate_type" character varying(50), "notes" text, "territory" character varying(255), "exclusive" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_41d94af626d66df0f2409714c9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "m_account_vendor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "vendor_type" character varying(50), "vendor_classification" character varying(50), "vendor_rating" character varying(10), "tax_id" character varying(50), "contract_start_date" date, "contract_end_date" date, "payment_terms" character varying(50), "delivery_terms" character varying(50), "certification" text, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_54d83c99802435481455cb21f0" UNIQUE ("account_id"), CONSTRAINT "PK_e2cb94641e1bbce25125d46718e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_rate"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_rate"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_exclusive"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "contract_start_date"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "contract_end_date"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_classification"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_rating"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "tax_id"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "payment_terms"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_type"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_notes"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "delivery_terms"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_type"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_territory"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "certification"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_notes"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_type"`);
        await queryRunner.query(`ALTER TABLE "m_account_commission_rate" ADD CONSTRAINT "FK_9e282e741a947be288d0d0c6a6e" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_vendor" ADD CONSTRAINT "FK_54d83c99802435481455cb21f0f" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_vendor" DROP CONSTRAINT "FK_54d83c99802435481455cb21f0f"`);
        await queryRunner.query(`ALTER TABLE "m_account_commission_rate" DROP CONSTRAINT "FK_9e282e741a947be288d0d0c6a6e"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_notes" text`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "certification" text`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_territory" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "delivery_terms" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_notes" text`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "payment_terms" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "tax_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_rating" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_classification" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "contract_end_date" date`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "contract_start_date" date`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_exclusive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_rate" numeric(5,2)`);
        await queryRunner.query(`DROP TABLE "m_account_vendor"`);
        await queryRunner.query(`DROP TABLE "m_account_commission_rate"`);
    }

}
