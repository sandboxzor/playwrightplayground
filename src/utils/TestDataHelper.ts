/**
 * Test Data Helper
 * Provides utility methods for generating test data
 */
export class TestDataHelper {
  /**
   * Generate a random email address
   */
  static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@example.com`;
  }

  /**
   * Generate a random username
   */
  static generateUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  /**
   * Generate a random password
   */
  static generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate a random string
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a random number within a range
   */
  static generateRandomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random phone number
   */
  static generatePhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const firstPart = this.generateRandomNumber(200, 999);
    const secondPart = this.generateRandomNumber(1000, 9999);
    return `+1-${areaCode}-${firstPart}-${secondPart}`;
  }

  /**
   * Get current timestamp
   */
  static getTimestamp(): number {
    return Date.now();
  }

  /**
   * Format date to ISO string
   */
  static formatDate(date: Date = new Date()): string {
    return date.toISOString();
  }

  /**
   * Wait for a specified time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}
