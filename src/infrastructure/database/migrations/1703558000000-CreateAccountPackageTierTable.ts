import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAccountPackageTierTable1703558000000 implements MigrationInterface {
  name = 'CreateAccountPackageTierTable1703558000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'm_account_package_tier',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid()',
          },
          {
            name: 'account_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'min_value',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'max_value',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create index for account_id
    await queryRunner.createIndex(
      'm_account_package_tier',
      new TableIndex({
        name: 'IDX_account_package_tier_account_id',
        columnNames: ['account_id'],
      }),
    );

    // Create index for date range queries
    await queryRunner.createIndex(
      'm_account_package_tier',
      new TableIndex({
        name: 'IDX_account_package_tier_date_range',
        columnNames: ['start_date', 'end_date'],
      }),
    );

    // Create index for value range queries
    await queryRunner.createIndex(
      'm_account_package_tier',
      new TableIndex({
        name: 'IDX_account_package_tier_value_range',
        columnNames: ['min_value', 'max_value'],
      }),
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'm_account_package_tier',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'm_account',
        onDelete: 'CASCADE',
        name: 'FK_account_package_tier_account',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('m_account_package_tier');
  }
}
