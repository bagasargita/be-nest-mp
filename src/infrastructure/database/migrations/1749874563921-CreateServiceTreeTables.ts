import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceTreeTables1749874563921 implements MigrationInterface {
    name = 'CreateServiceTreeTables1749874563921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying, "parentId" uuid, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_3134c8f6d4e186e39ef6833b150" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b7e2de3370223198b5751b4e48" ON "services_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_3377d998c45d36ae47a3af1435" ON "services_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_d860550b16be1d54b1d9877b89c" FOREIGN KEY ("parentId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_closure" ADD CONSTRAINT "FK_b7e2de3370223198b5751b4e480" FOREIGN KEY ("id_ancestor") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_closure" ADD CONSTRAINT "FK_3377d998c45d36ae47a3af14358" FOREIGN KEY ("id_descendant") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services_closure" DROP CONSTRAINT "FK_3377d998c45d36ae47a3af14358"`);
        await queryRunner.query(`ALTER TABLE "services_closure" DROP CONSTRAINT "FK_b7e2de3370223198b5751b4e480"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_d860550b16be1d54b1d9877b89c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3377d998c45d36ae47a3af1435"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7e2de3370223198b5751b4e48"`);
        await queryRunner.query(`DROP TABLE "services_closure"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
