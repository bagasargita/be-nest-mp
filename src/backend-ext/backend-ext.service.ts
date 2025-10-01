import { Injectable, Logger, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BackendExt } from './entities/backend-ext.entity';
import { BackendExtLog } from './entities/backend-ext-log.entity';
import { CreateBackendExtDto } from './dto/create-backend-ext.dto';
import { UpdateBackendExtDto } from './dto/update-backend-ext.dto';
import { OAuthTokenRequestDto, OAuthTokenResponseDto, ExternalApiRequestDto } from './dto/oauth-token.dto';

@Injectable()
export class BackendExtService {
  private readonly logger = new Logger(BackendExtService.name);
  private tokenCache = new Map<string, OAuthTokenResponseDto>();

  constructor(
    @InjectRepository(BackendExt)
    private readonly backendExtRepository: Repository<BackendExt>,
    @InjectRepository(BackendExtLog)
    private readonly backendExtLogRepository: Repository<BackendExtLog>,
    private readonly httpService: HttpService,
  ) {}

  // Logging Operations
  /**
   * Log external API transaction - ALWAYS creates a NEW record
   * This ensures complete audit trail and change tracking capability
   * Never updates existing logs to maintain data integrity
   */
  private async logTransaction(params: {
    configId: string;
    method: string;
    endpoint: string;
    requestBody?: any;
    requestHeaders?: any;
    responseStatus?: number;
    responseBody?: any;
    responseHeaders?: any;
    executionTimeMs?: number;
    errorMessage?: string;
    userId?: string;
    accountId?: string;
  }): Promise<BackendExtLog | null> {
    try {
      // Always create NEW log entry - never update existing ones
      // This preserves complete audit trail for all API interactions
      const log = this.backendExtLogRepository.create({
        configId: params.configId,
        method: params.method.toUpperCase(),
        endpoint: params.endpoint,
        requestBody: params.requestBody,
        requestHeaders: params.requestHeaders,
        responseStatus: params.responseStatus,
        responseBody: params.responseBody,
        responseHeaders: params.responseHeaders,
        executionTimeMs: params.executionTimeMs,
        errorMessage: params.errorMessage,
        userId: params.userId,
        accountId: params.accountId,
      });

      const savedLog = await this.backendExtLogRepository.save(log);
      this.logger.debug(`📝 API transaction logged with ID: ${savedLog.id}`);
      
      return savedLog;
    } catch (error) {
      this.logger.error(`❌ Failed to log transaction: ${error.message}`);
      // Don't throw error to avoid breaking the main flow
      return null;
    }
  }

