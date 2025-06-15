import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTable1749911711627 implements MigrationInterface {
    name = 'CreateAccountTable1749911711627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_industry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_6799c85130623d6b49f350218ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "m_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_no" character varying(30), "name" character varying(200) NOT NULL, "parent_id" uuid, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, "industry_id" uuid, "type_of_business_id" uuid, "account_type_id" uuid, "account_category_id" uuid, "parentId" uuid, CONSTRAINT "PK_bcb560f98bb3106ce94d6becb09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "m_account_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_4e8c9d5268aa90201adc74ed496" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_39f53388f8df6658264e3ec1d5" ON "m_account_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ecf69fa48883ab013e98ad1fb" ON "m_account_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_a451a04657ae96fa856954eaf7a" FOREIGN KEY ("industry_id") REFERENCES "m_industry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_90302277e30cfe4802a243c8dee" FOREIGN KEY ("type_of_business_id") REFERENCES "m_type_of_business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_6caee0e44bb88151c1e942c8c01" FOREIGN KEY ("account_type_id") REFERENCES "m_account_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a" FOREIGN KEY ("account_category_id") REFERENCES "m_account_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account" ADD CONSTRAINT "FK_ce02aa1a780bf094831f147632d" FOREIGN KEY ("parentId") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_closure" ADD CONSTRAINT "FK_39f53388f8df6658264e3ec1d53" FOREIGN KEY ("id_ancestor") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_closure" ADD CONSTRAINT "FK_0ecf69fa48883ab013e98ad1fbb" FOREIGN KEY ("id_descendant") REFERENCES "m_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_closure" DROP CONSTRAINT "FK_0ecf69fa48883ab013e98ad1fbb"`);
        await queryRunner.query(`ALTER TABLE "m_account_closure" DROP CONSTRAINT "FK_39f53388f8df6658264e3ec1d53"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_ce02aa1a780bf094831f147632d"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_4fe2f1ba8b6bf6da3c99c04470a"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_6caee0e44bb88151c1e942c8c01"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_90302277e30cfe4802a243c8dee"`);
        await queryRunner.query(`ALTER TABLE "m_account" DROP CONSTRAINT "FK_a451a04657ae96fa856954eaf7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ecf69fa48883ab013e98ad1fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39f53388f8df6658264e3ec1d5"`);
        await queryRunner.query(`DROP TABLE "m_account_closure"`);
        await queryRunner.query(`DROP TABLE "m_account"`);
        await queryRunner.query(`DROP TABLE "m_industry"`);
    }

}
