import { APIRequestContext, request } from '@playwright/test';

/**
 * API Client for making HTTP requests
 * Provides common methods for API testing
 */
export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL: string = process.env.API_BASE_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  /**
   * Initialize the API context
   */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Close the API context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
    }
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: any) {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    return await this.context.get(endpoint, options);
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: any) {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    return await this.context.post(endpoint, {
      data,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: any) {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    return await this.context.put(endpoint, {
      data,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options?: any) {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    return await this.context.patch(endpoint, {
      data,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: any) {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    return await this.context.delete(endpoint, options);
  }

  /**
   * Set authentication token
   */
  async setAuthToken(token: string): Promise<void> {
    if (!this.context) {
      throw new Error('API context not initialized. Call init() first.');
    }
    // Update context with auth header
    await this.context.dispose();
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}
