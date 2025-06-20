import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAccountService1750407514496 implements MigrationInterface {
    name = 'CreateTableAccountService1750407514496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_account_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP, "updated_by" character varying(50), "updated_at" TIMESTAMP, "account_id" uuid, "service_id" uuid, CONSTRAINT "PK_76e651219eb7ecc67bd6630efa2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "m_account_service" ADD CONSTRAINT "FK_23f18fb05f8ee358972f82978a6" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "m_account_service" ADD CONSTRAINT "FK_4873dd82152a00d522cd0bc1714" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_account_service" DROP CONSTRAINT "FK_4873dd82152a00d522cd0bc1714"`);
        await queryRunner.query(`ALTER TABLE "m_account_service" DROP CONSTRAINT "FK_23f18fb05f8ee358972f82978a6"`);
        await queryRunner.query(`DROP TABLE "m_account_service"`);
    }

}
