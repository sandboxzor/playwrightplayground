import { test, expect } from '../../src/fixtures/fixtures';

/**
 * Example UI Test Suite
 * Demonstrates how to write UI tests using the framework
 */
test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display login page', async ({ page, loginPage }) => {
    // Verify page title
    const title = await loginPage.getTitle();
    expect(title).toContain('Login');

    // Verify URL
    const url = await loginPage.getCurrentURL();
    expect(url).toContain('/login');
  });

  test('should login with valid credentials', async ({ loginPage }) => {
    // Perform login
    await loginPage.login('testuser', 'testpassword');

    // Wait for navigation after login
    await loginPage.waitForPageLoad();

    // Verify successful login (example - adjust based on your app)
    const url = await loginPage.getCurrentURL();
    expect(url).not.toContain('/login');
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    // Attempt login with invalid credentials
    await loginPage.login('invalid', 'invalid');

    // Verify error message is displayed
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    // Verify error message content
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should not login with empty credentials', async ({ loginPage, page }) => {
    // Try to login with empty fields
    await loginPage.login('', '');

    // Verify we're still on login page
    const url = await loginPage.getCurrentURL();
    expect(url).toContain('/login');
  });
});
