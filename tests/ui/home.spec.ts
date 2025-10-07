import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

/**
 * Home Page Test Suite
 * Example tests for the home page
 */
test.describe('Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should load home page successfully', async ({ page }) => {
    // Verify page loads
    await homePage.waitForPageLoad();

    // Verify we're on the home page
    const url = await homePage.getCurrentURL();
    expect(url).toContain('/');
  });

  test('should display header title', async () => {
    // Get header title
    const title = await homePage.getHeaderTitle();

    // Verify title exists
    expect(title).toBeTruthy();
  });

  test('should display navigation menu', async () => {
    // Check if navigation is visible
    const isNavVisible = await homePage.isNavigationVisible();

    // Verify navigation is displayed
    expect(isNavVisible).toBeTruthy();
  });

  test('should navigate to login page', async () => {
    // Click on login link
    await homePage.clickLogin();

    // Wait for navigation
    await homePage.waitForPageLoad();

    // Verify navigation to login page
    const url = await homePage.getCurrentURL();
    expect(url).toContain('/login');
  });

  test('should perform search', async () => {
    const searchQuery = 'test query';

    // Perform search
    await homePage.search(searchQuery);

    // Wait for search results page
    await homePage.waitForPageLoad();

    // Verify we navigated away from home page
    const url = await homePage.getCurrentURL();
    expect(url).not.toBe('/');
  });

  test('should take screenshot', async () => {
    // Take a screenshot of the home page
    await homePage.takeScreenshot('home-page');

    // Test passes if no error occurs
    expect(true).toBeTruthy();
  });
});
