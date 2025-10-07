import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

/**
 * Example Database Test Suite
 * Demonstrates how to write database tests using the framework
 */
test.describe('Users Database Tests', () => {
  const testTableName = 'users';

  test.beforeEach(async ({ dbClient }) => {
    // Setup: You might want to create test data here
    console.log('Setting up test data...');
  });

  test.afterEach(async ({ dbClient }) => {
    // Cleanup: Remove test data after each test
    console.log('Cleaning up test data...');
  });

  test('should insert a new user into database', async ({ dbClient }) => {
    // Generate test data
    const userData = {
      name: TestDataHelper.generateUsername(),
      email: TestDataHelper.generateEmail(),
      created_at: new Date(),
    };

    // Insert user
    const insertedId = await dbClient.insert(testTableName, userData);

    // Verify insertion
    expect(insertedId).toBeGreaterThan(0);

    // Query the inserted user
    const user = await dbClient.getOne(
      `SELECT * FROM ${testTableName} WHERE id = ?`,
      [insertedId]
    );

    expect(user).toBeTruthy();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);

    // Cleanup
    await dbClient.delete(testTableName, 'id = ?', [insertedId]);
  });

  test('should query users from database', async ({ dbClient }) => {
    // Query all users
    const users = await dbClient.query(`SELECT * FROM ${testTableName}`);

    // Verify query results
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  test('should update a user in database', async ({ dbClient }) => {
    // First, insert a test user
    const userData = {
      name: TestDataHelper.generateUsername(),
      email: TestDataHelper.generateEmail(),
      created_at: new Date(),
    };

    const insertedId = await dbClient.insert(testTableName, userData);

    // Update the user
    const newName = TestDataHelper.generateUsername('updated');
    const affectedRows = await dbClient.update(
      testTableName,
      { name: newName },
      'id = ?',
      [insertedId]
    );

    // Verify update
    expect(affectedRows).toBe(1);

    // Query updated user
    const updatedUser = await dbClient.getOne(
      `SELECT * FROM ${testTableName} WHERE id = ?`,
      [insertedId]
    );

    expect(updatedUser.name).toBe(newName);

    // Cleanup
    await dbClient.delete(testTableName, 'id = ?', [insertedId]);
  });

  test('should delete a user from database', async ({ dbClient }) => {
    // First, insert a test user
    const userData = {
      name: TestDataHelper.generateUsername(),
      email: TestDataHelper.generateEmail(),
      created_at: new Date(),
    };

    const insertedId = await dbClient.insert(testTableName, userData);

    // Delete the user
    const deletedRows = await dbClient.delete(testTableName, 'id = ?', [insertedId]);

    // Verify deletion
    expect(deletedRows).toBe(1);

    // Verify user no longer exists
    const deletedUser = await dbClient.getOne(
      `SELECT * FROM ${testTableName} WHERE id = ?`,
      [insertedId]
    );

    expect(deletedUser).toBeNull();
  });

  test('should handle database transactions', async ({ dbClient }) => {
    const userData1 = {
      name: TestDataHelper.generateUsername('txn1'),
      email: TestDataHelper.generateEmail('txn1'),
      created_at: new Date(),
    };

    const userData2 = {
      name: TestDataHelper.generateUsername('txn2'),
      email: TestDataHelper.generateEmail('txn2'),
      created_at: new Date(),
    };

    try {
      // Begin transaction
      await dbClient.beginTransaction();

      // Insert multiple users
      const id1 = await dbClient.insert(testTableName, userData1);
      const id2 = await dbClient.insert(testTableName, userData2);

      // Commit transaction
      await dbClient.commit();

      // Verify both users exist
      const user1 = await dbClient.getOne(
        `SELECT * FROM ${testTableName} WHERE id = ?`,
        [id1]
      );
      const user2 = await dbClient.getOne(
        `SELECT * FROM ${testTableName} WHERE id = ?`,
        [id2]
      );

      expect(user1).toBeTruthy();
      expect(user2).toBeTruthy();

      // Cleanup
      await dbClient.delete(testTableName, 'id IN (?, ?)', [id1, id2]);
    } catch (error) {
      // Rollback on error
      await dbClient.rollback();
      throw error;
    }
  });

  test('should rollback transaction on error', async ({ dbClient }) => {
    const userData = {
      name: TestDataHelper.generateUsername(),
      email: TestDataHelper.generateEmail(),
      created_at: new Date(),
    };

    let insertedId: number | null = null;

    try {
      // Begin transaction
      await dbClient.beginTransaction();

      // Insert user
      insertedId = await dbClient.insert(testTableName, userData);

      // Simulate an error by throwing
      throw new Error('Simulated error');

      // This should not be reached
      await dbClient.commit();
    } catch (error) {
      // Rollback transaction
      await dbClient.rollback();

      // Verify user was not committed
      if (insertedId) {
        const user = await dbClient.getOne(
          `SELECT * FROM ${testTableName} WHERE id = ?`,
          [insertedId]
        );
        expect(user).toBeNull();
      }
    }
  });
});
