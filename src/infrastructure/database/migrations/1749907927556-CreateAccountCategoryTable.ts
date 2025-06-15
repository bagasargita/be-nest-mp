import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountCategoryTable1749907927556 implements MigrationInterface {
    name = 'CreateAccountCategoryTable1749907927556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_60699daf0afa1931fdb6690f825" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "m_account_category"`);
    }

}