  // Get logs for a specific config with audit trail capabilities
  async getTransactionLogs(configId: string, options?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    status?: number;
    endpoint?: string;
    method?: string;
    userId?: string;
    accountId?: string;
  }): Promise<{ logs: BackendExtLog[]; total: number }> {
    try {
      const queryBuilder = this.backendExtLogRepository
        .createQueryBuilder('log')
        .where('log.configId = :configId', { configId })
        .orderBy('log.createdAt', 'DESC'); // Latest first for audit trail

      if (options?.startDate) {
        queryBuilder.andWhere('log.createdAt >= :startDate', { startDate: options.startDate });
      }

      if (options?.endDate) {
        queryBuilder.andWhere('log.createdAt <= :endDate', { endDate: options.endDate });
      }

      if (options?.status) {
        queryBuilder.andWhere('log.responseStatus = :status', { status: options.status });
      }

      if (options?.endpoint) {
        queryBuilder.andWhere('log.endpoint ILIKE :endpoint', { endpoint: `%${options.endpoint}%` });
      }

      if (options?.method) {
        queryBuilder.andWhere('log.method = :method', { method: options.method.toUpperCase() });
      }

      if (options?.userId) {
        queryBuilder.andWhere('log.userId = :userId', { userId: options.userId });
      }

      if (options?.accountId) {
        queryBuilder.andWhere('log.accountId = :accountId', { accountId: options.accountId });
      }

      const total = await queryBuilder.getCount();

      if (options?.limit) {
        queryBuilder.limit(options.limit);
      }

      if (options?.offset) {
        queryBuilder.offset(options.offset);
      }

      const logs = await queryBuilder.getMany();
      
      this.logger.debug(`📊 Retrieved ${logs.length} of ${total} transaction logs for config ${configId}`);

      return { logs, total };
    } catch (error) {
      this.logger.error(`❌ Failed to fetch transaction logs: ${error.message}`);
      throw new HttpException(
        'Failed to fetch transaction logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all logs for a specific endpoint/method combination
   * Useful for tracking changes and patterns in API usage
   */
  async getEndpointHistory(configId: string, endpoint: string, method: string, limit: number = 50): Promise<BackendExtLog[]> {
    try {
      const logs = await this.backendExtLogRepository.find({
        where: {
          configId,
          endpoint,
          method: method.toUpperCase(),
        },
        order: {
          createdAt: 'DESC',
        },
        take: limit,
      });

      this.logger.debug(`📈 Retrieved ${logs.length} history records for ${method} ${endpoint}`);
      return logs;
    } catch (error) {
      this.logger.error(`❌ Failed to fetch endpoint history: ${error.message}`);
      return [];
    }
  }

  // Configuration CRUD Operations
  async create(createBackendExtDto: CreateBackendExtDto): Promise<BackendExt> {
    try {
      const backendExt = this.backendExtRepository.create(createBackendExtDto);
      const savedConfig = await this.backendExtRepository.save(backendExt);
      
      this.logger.log(`✅ Created backend ext configuration: ${savedConfig.name}`);
      return savedConfig;
    } catch (error) {
      this.logger.error(`❌ Failed to create backend ext configuration: ${error.message}`);
      throw new HttpException(
        'Failed to create backend ext configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<BackendExt[]> {
    try {
      return await this.backendExtRepository.find({
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`❌ Failed to fetch backend ext configurations: ${error.message}`);
      throw new HttpException(
        'Failed to fetch backend ext configurations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<BackendExt> {
    try {
      const config = await this.backendExtRepository.findOne({
        where: { id },
      });

      if (!config) {
        throw new NotFoundException(`Backend ext configuration with ID ${id} not found`);
      }

      return config;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`❌ Failed to fetch backend ext configuration: ${error.message}`);
      throw new HttpException(
        'Failed to fetch backend ext configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateBackendExtDto: UpdateBackendExtDto): Promise<BackendExt> {
    try {
      const config = await this.findOne(id);
      
      Object.assign(config, updateBackendExtDto);
      const updatedConfig = await this.backendExtRepository.save(config);
      
      // Clear token cache for this config when updated
      this.clearTokenCacheForConfig(id);
      
      this.logger.log(`✅ Updated backend ext configuration: ${updatedConfig.name}`);
      return updatedConfig;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`❌ Failed to update backend ext configuration: ${error.message}`);
      throw new HttpException(
        'Failed to update backend ext configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const config = await this.findOne(id);
      await this.backendExtRepository.remove(config);
      
      // Clear token cache for this config when removed
      this.clearTokenCacheForConfig(id);
      
      this.logger.log(`✅ Removed backend ext configuration: ${config.name}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`❌ Failed to remove backend ext configuration: ${error.message}`);
      throw new HttpException(
        'Failed to remove backend ext configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // OAuth Token Operations
  async getOAuthToken(tokenRequest: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    try {
      this.logger.log(`🔐 Requesting OAuth token for config: ${tokenRequest.config_id}`);

      // Get configuration
      const config = await this.findOne(tokenRequest.config_id);
      
      if (!config.is_active) {
        throw new HttpException(
          'Backend configuration is not active',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create Base64 encoded authorization header
      const credentials = `${config.client_id}:${config.client_secret}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');

      // Use token_url if provided, otherwise fallback to base_url/oauth/token
      const tokenUrl = config.token_url || `${config.base_url}/oauth/token`;

      // Prepare request payload
      const payload = {
        scope: tokenRequest.scope || config.default_scope || 'customer.internal.read customer.internal.create',
      };

      // Prepare headers
      const headers = {
        'authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        ...config.additional_headers,
      };

      // Make OAuth request
      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, payload, { headers }),
      );

      const tokenData: OAuthTokenResponseDto = response.data;

      // Add expiry timestamp for cache management
      if (tokenData.expires_in) {
        tokenData.expires_at = Date.now() + (tokenData.expires_in * 1000);
      }

      // Cache token with config_id as key
      const cacheKey = `${tokenRequest.config_id}:${tokenRequest.scope || config.default_scope || 'default'}`;
      this.tokenCache.set(cacheKey, tokenData);

      this.logger.log(`✅ OAuth token obtained successfully for config: ${tokenRequest.config_id}`);
      
      return tokenData;

    } catch (error) {
      this.logger.error(`❌ Failed to get OAuth token: ${error.message}`, error.stack);
      
      if (error.response) {
        throw new HttpException(
          {
            message: 'Failed to obtain OAuth token',
            error: error.response.data,
            statusCode: error.response.status,
          },
          error.response.status,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to obtain OAuth token',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getValidToken(configId: string, scope?: string): Promise<string> {
    const config = await this.findOne(configId);
    const cacheKey = `${configId}:${scope || config.default_scope || 'default'}`;
    const cachedToken = this.tokenCache.get(cacheKey);

    // Check if token exists and is not expired
    if (cachedToken && cachedToken.expires_at && cachedToken.expires_at > Date.now()) {
      this.logger.log(`🔄 Using cached token for config: ${configId}`);
      return cachedToken.access_token;
    }

    // Request new token
    this.logger.log(`🆕 Requesting new token for config: ${configId}`);
    const tokenRequest: OAuthTokenRequestDto = { config_id: configId, scope };
    const newToken = await this.getOAuthToken(tokenRequest);
    return newToken.access_token;
  }

  // External API Request Operations
  async makeAuthenticatedRequest(apiRequest: ExternalApiRequestDto, userId?: string, accountId?: string): Promise<any> {
    const startTime = Date.now();
    let responseStatus: number | undefined;
    let responseData: any;
    let responseHeaders: any;
    let errorMessage: string | undefined;

    try {
      this.logger.log(`🌐 Making ${apiRequest.method} request to: ${apiRequest.url} for config: ${apiRequest.config_id}`);

      // Get configuration
      const config = await this.findOne(apiRequest.config_id);
      
      if (!config.is_active) {
        throw new HttpException(
          'Backend configuration is not active',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get valid access token
      const accessToken = await this.getValidToken(apiRequest.config_id, apiRequest.scope);

      const fullUrl = apiRequest.url.startsWith('http') 
        ? apiRequest.url 
        : `${config.base_url}${apiRequest.url}`;

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...config.additional_headers,
        ...apiRequest.headers,
      };

      // Make API request based on method
      let response;
      
      switch (apiRequest.method.toUpperCase()) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(fullUrl, {
              headers,
              params: apiRequest.params,
            }),
          );
          break;

        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(fullUrl, apiRequest.data, {
              headers,
              params: apiRequest.params,
            }),
          );
          break;

        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(fullUrl, apiRequest.data, {
              headers,
              params: apiRequest.params,
            }),
          );
          break;

        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(fullUrl, {
              headers,
              params: apiRequest.params,
            }),
          );
          break;

        case 'PATCH':
          response = await firstValueFrom(
            this.httpService.patch(fullUrl, apiRequest.data, {
              headers,
              params: apiRequest.params,
            }),
          );
          break;

        default:
          throw new HttpException(
            `Unsupported HTTP method: ${apiRequest.method}`,
            HttpStatus.BAD_REQUEST,
          );
      }

      responseStatus = response.status;
      responseData = response.data;
      responseHeaders = response.headers;
      
      this.logger.log(`✅ API request successful: ${apiRequest.method} ${apiRequest.url}`);
      
      // Log successful transaction - ALWAYS creates new record for audit trail
      const logResult = await this.logTransaction({
        configId: apiRequest.config_id,
        method: apiRequest.method,
        endpoint: apiRequest.url,
        requestBody: apiRequest.data,
        requestHeaders: headers,
        responseStatus,
        responseBody: responseData,
        responseHeaders,
        executionTimeMs: Date.now() - startTime,
        userId,
        accountId,
      });
      
      if (logResult) {
        this.logger.debug(`📝 Transaction logged successfully with ID: ${logResult.id}`);
      }
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers,
      };

    } catch (error) {
      this.logger.error(`❌ API request failed: ${error.message}`, error.stack);

      // Capture error details for logging
      if (error.response) {
        responseStatus = error.response.status;
        responseData = error.response.data;
        responseHeaders = error.response.headers;
      }
      errorMessage = error.message;

      // Log failed transaction - ALWAYS creates new record for audit trail
      const logResult = await this.logTransaction({
        configId: apiRequest.config_id,
        method: apiRequest.method,
        endpoint: apiRequest.url,
        requestBody: apiRequest.data,
        requestHeaders: apiRequest.headers,
        responseStatus,
        responseBody: responseData,
        responseHeaders,
        executionTimeMs: Date.now() - startTime,
        errorMessage,
        userId,
        accountId,
      });
      
      if (logResult) {
        this.logger.debug(`📝 Failed transaction logged with ID: ${logResult.id}`);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      if (error.response) {
        return {
          success: false,
          error: {
            message: error.message,
            status: error.response.status,
            data: error.response.data,
          },
        };
      }

      throw new HttpException(
        {
          message: 'External API request failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Cache Management
  clearTokenCacheForConfig(configId: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.tokenCache.keys()) {
      if (key.startsWith(`${configId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.tokenCache.delete(key));
    this.logger.log(`🗑️ Token cache cleared for config: ${configId}`);
  }

  clearAllTokenCache(): void {
    this.tokenCache.clear();
    this.logger.log(`🗑️ All token cache cleared`);
  }

  getCacheStatus(): Array<{ configId: string; scope: string; expiresAt: number; isExpired: boolean }> {
    const status: Array<{ configId: string; scope: string; expiresAt: number; isExpired: boolean }> = [];
    
    for (const [key, token] of this.tokenCache.entries()) {
      const [configId, scope] = key.split(':');
      status.push({
        configId,
        scope: scope || 'default',
        expiresAt: token.expires_at || 0,
        isExpired: token.expires_at ? token.expires_at <= Date.now() : true,
      });
    }

    return status;
  }

  async getActiveConfigs(): Promise<BackendExt[]> {
    try {
      return await this.backendExtRepository.find({
        where: { is_active: true },
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`❌ Failed to fetch active backend ext configurations: ${error.message}`);
      throw new HttpException(
        'Failed to fetch active backend ext configurations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Simplified API Request - menggunakan config method dan url sebagai default
  async makeSimplifiedApiRequest(request: {
    config_id: string;
    data?: any;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    scope?: string;
    method?: string;
    url?: string;
    user_id?: string;
    account_id?: string;
  }): Promise<any> {
    const startTime = Date.now();
    let responseStatus: number | undefined;
    let responseData: any;
    let responseHeaders: any;
    let errorMessage: string | undefined;

    try {
      // Get configuration
      const config = await this.findOne(request.config_id);
      
      // Use method and url from config as default, allow override
      const method = (request.method || config.method || 'GET').toUpperCase();
      const url = request.url || config.url;
      
      if (!url) {
        throw new HttpException(
          'URL is required either in config or request parameter',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get OAuth token (with cache or fresh)
      const scope = request.scope || config.default_scope;
      const token = await this.getOrRefreshToken(config, scope);

      // Prepare full URL
      const fullUrl = `${config.base_url}${url}`;

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
        ...config.additional_headers,
        ...request.headers,
      };

      this.logger.log(`🌐 Making ${method} request to: ${url} for config: ${request.config_id}`);

      // Make API request based on method
      let response;
      const axiosConfig = {
        headers,
        params: request.params,
      };

      switch (method) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(fullUrl, axiosConfig),
          );
          break;
        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(fullUrl, request.data, axiosConfig),
          );
          break;
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(fullUrl, request.data, axiosConfig),
          );
          break;
        case 'PATCH':
          response = await firstValueFrom(
            this.httpService.patch(fullUrl, request.data, axiosConfig),
          );
          break;
        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(fullUrl, axiosConfig),
          );
          break;
        default:
          throw new HttpException(
            `Unsupported HTTP method: ${method}`,
            HttpStatus.BAD_REQUEST,
          );
      }

      responseStatus = response.status;
      responseData = response.data;
      responseHeaders = response.headers;

      this.logger.log(`✅ API request successful for config: ${request.config_id}`);
      
      // Log successful transaction
      await this.logTransaction({
        configId: request.config_id,
        method: method,
        endpoint: url,
        requestBody: request.data,
        requestHeaders: headers,
        responseStatus,
        responseBody: responseData,
        responseHeaders,
        executionTimeMs: Date.now() - startTime,
        userId: request.user_id,
        accountId: request.account_id,
      });

      return response.data;

    } catch (error) {
      this.logger.error(`❌ API request failed: ${error.message}`, error.stack);
      
      // Capture error details for logging
      if (error.response) {
        responseStatus = error.response.status;
        responseData = error.response.data;
        responseHeaders = error.response.headers;
      }
      errorMessage = error.message;

      // Log failed transaction
      await this.logTransaction({
        configId: request.config_id,
        method: request.method || 'GET',
        endpoint: request.url || '',
        requestBody: request.data,
        requestHeaders: request.headers,
        responseStatus,
        responseBody: responseData,
        responseHeaders,
        executionTimeMs: Date.now() - startTime,
        errorMessage,
        userId: request.user_id,
        accountId: request.account_id,
      });
      
      if (error.response) {
        // Return structured error response
        return {
          success: false,
          error: {
            message: error.message,
            status: error.response.status,
            data: error.response.data,
          },
        };
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'API request failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method untuk get or refresh token dengan cache
  private async getOrRefreshToken(config: BackendExt, scope?: string): Promise<OAuthTokenResponseDto> {
    const cacheKey = `${config.id}:${scope || 'default'}`;
    const cachedToken = this.tokenCache.get(cacheKey);

    // Check if cached token is still valid
    if (cachedToken && cachedToken.expires_at && cachedToken.expires_at > Date.now()) {
      this.logger.log(`🔄 Using cached token for config: ${config.id}`);
      return cachedToken;
    }

    // Get fresh token
    this.logger.log(`🔑 Getting fresh token for config: ${config.id}`);
    const tokenRequest: OAuthTokenRequestDto = {
      config_id: config.id,
      grant_type: 'client_credentials',
      scope: scope || config.default_scope,
    };

    return await this.getOAuthToken(tokenRequest);
  }

  // Simple createLog method for direct API calls from frontend
  async createLog(logData: any): Promise<BackendExtLog> {
    try {
      const log = new BackendExtLog();
      log.configId = logData.config_id || 'direct-api-call';
      log.method = logData.request_method || 'GET';
      log.endpoint = logData.request_url || '';
      
      // Safely parse JSON strings
      try {
        log.requestBody = logData.request_data ? JSON.parse(logData.request_data) : null;
      } catch {
        log.requestBody = logData.request_data;
      }
      
      try {
        log.requestHeaders = logData.request_params ? JSON.parse(logData.request_params) : null;
      } catch {
        log.requestHeaders = logData.request_params;
      }
      
      try {
        log.responseBody = logData.response_data ? JSON.parse(logData.response_data) : null;
      } catch {
        log.responseBody = logData.response_data;
      }
      
      if (logData.response_status) {
        log.responseStatus = logData.response_status;
      }
      
      if (logData.execution_time) {
        log.executionTimeMs = Math.floor(Date.now() - logData.execution_time);
      }
      
      if (logData.error_message) {
        log.errorMessage = logData.error_message;
      }

      return await this.backendExtLogRepository.save(log);
    } catch (error) {
      this.logger.error('Failed to create log entry:', error);
      throw error;
    }
  }
}