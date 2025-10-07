import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApiClient } from '../utils/ApiClient';
import { DatabaseClient } from '../utils/DatabaseClient';

/**
 * Custom fixtures that extend Playwright's base test
 * Provides commonly used objects across tests
 */
type CustomFixtures = {
  loginPage: LoginPage;
  apiClient: ApiClient;
  dbClient: DatabaseClient;
};

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  // Login Page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // API Client fixture
  apiClient: async ({}, use) => {
    const apiClient = new ApiClient();
    await apiClient.init();
    await use(apiClient);
    await apiClient.dispose();
  },

  // Database Client fixture
  dbClient: async ({}, use) => {
    const dbClient = new DatabaseClient();
    await dbClient.connect();
    await use(dbClient);
    await dbClient.disconnect();
  },
});

export { expect } from '@playwright/test';
