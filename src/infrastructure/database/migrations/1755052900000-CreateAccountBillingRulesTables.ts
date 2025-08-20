import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAccountBillingRulesTables1755052900000 implements MigrationInterface {
    name = 'CreateAccountBillingRulesTables1755052900000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Account Billing Methods Table
        await queryRunner.createTable(new Table({
            name: 'm_account_billing_method',
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
                    isNullable: false,
                },
                {
                    name: 'method',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
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
                },
            ],
        }), true);

        // Create Account Tax Rules Table
        await queryRunner.createTable(new Table({
            name: 'm_account_tax_rule',
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
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                {
                    name: 'rate',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
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
                },
            ],
        }), true);

        // Create Account Term of Payment Table
        await queryRunner.createTable(new Table({
            name: 'm_account_term_of_payment',
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
                    isNullable: false,
                },
                {
                    name: 'payment_term',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'due_days',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'late_fee_rate',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'grace_period',
                    type: 'integer',
                    isNullable: true,
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
                },
            ],
        }), true);

        // Create indexes
        await queryRunner.createIndex('m_account_billing_method', new TableIndex({
            name: 'IDX_account_billing_method_account_id',
            columnNames: ['account_id'],
        }));

        await queryRunner.createIndex('m_account_billing_method', new TableIndex({
            name: 'IDX_account_billing_method_active',
            columnNames: ['account_id', 'is_active'],
        }));

        await queryRunner.createIndex('m_account_tax_rule', new TableIndex({
            name: 'IDX_account_tax_rule_account_id',
            columnNames: ['account_id'],
        }));

        await queryRunner.createIndex('m_account_tax_rule', new TableIndex({
            name: 'IDX_account_tax_rule_active',
            columnNames: ['account_id', 'is_active'],
        }));

        await queryRunner.createIndex('m_account_term_of_payment', new TableIndex({
            name: 'IDX_account_term_of_payment_account_id',
            columnNames: ['account_id'],
        }));

        await queryRunner.createIndex('m_account_term_of_payment', new TableIndex({
            name: 'IDX_account_term_of_payment_active',
            columnNames: ['account_id', 'is_active'],
        }));

        // Create foreign key constraints
        await queryRunner.createForeignKey('m_account_billing_method', new TableForeignKey({
            name: 'FK_account_billing_method_account',
            columnNames: ['account_id'],
            referencedTableName: 'm_account',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('m_account_tax_rule', new TableForeignKey({
            name: 'FK_account_tax_rule_account',
            columnNames: ['account_id'],
            referencedTableName: 'm_account',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('m_account_term_of_payment', new TableForeignKey({
            name: 'FK_account_term_of_payment_account',
            columnNames: ['account_id'],
            referencedTableName: 'm_account',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add check constraints
        await queryRunner.query(`
            ALTER TABLE "m_account_tax_rule" 
            ADD CONSTRAINT "CHK_account_tax_rule_rate" 
            CHECK ("rate" >= 0 AND "rate" <= 100)
        `);

        await queryRunner.query(`
            ALTER TABLE "m_account_term_of_payment" 
            ADD CONSTRAINT "CHK_account_term_of_payment_days" 
            CHECK ("due_days" > 0)
        `);

        await queryRunner.query(`
            ALTER TABLE "m_account_term_of_payment" 
            ADD CONSTRAINT "CHK_account_term_of_payment_late_fee" 
            CHECK ("late_fee_rate" IS NULL OR ("late_fee_rate" >= 0 AND "late_fee_rate" <= 100))
        `);

        await queryRunner.query(`
            ALTER TABLE "m_account_term_of_payment" 
            ADD CONSTRAINT "CHK_account_term_of_payment_grace_period" 
            CHECK ("grace_period" IS NULL OR "grace_period" >= 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop check constraints
        await queryRunner.query(`ALTER TABLE "m_account_term_of_payment" DROP CONSTRAINT "CHK_account_term_of_payment_grace_period"`);
        await queryRunner.query(`ALTER TABLE "m_account_term_of_payment" DROP CONSTRAINT "CHK_account_term_of_payment_late_fee"`);
        await queryRunner.query(`ALTER TABLE "m_account_term_of_payment" DROP CONSTRAINT "CHK_account_term_of_payment_days"`);
        await queryRunner.query(`ALTER TABLE "m_account_tax_rule" DROP CONSTRAINT "CHK_account_tax_rule_rate"`);

        // Drop foreign key constraints
        await queryRunner.dropForeignKey('m_account_term_of_payment', 'FK_account_term_of_payment_account');
        await queryRunner.dropForeignKey('m_account_tax_rule', 'FK_account_tax_rule_account');
        await queryRunner.dropForeignKey('m_account_billing_method', 'FK_account_billing_method_account');

        // Drop indexes
        await queryRunner.dropIndex('m_account_term_of_payment', 'IDX_account_term_of_payment_active');
        await queryRunner.dropIndex('m_account_term_of_payment', 'IDX_account_term_of_payment_account_id');
        await queryRunner.dropIndex('m_account_tax_rule', 'IDX_account_tax_rule_active');
        await queryRunner.dropIndex('m_account_tax_rule', 'IDX_account_tax_rule_account_id');
        await queryRunner.dropIndex('m_account_billing_method', 'IDX_account_billing_method_active');
        await queryRunner.dropIndex('m_account_billing_method', 'IDX_account_billing_method_account_id');

        // Drop tables
        await queryRunner.dropTable('m_account_term_of_payment');
        await queryRunner.dropTable('m_account_tax_rule');
        await queryRunner.dropTable('m_account_billing_method');
    }
}
