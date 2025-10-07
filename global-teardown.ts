import { FullConfig } from '@playwright/test';

/**
 * Global Teardown
 * Runs once after all tests
 * Use for tasks like:
 * - Stopping test servers
 * - Cleaning up test data
 * - Closing database connections
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  // Example: Clean up authentication state
  // Uncomment and modify as needed
  /*
  const fs = require('fs');
  if (fs.existsSync('auth-state.json')) {
    fs.unlinkSync('auth-state.json');
  }
  */

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
