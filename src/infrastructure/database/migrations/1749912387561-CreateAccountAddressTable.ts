import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountAddressTable1749912387561 implements MigrationInterface {
    name = 'CreateAccountAddressTable1749912387561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address1" character varying(255) NOT NULL, "address2" character varying(255), "sub_district" character varying(100) NOT NULL, "district" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "province" character varying(100) NOT NULL, "postalcode" character varying(20) NOT NULL, "country" character varying(100) NOT NULL, "latitude" numeric(9,6), "longitude" numeric(9,6), "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, "account_id" uuid, CONSTRAINT "PK_2f1d7adde013f3f62c0ac802871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_address" ADD CONSTRAINT "FK_7dc94bceb22561b49d331ebc459" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_address" DROP CONSTRAINT "FK_7dc94bceb22561b49d331ebc459"`);
        await queryRunner.query(`DROP TABLE "m_account_address"`);
    }

}
