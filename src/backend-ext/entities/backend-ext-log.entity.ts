import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BackendExt } from './backend-ext.entity';

/**
 * Backend External API Transaction Log Entity
 * 
 * This entity stores ALL external API interactions for complete audit trail.
 * IMPORTANT: Each API call creates a NEW log record - never updates existing ones.
 * This ensures we can track all changes and maintain data integrity.
 */
@Entity('m_backend_ext_logs')
@Index(['configId'])
@Index(['createdAt'])
@Index(['responseStatus'])
@Index(['userId'])
@Index(['accountId'])
export class BackendExtLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'config_id', type: 'uuid' })
  configId: string;

  @Column({ type: 'varchar', length: 10, comment: 'HTTP method (GET, POST, PUT, DELETE, etc.)' })
  method: string;

  @Column({ type: 'varchar', length: 500, comment: 'API endpoint path' })
  endpoint: string;

  @Column({ name: 'request_body', type: 'jsonb', nullable: true, comment: 'Request body data sent to external API' })
  requestBody: any;

  @Column({ name: 'request_headers', type: 'jsonb', nullable: true, comment: 'Request headers sent to external API' })
  requestHeaders: any;

  @Column({ name: 'response_status', type: 'int', nullable: true, comment: 'HTTP response status code' })
  responseStatus: number;

  @Column({ name: 'response_body', type: 'jsonb', nullable: true, comment: 'Response data from external API' })
  responseBody: any;

  @Column({ name: 'response_headers', type: 'jsonb', nullable: true, comment: 'Response headers from external API' })
  responseHeaders: any;

  @Column({ name: 'execution_time_ms', type: 'int', nullable: true, comment: 'Request execution time in milliseconds' })
  executionTimeMs: number;

  @Column({ name: 'error_message', type: 'text', nullable: true, comment: 'Error message if request failed' })
  errorMessage: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true, comment: 'User who initiated the request' })
  userId: string;

  @Column({ name: 'account_id', type: 'uuid', nullable: true, comment: 'Account ID related to the request (if applicable)' })
  accountId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => BackendExt, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'config_id' })
  config: BackendExt;
}
