import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class RemoveServiceIdFromBillingMethod1737307000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the service_id index first
    await queryRunner.dropIndex('m_account_billing_method', 'IDX_account_billing_method_service_id');

    // Drop the service_id column from m_account_billing_method since it's redundant
    // The relationship between billing method and service is managed through account context
    await queryRunner.dropColumn('m_account_billing_method', 'service_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add service_id column back
    await queryRunner.addColumn('m_account_billing_method', new TableColumn({
      name: 'service_id',
      type: 'uuid',
      isNullable: true,
      comment: 'FK to service that this billing method belongs to'
    }));

    // Create index for better query performance
    await queryRunner.query(`CREATE INDEX "IDX_account_billing_method_service_id" ON "m_account_billing_method" ("service_id")`);
  }
}
