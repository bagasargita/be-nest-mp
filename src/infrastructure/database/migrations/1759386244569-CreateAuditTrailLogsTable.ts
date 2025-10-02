import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditTrailLogsTable1759386244569 implements MigrationInterface {
    name = 'CreateAuditTrailLogsTable1759386244569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "m_audit_trail_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "app_name" character varying(100) NOT NULL DEFAULT 'merahputih-app', "feature_name" character varying(100), "method" character varying(10) NOT NULL, "url" character varying(500) NOT NULL, "endpoint" character varying(300), "request_data" jsonb, "request_params" jsonb, "response_status" integer, "response_data" jsonb, "error_message" text, "execution_time_ms" integer, "user_id" uuid, "user_agent" character varying(500), "ip_address" character varying(45), "session_id" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3256305d715f1a21c17dc651004" PRIMARY KEY ("id")); COMMENT ON COLUMN "m_audit_trail_logs"."app_name" IS 'Application identifier'; COMMENT ON COLUMN "m_audit_trail_logs"."feature_name" IS 'Feature or module name'; COMMENT ON COLUMN "m_audit_trail_logs"."method" IS 'HTTP method (GET, POST, PUT, DELETE, etc.)'; COMMENT ON COLUMN "m_audit_trail_logs"."url" IS 'Full API URL that was called'; COMMENT ON COLUMN "m_audit_trail_logs"."endpoint" IS 'API endpoint path only'; COMMENT ON COLUMN "m_audit_trail_logs"."request_data" IS 'Request body data sent to external API'; COMMENT ON COLUMN "m_audit_trail_logs"."request_params" IS 'Request parameters/headers sent'; COMMENT ON COLUMN "m_audit_trail_logs"."response_status" IS 'HTTP response status code'; COMMENT ON COLUMN "m_audit_trail_logs"."response_data" IS 'Response data from external API (truncated if large)'; COMMENT ON COLUMN "m_audit_trail_logs"."error_message" IS 'Error message if request failed'; COMMENT ON COLUMN "m_audit_trail_logs"."execution_time_ms" IS 'Request execution time in milliseconds'; COMMENT ON COLUMN "m_audit_trail_logs"."user_id" IS 'User who initiated the request'; COMMENT ON COLUMN "m_audit_trail_logs"."user_agent" IS 'Browser user agent string'; COMMENT ON COLUMN "m_audit_trail_logs"."ip_address" IS 'Client IP address'; COMMENT ON COLUMN "m_audit_trail_logs"."session_id" IS 'User session identifier'`);
        await queryRunner.query(`CREATE INDEX "IDX_b5ba2ac9189100a2f536c4cf8c" ON "m_audit_trail_logs" ("app_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_52731198f7a9fb8b7016332dc5" ON "m_audit_trail_logs" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7b5e14c29a628faea9ae71c9f" ON "m_audit_trail_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_30cba62f297dfd492691bb49cb" ON "m_audit_trail_logs" ("response_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_adbb7c8586afa77320ac53e8a4" ON "m_audit_trail_logs" ("endpoint") `);
        await queryRunner.query(`CREATE INDEX "IDX_d680bba1b0b1dde2e135b53a59" ON "m_audit_trail_logs" ("method") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d680bba1b0b1dde2e135b53a59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adbb7c8586afa77320ac53e8a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30cba62f297dfd492691bb49cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7b5e14c29a628faea9ae71c9f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52731198f7a9fb8b7016332dc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5ba2ac9189100a2f536c4cf8c"`);
        await queryRunner.query(`DROP TABLE "m_audit_trail_logs"`);
    }

}
