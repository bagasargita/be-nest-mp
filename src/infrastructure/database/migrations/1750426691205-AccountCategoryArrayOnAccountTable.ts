import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountCategoryArrayOnAccountTable1750426691205 implements MigrationInterface {
    name = 'AccountCategoryArrayOnAccountTable1750426691205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_category_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_4ec47ddcc5ce0d1bf14657cdace" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7e604e0feb6a1d1b318849eaf9" ON "m_account_category_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ed20fbb2bb0675b0df8d99dd6" ON "m_account_category_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "m_account_category" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "m_account_category" ADD CONSTRAINT "FK_304aa1af063da2b062c55341830" FOREIGN KEY ("parentId") REFERENCES "m_account_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_category_closure" ADD CONSTRAINT "FK_7e604e0feb6a1d1b318849eaf99" FOREIGN KEY ("id_ancestor") REFERENCES "m_account_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_category_closure" ADD CONSTRAINT "FK_5ed20fbb2bb0675b0df8d99dd6a" FOREIGN KEY ("id_descendant") REFERENCES "m_account_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_category_closure" DROP CONSTRAINT "FK_5ed20fbb2bb0675b0df8d99dd6a"`);
        await queryRunner.query(`ALTER TABLE "m_account_category_closure" DROP CONSTRAINT "FK_7e604e0feb6a1d1b318849eaf99"`);
        await queryRunner.query(`ALTER TABLE "m_account_category" DROP CONSTRAINT "FK_304aa1af063da2b062c55341830"`);
        await queryRunner.query(`ALTER TABLE "m_account_category" DROP COLUMN "parentId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ed20fbb2bb0675b0df8d99dd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e604e0feb6a1d1b318849eaf9"`);
        await queryRunner.query(`DROP TABLE "m_account_category_closure"`);
    }

}
