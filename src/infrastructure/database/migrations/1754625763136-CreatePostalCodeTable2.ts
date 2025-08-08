import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostalCodeTable21754625763136 implements MigrationInterface {
    name = 'CreatePostalCodeTable21754625763136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_postal_code" DROP CONSTRAINT "PK_a471376e3924c05e572d381867e"`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" ADD CONSTRAINT "PK_a471376e3924c05e572d381867e" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "m_postal_code" DROP CONSTRAINT "PK_a471376e3924c05e572d381867e"`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "m_postal_code" ADD CONSTRAINT "PK_a471376e3924c05e572d381867e" PRIMARY KEY ("id")`);
    }

}
