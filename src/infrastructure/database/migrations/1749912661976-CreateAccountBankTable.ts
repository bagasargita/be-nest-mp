import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountBankTable1749912661976 implements MigrationInterface {
    name = 'CreateAccountBankTable1749912661976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bank_account_no" character varying(50) NOT NULL, "bank_account_holder_name" character varying(100), "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, "account_id" uuid, "bank_id" uuid, "bank_category_id" uuid, CONSTRAINT "PK_3499932fa3ea3295ad9194d2796" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD CONSTRAINT "FK_f78e0c89251fcaf24dcd7c5e4d9" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD CONSTRAINT "FK_5b38e1f0102eb125e66df53c4ab" FOREIGN KEY ("bank_id") REFERENCES "m_bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" ADD CONSTRAINT "FK_895522b891314e28f06d4d5f42e" FOREIGN KEY ("bank_category_id") REFERENCES "m_bank_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP CONSTRAINT "FK_895522b891314e28f06d4d5f42e"`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP CONSTRAINT "FK_5b38e1f0102eb125e66df53c4ab"`);
        await queryRunner.query(`ALTER TABLE "m_account_bank" DROP CONSTRAINT "FK_f78e0c89251fcaf24dcd7c5e4d9"`);
        await queryRunner.query(`DROP TABLE "m_account_bank"`);
    }

}
