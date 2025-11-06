import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTransactionDeposit1762334064455 implements MigrationInterface {
    name = 'AlterTransactionDeposit1762334064455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_deposit" DROP CONSTRAINT "UQ_b5579bb75c34d867b4cd4aaee9e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_deposit" ADD CONSTRAINT "UQ_b5579bb75c34d867b4cd4aaee9e" UNIQUE ("code")`);
    }

}
