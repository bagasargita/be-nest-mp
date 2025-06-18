import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettlementMethodEntity1749960810308 implements MigrationInterface {
    name = 'AddSettlementMethodEntity1749960810308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "non_cash_method" ("id" SERIAL NOT NULL, "settlementMethodId" integer, CONSTRAINT "PK_c52061faf9c232c7499d41dd72b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "batching_detail" ("id" SERIAL NOT NULL, "frequency" character varying NOT NULL, "hour" integer, CONSTRAINT "PK_7e802b1ca4765f1d8b53f6becc1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cash_deposit_method" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "settlementMethodId" integer, "batchingDetailId" integer, CONSTRAINT "REL_18f3783799b1dff49b0c724e9e" UNIQUE ("batchingDetailId"), CONSTRAINT "PK_68b584a91490516d1187d06d686" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "send_money_method" ("id" SERIAL NOT NULL, "settlementMethodId" integer, CONSTRAINT "PK_ec556886b50927051300e3959f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "send_goods_method" ("id" SERIAL NOT NULL, "settlementMethodId" integer, CONSTRAINT "PK_0396a178920c6d1ebff3f317bbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settlement_method" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_77622deec725b105c762c64bae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "non_cash_method" ADD CONSTRAINT "FK_bfa1f9cdf66ee8dceb6f09fa757" FOREIGN KEY ("settlementMethodId") REFERENCES "settlement_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cash_deposit_method" ADD CONSTRAINT "FK_b3db9a771ab1d488489692acab0" FOREIGN KEY ("settlementMethodId") REFERENCES "settlement_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cash_deposit_method" ADD CONSTRAINT "FK_18f3783799b1dff49b0c724e9e7" FOREIGN KEY ("batchingDetailId") REFERENCES "batching_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "send_money_method" ADD CONSTRAINT "FK_608c45a5001e5bc1a1a02c0668a" FOREIGN KEY ("settlementMethodId") REFERENCES "settlement_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "send_goods_method" ADD CONSTRAINT "FK_ed4edba413b44b23f67190b1bff" FOREIGN KEY ("settlementMethodId") REFERENCES "settlement_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "send_goods_method" DROP CONSTRAINT "FK_ed4edba413b44b23f67190b1bff"`);
        await queryRunner.query(`ALTER TABLE "send_money_method" DROP CONSTRAINT "FK_608c45a5001e5bc1a1a02c0668a"`);
        await queryRunner.query(`ALTER TABLE "cash_deposit_method" DROP CONSTRAINT "FK_18f3783799b1dff49b0c724e9e7"`);
        await queryRunner.query(`ALTER TABLE "cash_deposit_method" DROP CONSTRAINT "FK_b3db9a771ab1d488489692acab0"`);
        await queryRunner.query(`ALTER TABLE "non_cash_method" DROP CONSTRAINT "FK_bfa1f9cdf66ee8dceb6f09fa757"`);
        await queryRunner.query(`DROP TABLE "settlement_method"`);
        await queryRunner.query(`DROP TABLE "send_goods_method"`);
        await queryRunner.query(`DROP TABLE "send_money_method"`);
        await queryRunner.query(`DROP TABLE "cash_deposit_method"`);
        await queryRunner.query(`DROP TABLE "batching_detail"`);
        await queryRunner.query(`DROP TABLE "non_cash_method"`);
    }

}
