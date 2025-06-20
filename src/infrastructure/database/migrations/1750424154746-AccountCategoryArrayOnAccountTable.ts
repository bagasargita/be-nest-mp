import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountCategoryArrayOnAccountTable1750424154746 implements MigrationInterface {
    name = 'AccountCategoryArrayOnAccountTable1750424154746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a"`);
        await queryRunner.query(`CREATE TABLE "account_account_category" ("account_id" uuid NOT NULL, "account_category_id" uuid NOT NULL, CONSTRAINT "PK_287f83ac768796f2e3690c791d0" PRIMARY KEY ("account_id", "account_category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5d92e0f9af52ec59317f96561" ON "account_account_category" ("account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ced0ff7b0ccf2cb0c45a46bc0a" ON "account_account_category" ("account_category_id") `);
        await queryRunner.query(`ALTER TABLE "m_account" DROP COLUMN "account_category_id"`);
        await queryRunner.query(`ALTER TABLE "account_account_category" ADD CONSTRAINT "FK_e5d92e0f9af52ec59317f96561b" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_account_category" ADD CONSTRAINT "FK_ced0ff7b0ccf2cb0c45a46bc0aa" FOREIGN KEY ("account_category_id") REFERENCES "m_account_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_account_category" DROP CONSTRAINT "FK_ced0ff7b0ccf2cb0c45a46bc0aa"`);
        await queryRunner.query(`ALTER TABLE "account_account_category" DROP CONSTRAINT "FK_e5d92e0f9af52ec59317f96561b"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD "account_category_id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ced0ff7b0ccf2cb0c45a46bc0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5d92e0f9af52ec59317f96561"`);
        await queryRunner.query(`DROP TABLE "account_account_category"`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a" FOREIGN KEY ("account_category_id") REFERENCES "m_account_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
