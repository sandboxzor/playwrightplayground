import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

/**
 * Example API Test Suite
 * Demonstrates how to write API tests using the framework
 */
test.describe('Users API Tests', () => {
  test('should get list of users', async ({ apiClient }) => {
    // Make GET request
    const response = await apiClient.get('/users');

    // Verify response status
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Verify response body
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('should get a single user by ID', async ({ apiClient }) => {
    const userId = 1;

    // Make GET request for specific user
    const response = await apiClient.get(`/users/${userId}`);

    // Verify response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Verify user data structure
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
  });

  test('should create a new user', async ({ apiClient }) => {
    // Generate test data
    const userData = {
      name: TestDataHelper.generateUsername(),
      email: TestDataHelper.generateEmail(),
      password: TestDataHelper.generatePassword(),
    };

    // Make POST request
    const response = await apiClient.post('/users', userData);

    // Verify response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    // Verify created user data
    const createdUser = await response.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.email).toBe(userData.email);
  });

  test('should update an existing user', async ({ apiClient }) => {
    const userId = 1;
    const updateData = {
      name: TestDataHelper.generateUsername(),
    };

    // Make PUT request
    const response = await apiClient.put(`/users/${userId}`, updateData);

    // Verify response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Verify updated data
    const updatedUser = await response.json();
    expect(updatedUser.name).toBe(updateData.name);
  });

  test('should delete a user', async ({ apiClient }) => {
    const userId = 1;

    // Make DELETE request
    const response = await apiClient.delete(`/users/${userId}`);

    // Verify response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);
  });

  test('should return 404 for non-existent user', async ({ apiClient }) => {
    const nonExistentUserId = 99999;

    // Make GET request for non-existent user
    const response = await apiClient.get(`/users/${nonExistentUserId}`);

    // Verify 404 response
    expect(response.status()).toBe(404);
  });

  test('should validate required fields when creating user', async ({ apiClient }) => {
    // Attempt to create user with missing fields
    const invalidUserData = {
      name: 'Test User',
      // Missing email and password
    };

    // Make POST request
    const response = await apiClient.post('/users', invalidUserData);

    // Verify validation error
    expect(response.status()).toBe(400);
  });
});
