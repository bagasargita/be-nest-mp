import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMethodUrlToBackendExt1756051291536 implements MigrationInterface {
    name = 'AddMethodUrlToBackendExt1756051291536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" ADD "method" character varying(10) NOT NULL DEFAULT 'GET'`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" ADD "url" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" DROP COLUMN "method"`);
    }

}
