import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMasterMachine1765164098722 implements MigrationInterface {
    name = 'CreateMasterMachine1765164098722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."m_machine_machine_type_enum" AS ENUM('dedicated', 'non-dedicated')`);
        await queryRunner.query(`CREATE TABLE "m_machine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid, "machine_type" "public"."m_machine_machine_type_enum" NOT NULL, "data" jsonb, "is_active" boolean NOT NULL DEFAULT true, "created_by" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9f074068ab4a8c9a1e762bab46" PRIMARY KEY ("id")); COMMENT ON COLUMN "m_machine"."account_id" IS 'Reference to m_account.id'; COMMENT ON COLUMN "m_machine"."machine_type" IS 'Type of machine: dedicated or non-dedicated'; COMMENT ON COLUMN "m_machine"."data" IS 'Data from external API stored as JSON'`);
        await queryRunner.query(`CREATE INDEX "IDX_2cfb9bbd04ae90899e35858d82" ON "m_machine" ("account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f674247cfcdb2f08a18846692e" ON "m_machine" ("machine_type") `);
        await queryRunner.query(`ALTER TABLE "m_machine" ADD CONSTRAINT "FK_2cfb9bbd04ae90899e35858d826" FOREIGN KEY ("account_id") REFERENCES "m_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_machine" DROP CONSTRAINT "FK_2cfb9bbd04ae90899e35858d826"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f674247cfcdb2f08a18846692e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cfb9bbd04ae90899e35858d82"`);
        await queryRunner.query(`DROP TABLE "m_machine"`);
        await queryRunner.query(`DROP TYPE "public"."m_machine_machine_type_enum"`);
    }

}
