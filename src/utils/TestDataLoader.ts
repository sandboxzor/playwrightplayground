import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Loader
 * Utility for loading test data from JSON files
 */
export class TestDataLoader {
  private static readonly TEST_DATA_DIR = path.join(__dirname, '../../test-data');

  /**
   * Load JSON data from a file
   */
  private static loadJson<T>(filename: string): T {
    const filePath = path.join(this.TEST_DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  }

  /**
   * Load user test data
   */
  static loadUsers(): UserTestData {
    return this.loadJson<UserTestData>('users.json');
  }

  /**
   * Get a specific test user by index
   */
  static getTestUser(index: number = 0): User {
    const users = this.loadUsers();
    return users.testUsers[index];
  }

  /**
   * Get admin test user
   */
  static getAdminUser(): User {
    const users = this.loadUsers();
    return users.testUsers.find(user => user.role === 'admin') || users.testUsers[0];
  }

  /**
   * Get an invalid test user
   */
  static getInvalidUser(index: number = 0): InvalidUser {
    const users = this.loadUsers();
    return users.invalidUsers[index];
  }

  /**
   * Load custom test data file
   */
  static loadCustomData<T>(filename: string): T {
    return this.loadJson<T>(filename);
  }
}

// Type definitions for test data
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface InvalidUser {
  username: string;
  email: string;
  password: string;
}

interface UserTestData {
  testUsers: User[];
  invalidUsers: InvalidUser[];
}
