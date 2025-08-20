import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddForeignKeyRelationshipsToRevenueRules1737306000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add billing_method_id column to m_account_add_ons
    await queryRunner.addColumn('m_account_add_ons', new TableColumn({
      name: 'billing_method_id',
      type: 'uuid',
      isNullable: true,
      comment: 'FK to m_account_billing_method'
    }));

    // Add billing_method_id column to m_account_package_tier
    await queryRunner.addColumn('m_account_package_tier', new TableColumn({
      name: 'billing_method_id',
      type: 'uuid',
      isNullable: true,
      comment: 'FK to m_account_billing_method'
    }));

    // Add service_id column to m_account_billing_method (for revenue rule context)
    await queryRunner.addColumn('m_account_billing_method', new TableColumn({
      name: 'service_id',
      type: 'uuid',
      isNullable: true,
      comment: 'FK to service that this billing method belongs to'
    }));

    // Create foreign key from m_account_add_ons to m_account_billing_method
    await queryRunner.createForeignKey('m_account_add_ons', new TableForeignKey({
      name: 'FK_account_add_ons_billing_method',
      columnNames: ['billing_method_id'],
      referencedTableName: 'm_account_billing_method',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }));

    // Create foreign key from m_account_package_tier to m_account_billing_method
    await queryRunner.createForeignKey('m_account_package_tier', new TableForeignKey({
      name: 'FK_account_package_tier_billing_method',
      columnNames: ['billing_method_id'],
      referencedTableName: 'm_account_billing_method',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }));

    // Create indexes for better query performance
    await queryRunner.query(`CREATE INDEX "IDX_account_add_ons_billing_method_id" ON "m_account_add_ons" ("billing_method_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_account_package_tier_billing_method_id" ON "m_account_package_tier" ("billing_method_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_account_billing_method_service_id" ON "m_account_billing_method" ("service_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_billing_method_id');
    await queryRunner.dropIndex('m_account_package_tier', 'IDX_account_package_tier_billing_method_id');
    await queryRunner.dropIndex('m_account_billing_method', 'IDX_account_billing_method_service_id');

    // Drop foreign keys
    await queryRunner.dropForeignKey('m_account_add_ons', 'FK_account_add_ons_billing_method');
    await queryRunner.dropForeignKey('m_account_package_tier', 'FK_account_package_tier_billing_method');

    // Drop columns
    await queryRunner.dropColumn('m_account_add_ons', 'billing_method_id');
    await queryRunner.dropColumn('m_account_package_tier', 'billing_method_id');
    await queryRunner.dropColumn('m_account_billing_method', 'service_id');
  }
}
