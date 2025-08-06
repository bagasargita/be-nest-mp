import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCDMProviderTable1753145971655 implements MigrationInterface {
    name = 'CreateCDMProviderTable1753145971655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_cdm_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "updated_by" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parentId" uuid, CONSTRAINT "PK_55577605d1f127357f0c0f34d99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "m_cdm_provider_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_72f0e9d7f9acbc3f18487b09600" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0932b643a969d463fe61a181f2" ON "m_cdm_provider_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b5a19536d7aad0482c2eddc1c" ON "m_cdm_provider_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "m_cdm_provider" ADD CONSTRAINT "FK_823ed2c40cb494ddd4e51ac4666" FOREIGN KEY ("parentId") REFERENCES "m_cdm_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_cdm_provider_closure" ADD CONSTRAINT "FK_0932b643a969d463fe61a181f2b" FOREIGN KEY ("id_ancestor") REFERENCES "m_cdm_provider"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_cdm_provider_closure" ADD CONSTRAINT "FK_8b5a19536d7aad0482c2eddc1c8" FOREIGN KEY ("id_descendant") REFERENCES "m_cdm_provider"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_cdm_provider_closure" DROP CONSTRAINT "FK_8b5a19536d7aad0482c2eddc1c8"`);
        await queryRunner.query(`ALTER TABLE "m_cdm_provider_closure" DROP CONSTRAINT "FK_0932b643a969d463fe61a181f2b"`);
        await queryRunner.query(`ALTER TABLE "m_cdm_provider" DROP CONSTRAINT "FK_823ed2c40cb494ddd4e51ac4666"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b5a19536d7aad0482c2eddc1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0932b643a969d463fe61a181f2"`);
        await queryRunner.query(`DROP TABLE "m_cdm_provider_closure"`);
        await queryRunner.query(`DROP TABLE "m_cdm_provider"`);
    }

}
