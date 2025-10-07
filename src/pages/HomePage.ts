import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Example page object for the application home page
 */
export class HomePage extends BasePage {
  // Define locators for home page elements
  private readonly headerTitle = this.page.locator('h1.header-title');
  private readonly navigationMenu = this.page.locator('nav.main-menu');
  private readonly loginLink = this.page.locator('a[href="/login"]');
  private readonly searchInput = this.page.locator('input[type="search"]');
  private readonly searchButton = this.page.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Get header title text
   */
  async getHeaderTitle(): Promise<string | null> {
    return await this.getText(this.headerTitle);
  }

  /**
   * Click on login link
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginLink);
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isVisible(this.navigationMenu);
  }

  /**
   * Perform search
   */
  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
  }

  /**
   * Check if user is logged in
   * (Example - adjust based on your application)
   */
  async isLoggedIn(): Promise<boolean> {
    const loginLink = this.page.locator('a[href="/login"]');
    const isLoginVisible = await loginLink.isVisible();
    return !isLoginVisible;
  }
}
