import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAccountAddOnsTable1755053000000 implements MigrationInterface {
  name = 'CreateAccountAddOnsTable1755053000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'm_account_add_ons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'account_id',
            type: 'uuid',
            comment: 'Reference to account',
          },
          {
            name: 'add_ons_type',
            type: 'enum',
            enum: ['system_integration', 'infrastructure'],
            comment: 'Type of add-on',
          },
          {
            name: 'billing_type',
            type: 'enum',
            enum: ['otc', 'monthly'],
            comment: 'Billing type for the add-on',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            comment: 'Amount for the add-on',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: 'Additional description for the add-on',
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
            comment: 'Start date when this add-on becomes effective',
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
            comment: 'End date when this add-on expires',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            comment: 'Whether this add-on is active',
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '255',
            comment: 'User who created this record',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'User who last updated this record',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Timestamp when record was created',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            comment: 'Timestamp when record was last updated',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'm_account_add_ons',
      new TableIndex({
        name: 'IDX_account_add_ons_account_id',
        columnNames: ['account_id'],
      }),
    );

    await queryRunner.createIndex(
      'm_account_add_ons',
      new TableIndex({
        name: 'IDX_account_add_ons_active',
        columnNames: ['account_id', 'is_active'],
      }),
    );

    await queryRunner.createIndex(
      'm_account_add_ons',
      new TableIndex({
        name: 'IDX_account_add_ons_type',
        columnNames: ['account_id', 'add_ons_type', 'is_active'],
      }),
    );

    await queryRunner.createIndex(
      'm_account_add_ons',
      new TableIndex({
        name: 'IDX_account_add_ons_billing_type',
        columnNames: ['account_id', 'billing_type', 'is_active'],
      }),
    );

    await queryRunner.createIndex(
      'm_account_add_ons',
      new TableIndex({
        name: 'IDX_account_add_ons_date_range',
        columnNames: ['start_date', 'end_date'],
      }),
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'm_account_add_ons',
      new TableForeignKey({
        name: 'FK_account_add_ons_account',
        columnNames: ['account_id'],
        referencedTableName: 'm_account',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create check constraints
    await queryRunner.query(`
      ALTER TABLE "m_account_add_ons" 
      ADD CONSTRAINT "CHK_account_add_ons_positive_amount" 
      CHECK ("amount" >= 0)
    `);

    await queryRunner.query(`
      ALTER TABLE "m_account_add_ons" 
      ADD CONSTRAINT "CHK_account_add_ons_date_range" 
      CHECK ("start_date" IS NULL OR "end_date" IS NULL OR "start_date" <= "end_date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop check constraints
    await queryRunner.query(`
      ALTER TABLE "m_account_add_ons" 
      DROP CONSTRAINT "CHK_account_add_ons_date_range"
    `);

    await queryRunner.query(`
      ALTER TABLE "m_account_add_ons" 
      DROP CONSTRAINT "CHK_account_add_ons_positive_amount"
    `);

    // Drop foreign key constraint
    await queryRunner.dropForeignKey('m_account_add_ons', 'FK_account_add_ons_account');

    // Drop indexes
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_date_range');
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_billing_type');
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_type');
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_active');
    await queryRunner.dropIndex('m_account_add_ons', 'IDX_account_add_ons_account_id');

    // Drop table
    await queryRunner.dropTable('m_account_add_ons');
  }
}
