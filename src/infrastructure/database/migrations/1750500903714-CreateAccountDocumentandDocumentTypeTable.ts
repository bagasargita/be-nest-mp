import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountDocumentandDocumentTypeTable1750500903714 implements MigrationInterface {
    name = 'CreateAccountDocumentandDocumentTypeTable1750500903714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, CONSTRAINT "UQ_8736291c18c1dda6cb8918bbc19" UNIQUE ("code"), CONSTRAINT "PK_2e1aa55eac1947ddf3221506edb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "m_account_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document_type" character varying NOT NULL, "expires_at" TIMESTAMP, "filename" character varying NOT NULL, "file_path" character varying NOT NULL, "file_size" integer, "mime_type" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "account_id" uuid, CONSTRAINT "PK_f0fadb78d99ed73971bf5b4f59f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_document" ADD CONSTRAINT "FK_d3c1f82443d67001ab0f2adde22" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_document" DROP CONSTRAINT "FK_d3c1f82443d67001ab0f2adde22"`);
        await queryRunner.query(`DROP TABLE "m_account_document"`);
        await queryRunner.query(`DROP TABLE "document_type"`);
    }

}
