import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountReferal1753921449958 implements MigrationInterface {
    name = 'CreateAccountReferal1753921449958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_referrals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "referral_account_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f494d728ebfa7cb40ab9c4959a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "referral_commission_notes" text`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_territory" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_exclusive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "location_partner_commission_notes" text`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_classification" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "vendor_rating" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "tax_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "contract_start_date" date`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "contract_end_date" date`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "payment_terms" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "delivery_terms" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "certification" text`);
        await queryRunner.query(`ALTER TABLE "account_referrals" ADD CONSTRAINT "FK_827b41b50ae99e7a522960931b2" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_referrals" ADD CONSTRAINT "FK_edcdbe9d884584cce28828d1355" FOREIGN KEY ("referral_account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_referrals" DROP CONSTRAINT "FK_edcdbe9d884584cce28828d1355"`);
        await queryRunner.query(`ALTER TABLE "account_referrals" DROP CONSTRAINT "FK_827b41b50ae99e7a522960931b2"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "certification"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "delivery_terms"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "payment_terms"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "contract_end_date"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "contract_start_date"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "tax_id"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_rating"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_classification"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "vendor_type"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_notes"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_exclusive"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_territory"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_type"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "location_partner_commission_rate"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_notes"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_type"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "referral_commission_rate"`);
        await queryRunner.query(`DROP TABLE "account_referrals"`);
    }

}
