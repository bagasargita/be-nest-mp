import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBackendExtLogsTable1756091000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'm_backend_ext_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'config_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '10',
            isNullable: false,
            comment: 'HTTP method (GET, POST, PUT, DELETE, etc.)',
          },
          {
            name: 'endpoint',
            type: 'varchar',
            length: '500',
            isNullable: false,
            comment: 'API endpoint path',
          },
          {
            name: 'request_body',
            type: 'jsonb',
            isNullable: true,
            comment: 'Request body data sent to external API',
          },
          {
            name: 'request_headers',
            type: 'jsonb',
            isNullable: true,
            comment: 'Request headers sent to external API',
          },
          {
            name: 'response_status',
            type: 'int',
            isNullable: true,
            comment: 'HTTP response status code',
          },
          {
            name: 'response_body',
            type: 'jsonb',
            isNullable: true,
            comment: 'Response data from external API',
          },
          {
            name: 'response_headers',
            type: 'jsonb',
            isNullable: true,
            comment: 'Response headers from external API',
          },
          {
            name: 'execution_time_ms',
            type: 'int',
            isNullable: true,
            comment: 'Request execution time in milliseconds',
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
            comment: 'Error message if request failed',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
            comment: 'User who initiated the request',
          },
          {
            name: 'account_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Account ID related to the request (if applicable)',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['config_id'],
            referencedTableName: 'm_backend_ext_config',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            name: 'FK_backend_ext_logs_config_id',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'FK_backend_ext_logs_user_id',
          },
          {
            columnNames: ['account_id'],
            referencedTableName: 'm_account',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'FK_backend_ext_logs_account_id',
          },
        ],
        indices: [
          {
            name: 'IDX_backend_ext_logs_config_id',
            columnNames: ['config_id'],
          },
          {
            name: 'IDX_backend_ext_logs_created_at',
            columnNames: ['created_at'],
          },
          {
            name: 'IDX_backend_ext_logs_response_status',
            columnNames: ['response_status'],
          },
          {
            name: 'IDX_backend_ext_logs_user_id',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_backend_ext_logs_account_id',
            columnNames: ['account_id'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('m_backend_ext_logs');
  }
}
