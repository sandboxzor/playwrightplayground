# Examples

This document provides practical examples of how to use different components of the framework.

## Table of Contents

1. [UI Testing Examples](#ui-testing-examples)
2. [API Testing Examples](#api-testing-examples)
3. [Database Testing Examples](#database-testing-examples)
4. [Combined Testing Examples](#combined-testing-examples)
5. [Advanced Patterns](#advanced-patterns)

## UI Testing Examples

### Basic Page Navigation

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { HomePage } from '../../src/pages/HomePage';

test('navigate to home page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  
  const title = await homePage.getTitle();
  expect(title).toBeTruthy();
});
```

### Form Interaction

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';

test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'password123');
  
  // Verify successful login
  const url = await loginPage.getCurrentURL();
  expect(url).not.toContain('/login');
});
```

### Using Test Data

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataLoader } from '../../src/utils/TestDataLoader';
import { LoginPage } from '../../src/pages/LoginPage';

test('login with test data', async ({ page }) => {
  const user = TestDataLoader.getTestUser(0);
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  
  expect(await loginPage.getCurrentURL()).toContain('/dashboard');
});
```

### Dynamic Test Data Generation

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

test('register new user', async ({ page }) => {
  const userData = {
    username: TestDataHelper.generateUsername(),
    email: TestDataHelper.generateEmail(),
    password: TestDataHelper.generatePassword(),
  };
  
  // Use generated data for registration
  await page.goto('/register');
  await page.fill('#username', userData.username);
  await page.fill('#email', userData.email);
  await page.fill('#password', userData.password);
  await page.click('button[type="submit"]');
  
  // Verify registration
  await expect(page).toHaveURL('/welcome');
});
```

### Taking Screenshots

```typescript
import { test } from '../../src/fixtures/fixtures';
import { HomePage } from '../../src/pages/HomePage';

test('capture home page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.takeScreenshot('home-page-initial');
  
  // Perform some actions
  await homePage.clickLogin();
  await homePage.takeScreenshot('after-click-login');
});
```

## API Testing Examples

### Simple GET Request

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('fetch users list', async ({ apiClient }) => {
  const response = await apiClient.get('/users');
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(Array.isArray(users)).toBeTruthy();
  expect(users.length).toBeGreaterThan(0);
});
```

### POST Request with Data

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

test('create new user via API', async ({ apiClient }) => {
  const newUser = {
    name: TestDataHelper.generateUsername(),
    email: TestDataHelper.generateEmail(),
    password: TestDataHelper.generatePassword(),
  };
  
  const response = await apiClient.post('/users', newUser);
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);
  
  const createdUser = await response.json();
  expect(createdUser.id).toBeDefined();
  expect(createdUser.name).toBe(newUser.name);
  expect(createdUser.email).toBe(newUser.email);
});
```

### Authentication Flow

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('authenticate and access protected endpoint', async ({ apiClient }) => {
  // Login
  const loginResponse = await apiClient.post('/auth/login', {
    username: 'testuser',
    password: 'testpassword',
  });
  
  expect(loginResponse.ok()).toBeTruthy();
  const { token } = await loginResponse.json();
  
  // Set authentication token
  await apiClient.setAuthToken(token);
  
  // Access protected endpoint
  const profileResponse = await apiClient.get('/profile');
  expect(profileResponse.ok()).toBeTruthy();
  
  const profile = await profileResponse.json();
  expect(profile.username).toBe('testuser');
});
```

### Error Handling

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('handle 404 error', async ({ apiClient }) => {
  const response = await apiClient.get('/users/999999');
  
  expect(response.status()).toBe(404);
  
  const error = await response.json();
  expect(error.message).toContain('not found');
});

test('handle validation errors', async ({ apiClient }) => {
  const invalidData = { name: '' }; // Missing required fields
  
  const response = await apiClient.post('/users', invalidData);
  
  expect(response.status()).toBe(400);
  
  const error = await response.json();
  expect(error.errors).toBeDefined();
});
```

## Database Testing Examples

### Query Data

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('query users from database', async ({ dbClient }) => {
  const users = await dbClient.query('SELECT * FROM users LIMIT 10');
  
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  expect(users[0]).toHaveProperty('id');
  expect(users[0]).toHaveProperty('username');
});
```

### Insert Data

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

test('insert new user', async ({ dbClient }) => {
  const userData = {
    username: TestDataHelper.generateUsername(),
    email: TestDataHelper.generateEmail(),
    created_at: new Date(),
  };
  
  const insertedId = await dbClient.insert('users', userData);
  
  expect(insertedId).toBeGreaterThan(0);
  
  // Verify insertion
  const user = await dbClient.getOne(
    'SELECT * FROM users WHERE id = ?',
    [insertedId]
  );
  
  expect(user).toBeDefined();
  expect(user.username).toBe(userData.username);
  
  // Cleanup
  await dbClient.delete('users', 'id = ?', [insertedId]);
});
```

### Update Data

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('update user data', async ({ dbClient }) => {
  // Insert test user
  const userId = await dbClient.insert('users', {
    username: 'testuser',
    email: 'test@example.com',
    created_at: new Date(),
  });
  
  // Update user
  const newUsername = 'updateduser';
  const affectedRows = await dbClient.update(
    'users',
    { username: newUsername },
    'id = ?',
    [userId]
  );
  
  expect(affectedRows).toBe(1);
  
  // Verify update
  const updatedUser = await dbClient.getOne(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  
  expect(updatedUser.username).toBe(newUsername);
  
  // Cleanup
  await dbClient.delete('users', 'id = ?', [userId]);
});
```

### Transaction Management

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('use database transaction', async ({ dbClient }) => {
  try {
    await dbClient.beginTransaction();
    
    // Insert multiple records
    const id1 = await dbClient.insert('users', {
      username: 'user1',
      email: 'user1@example.com',
      created_at: new Date(),
    });
    
    const id2 = await dbClient.insert('users', {
      username: 'user2',
      email: 'user2@example.com',
      created_at: new Date(),
    });
    
    // Commit transaction
    await dbClient.commit();
    
    // Verify both records exist
    const user1 = await dbClient.getOne('SELECT * FROM users WHERE id = ?', [id1]);
    const user2 = await dbClient.getOne('SELECT * FROM users WHERE id = ?', [id2]);
    
    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
    
    // Cleanup
    await dbClient.delete('users', 'id IN (?, ?)', [id1, id2]);
  } catch (error) {
    await dbClient.rollback();
    throw error;
  }
});
```

## Combined Testing Examples

### End-to-End Test with UI, API, and DB

```typescript
import { test, expect } from '../../src/fixtures/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { TestDataHelper } from '../../src/utils/TestDataHelper';

test('complete user registration flow', async ({ page, apiClient, dbClient }) => {
  const userData = {
    username: TestDataHelper.generateUsername(),
    email: TestDataHelper.generateEmail(),
    password: TestDataHelper.generatePassword(),
  };
  
  // Step 1: Create user via API
  const apiResponse = await apiClient.post('/users', userData);
  expect(apiResponse.ok()).toBeTruthy();
  const { id: userId } = await apiResponse.json();
  
  // Step 2: Verify user in database
  const dbUser = await dbClient.getOne(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  expect(dbUser).toBeDefined();
  expect(dbUser.username).toBe(userData.username);
  
  // Step 3: Login via UI
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(userData.username, userData.password);
  
  // Step 4: Verify successful login
  const currentUrl = await loginPage.getCurrentURL();
  expect(currentUrl).toContain('/dashboard');
  
  // Cleanup
  await dbClient.delete('users', 'id = ?', [userId]);
});
```

### Data Validation Across Layers

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('verify data consistency', async ({ page, apiClient, dbClient }) => {
  // Get user from API
  const apiResponse = await apiClient.get('/users/1');
  const apiUser = await apiResponse.json();
  
  // Get same user from database
  const dbUser = await dbClient.getOne('SELECT * FROM users WHERE id = ?', [1]);
  
  // Verify data matches
  expect(apiUser.id).toBe(dbUser.id);
  expect(apiUser.username).toBe(dbUser.username);
  expect(apiUser.email).toBe(dbUser.email);
  
  // Verify in UI
  await page.goto(`/users/${apiUser.id}`);
  const displayedUsername = await page.textContent('.user-profile .username');
  expect(displayedUsername).toBe(apiUser.username);
});
```

## Advanced Patterns

### Custom Fixture for Authentication

```typescript
// In src/fixtures/fixtures.ts
import { test as base } from '@playwright/test';

type AuthFixture = {
  authenticatedPage: Page;
  authToken: string;
};

export const test = base.extend<AuthFixture>({
  authToken: async ({ apiClient }, use) => {
    const response = await apiClient.post('/auth/login', {
      username: 'testuser',
      password: 'testpassword',
    });
    const { token } = await response.json();
    await use(token);
  },
  
  authenticatedPage: async ({ page, authToken }, use) => {
    await page.goto('/');
    await page.evaluate((token) => {
      localStorage.setItem('authToken', token);
    }, authToken);
    await use(page);
  },
});
```

### Parameterized Tests

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

const testCases = [
  { input: 'test1@example.com', expected: true },
  { input: 'invalid-email', expected: false },
  { input: 'test@', expected: false },
  { input: 'test@example.com', expected: true },
];

testCases.forEach(({ input, expected }) => {
  test(`validate email: ${input}`, async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', input);
    await page.blur('#email');
    
    const isValid = await page.isVisible('.email-valid-icon');
    expect(isValid).toBe(expected);
  });
});
```

### Retry Logic for Flaky Operations

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test('handle eventually consistent operation', async ({ apiClient, dbClient }) => {
  // Create resource via API
  const response = await apiClient.post('/resources', { name: 'test' });
  const { id } = await response.json();
  
  // Wait for eventual consistency
  let resource = null;
  for (let i = 0; i < 10; i++) {
    resource = await dbClient.getOne(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );
    if (resource) break;
    await TestDataHelper.wait(1000);
  }
  
  expect(resource).toBeDefined();
  
  // Cleanup
  await dbClient.delete('resources', 'id = ?', [id]);
});
```

### Parallel Test Execution with Shared Setup

```typescript
import { test, expect } from '../../src/fixtures/fixtures';

test.describe.configure({ mode: 'parallel' });

test.describe('parallel user tests', () => {
  test('user test 1', async ({ page }) => {
    // Test implementation
  });
  
  test('user test 2', async ({ page }) => {
    // Test implementation
  });
  
  test('user test 3', async ({ page }) => {
    // Test implementation
  });
});
```

## Tips and Best Practices

1. **Always clean up test data** - Use `afterEach` or try/finally blocks
2. **Use meaningful test names** - Describe what the test does
3. **Keep tests independent** - Don't rely on other tests' state
4. **Generate unique data** - Use TestDataHelper to avoid conflicts
5. **Handle async properly** - Always await async operations
6. **Use fixtures** - They provide automatic setup and cleanup
7. **Test one thing** - Each test should verify a single behavior
8. **Add assertions** - Verify expected outcomes explicitly

## Running These Examples

To run the example tests:

```bash
# Run all examples
npm test

# Run specific type
npm run test:ui
npm run test:api
npm run test:db

# Run with UI mode to see tests in action
npm run test:ui-mode
```
