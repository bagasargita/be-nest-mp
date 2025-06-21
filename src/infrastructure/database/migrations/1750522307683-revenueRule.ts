import { MigrationInterface, QueryRunner } from "typeorm";

export class RevenueRule1750522307683 implements MigrationInterface {
    name = 'RevenueRule1750522307683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_category_enum" AS ENUM('CHARGING_METRIC', 'BILLING_RULES')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_chargingtype_enum" AS ENUM('DEDICATED', 'NON_DEDICATED')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_dedicatedtype_enum" AS ENUM('PACKAGE', 'NON_PACKAGE', 'ADD_ONS')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_nonpackagetype_enum" AS ENUM('MACHINE_ONLY', 'SERVICE_ONLY')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_addonstype_enum" AS ENUM('SYSTEM_INTEGRATION', 'INFRASTRUCTURE')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_systemintegrationtype_enum" AS ENUM('OTC', 'MONTHLY')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_nondedicatedtype_enum" AS ENUM('TRANSACTION_FEE', 'SUBSCRIPTION', 'HYBRID', 'ADD_ONS')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_transactionfeetype_enum" AS ENUM('FIXED_RATE', 'PERCENTAGE')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_subscriptionperiod_enum" AS ENUM('MONTHLY', 'YEARLY')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_billingruletype_enum" AS ENUM('BILLING_METHOD', 'TAX_RULES', 'TERM_OF_PAYMENT')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_billingmethodtype_enum" AS ENUM('AUTO_DEDUCT', 'POST_PAID', 'HYBRID')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_paymenttype_enum" AS ENUM('TRANSACTION', 'SUBSCRIPTION')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_paymentperiod_enum" AS ENUM('WEEKLY', 'MONTHLY', 'YEARLY')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_taxruletype_enum" AS ENUM('INCLUDE', 'EXCLUDE')`);
        await queryRunner.query(`CREATE TYPE "public"."revenue-rules_topperiod_enum" AS ENUM('14_DAYS', '30_DAYS')`);
        await queryRunner.query(`CREATE TABLE "revenue-rules" ("id" SERIAL NOT NULL, "name" character varying, "type" character varying, "category" "public"."revenue-rules_category_enum", "chargingType" "public"."revenue-rules_chargingtype_enum", "dedicatedType" "public"."revenue-rules_dedicatedtype_enum", "nonPackageType" "public"."revenue-rules_nonpackagetype_enum", "addOnsType" "public"."revenue-rules_addonstype_enum", "systemIntegrationType" "public"."revenue-rules_systemintegrationtype_enum", "nonDedicatedType" "public"."revenue-rules_nondedicatedtype_enum", "transactionFeeType" "public"."revenue-rules_transactionfeetype_enum", "subscriptionPeriod" "public"."revenue-rules_subscriptionperiod_enum", "hasDiscount" boolean, "billingRuleType" "public"."revenue-rules_billingruletype_enum", "billingMethodType" "public"."revenue-rules_billingmethodtype_enum", "paymentType" "public"."revenue-rules_paymenttype_enum", "paymentPeriod" "public"."revenue-rules_paymentperiod_enum", "taxRuleType" "public"."revenue-rules_taxruletype_enum", "topPeriod" "public"."revenue-rules_topperiod_enum", "value" numeric(10,2), "mpath" character varying DEFAULT '', "parentId" integer, CONSTRAINT "PK_9bea1892c7f131dd2fb688cd25e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "revenue-rules" ADD CONSTRAINT "FK_9f2cefd56765fac5fa0b0b89312" FOREIGN KEY ("parentId") REFERENCES "revenue-rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revenue-rules" DROP CONSTRAINT "FK_9f2cefd56765fac5fa0b0b89312"`);
        await queryRunner.query(`DROP TABLE "revenue-rules"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_topperiod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_taxruletype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_paymentperiod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_paymenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_billingmethodtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_billingruletype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_subscriptionperiod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_transactionfeetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_nondedicatedtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_systemintegrationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_addonstype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_nonpackagetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_dedicatedtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_chargingtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."revenue-rules_category_enum"`);
    }

}
