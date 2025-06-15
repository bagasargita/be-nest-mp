import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountPICTable1749912879197 implements MigrationInterface {
    name = 'CreateAccountPICTable1749912879197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_pic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "phone_no" character varying(30) NOT NULL, "email" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, "account_id" uuid, "position_id" uuid, CONSTRAINT "PK_e0c9023a2e5c7310961d6be0b2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD CONSTRAINT "FK_85648155ec70d25f1af6fe362ae" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" ADD CONSTRAINT "FK_c3eaed864c0042f2249e02bc024" FOREIGN KEY ("position_id") REFERENCES "m_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP CONSTRAINT "FK_c3eaed864c0042f2249e02bc024"`);
        await queryRunner.query(`ALTER TABLE "m_account_pic" DROP CONSTRAINT "FK_85648155ec70d25f1af6fe362ae"`);
        await queryRunner.query(`DROP TABLE "m_account_pic"`);
    }

}
