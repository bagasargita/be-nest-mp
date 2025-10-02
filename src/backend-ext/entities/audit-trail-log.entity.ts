import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Audit Trail Log Entity - Independent External API Call Logging
 * 
 * This entity is specifically designed for logging ALL external API interactions
 * for complete audit trail purposes, independent of backend_ext configurations.
 * 
 * Purpose: Track every mutation operation (POST/PUT/PATCH/DELETE) made to external APIs
 * for compliance, debugging, and monitoring purposes.
 */
@Entity('m_audit_trail_logs')
@Index(['method'])
@Index(['endpoint'])
@Index(['responseStatus'])
@Index(['createdAt'])
@Index(['userId'])
@Index(['appName'])
export class AuditTrailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_name', type: 'varchar', length: 100, default: 'merahputih-app', comment: 'Application identifier' })
  appName: string;

  @Column({ name: 'feature_name', type: 'varchar', length: 100, nullable: true, comment: 'Feature or module name' })
  featureName: string;

  @Column({ type: 'varchar', length: 10, comment: 'HTTP method (GET, POST, PUT, DELETE, etc.)' })
  method: string;

  @Column({ type: 'varchar', length: 500, comment: 'Full API URL that was called' })
  url: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: 'API endpoint path only' })
  endpoint: string;

  @Column({ name: 'request_data', type: 'jsonb', nullable: true, comment: 'Request body data sent to external API' })
  requestData: any;

  @Column({ name: 'request_params', type: 'jsonb', nullable: true, comment: 'Request parameters/headers sent' })
  requestParams: any;

  @Column({ name: 'response_status', type: 'int', nullable: true, comment: 'HTTP response status code' })
  responseStatus: number | null;

  @Column({ name: 'response_data', type: 'jsonb', nullable: true, comment: 'Response data from external API (truncated if large)' })
  responseData: any;

  @Column({ name: 'error_message', type: 'text', nullable: true, comment: 'Error message if request failed' })
  errorMessage: string | null;

  @Column({ name: 'execution_time_ms', type: 'int', nullable: true, comment: 'Request execution time in milliseconds' })
  executionTimeMs: number | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true, comment: 'User who initiated the request' })
  userId: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true, comment: 'Browser user agent string' })
  userAgent: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true, comment: 'Client IP address' })
  ipAddress: string | null;

  @Column({ name: 'session_id', type: 'varchar', length: 100, nullable: true, comment: 'User session identifier' })
  sessionId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}