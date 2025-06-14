import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTypeOfBusinessTable1749898155492 implements MigrationInterface {
    name = 'CreateTypeOfBusinessTable1749898155492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_type_of_business" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "detail" text, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_27685aef8fbd3296756fe220bf8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "m_type_of_business"`);
    }

}
