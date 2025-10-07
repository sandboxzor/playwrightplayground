import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Example Login Page Object
 * Demonstrates how to create page objects for your application
 */
export class LoginPage extends BasePage {
  // Define locators
  private readonly usernameInput = this.page.locator('#username');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('button[type="submit"]');
  private readonly errorMessage = this.page.locator('.error-message');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  /**
   * Perform login action
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
