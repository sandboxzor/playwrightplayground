import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup
 * Runs once before all tests
 * Use for tasks like:
 * - Starting test servers
 * - Seeding databases
 * - Authentication state preparation
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Example: Pre-authenticate and save state
  // Uncomment and modify as needed
  /*
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(process.env.BASE_URL || 'http://localhost:3000');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  
  // Save authenticated state
  await page.context().storageState({ path: 'auth-state.json' });
  await browser.close();
  */

  console.log('✅ Global setup completed');
}

export default globalSetup;
