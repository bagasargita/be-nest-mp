import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenUrlToBackendExt1756048979279 implements MigrationInterface {
    name = 'AddTokenUrlToBackendExt1756048979279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" ADD "token_url" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_backend_ext_config" DROP COLUMN "token_url"`);
    }

}
