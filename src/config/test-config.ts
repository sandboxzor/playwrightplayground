/**
 * Test Configuration
 * Centralized configuration for test settings
 */
export const TestConfig = {
  // Timeout settings
  timeout: {
    default: 30000,
    navigation: 30000,
    api: 10000,
    database: 5000,
  },

  // Base URLs
  urls: {
    base: process.env.BASE_URL || 'http://localhost:3000',
    api: process.env.API_BASE_URL || 'http://localhost:3000/api',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'testdb',
  },

  // Browser settings
  browser: {
    headless: process.env.HEADLESS === 'true',
    slowMo: 0,
  },

  // Test users (for testing purposes)
  users: {
    admin: {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
    },
    standard: {
      username: 'user',
      password: 'user123',
      email: 'user@example.com',
    },
  },
};
