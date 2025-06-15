import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePositionTable1749908438790 implements MigrationInterface {
    name = 'CreatePositionTable1749908438790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_position" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, CONSTRAINT "PK_e1e1ec6eafc9b1e4830db294eb1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "m_position"`);
    }

}
