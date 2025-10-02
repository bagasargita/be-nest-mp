import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BackendExtService } from './backend-ext.service';

/**
 * Secure Audit Trail Controller
 * Uses service token authentication with rate limiting for audit logging
 */
@ApiTags('Audit Trail (Secured)')
@Controller('audit')
export class AuditTrailController {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly MAX_REQUESTS_PER_MINUTE = 100; // Max 100 audit logs per minute per IP

  constructor(private readonly backendExtService: BackendExtService) {}

  private checkRateLimit(clientIp: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    const clientData = this.requestCounts.get(clientIp);
    
    if (!clientData || clientData.resetTime < windowStart) {
      // Reset counter for new window
      this.requestCounts.set(clientIp, { count: 1, resetTime: now });
      return true;
    }

    if (clientData.count >= this.MAX_REQUESTS_PER_MINUTE) {
      return false; // Rate limit exceeded
    }

    // Increment counter
    clientData.count++;
    return true;
  }

  @Post('logs')
  @ApiOperation({ 
    summary: 'Create Audit Log Entry',
    description: 'Log external API calls for audit trail - Requires service token authentication with rate limiting. Used by frontend machineApi.js for tracking external API interactions.'
  })
  @ApiHeader({
    name: 'X-Service-Token',
    description: 'Service token untuk audit logging',
    required: true
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Audit log created successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or missing service token'
  })
  @ApiResponse({ 
    status: 429, 
    description: 'Rate limit exceeded'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid request data'
  })
  async createAuditLog(
    @Request() req: any,
    @Headers('x-service-token') serviceToken: string,
    @Body() logData: {
      request_method: string;
      request_url: string;
      request_data?: string;
      request_params?: string;
      response_status?: number;
      response_data?: string;
      error_message?: string;
      execution_time?: number;
      created_at?: string;
    }
  ) {
    try {
      // Rate limiting check
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      if (!this.checkRateLimit(clientIp)) {
        throw new BadRequestException('Rate limit exceeded. Maximum 100 requests per minute.');
      }

      // Validate service token
      const validServiceToken = process.env.AUDIT_SERVICE_TOKEN || 'audit-service-2024-secure-token-merahputih';
      console.log('🔐 Service token validation:', {
        received: serviceToken,
        expected: validServiceToken,
        envToken: process.env.AUDIT_SERVICE_TOKEN,
        match: serviceToken === validServiceToken
      });
      
      if (!serviceToken || serviceToken !== validServiceToken) {
        throw new UnauthorizedException('Invalid or missing service token');
      }

      // Validate required fields
      if (!logData.request_method || !logData.request_url) {
        throw new BadRequestException('request_method and request_url are required');
      }

      // Validate method
      const allowedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
      if (!allowedMethods.includes(logData.request_method.toUpperCase())) {
        throw new BadRequestException('Only POST, PUT, PATCH, DELETE methods are allowed for audit logging');
      }

      // Create audit log entry
      const logEntry = {
        config_id: 'audit-trail', // Special identifier for audit trail logs
        request_method: logData.request_method.toUpperCase(),
        request_url: logData.request_url,
        request_data: logData.request_data,
        request_params: logData.request_params,
        response_status: logData.response_status,
        response_data: logData.response_data?.substring(0, 2000), // Limit response data size
        error_message: logData.error_message,
        execution_time: logData.execution_time || Date.now(),
        created_at: logData.created_at ? new Date(logData.created_at) : new Date(),
      };

      const savedLog = await this.backendExtService.createLog(logEntry);
      
      return {
        success: true,
        data: {
          id: savedLog.id,
          created_at: savedLog.createdAt
        },
        message: 'Audit log created successfully'
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Failed to create audit log:', error);
      throw new BadRequestException(error.message || 'Failed to create audit log');
    }
  }
}