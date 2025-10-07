# Test Data

This directory contains static test data files that can be used across tests.

## Usage

### Loading Test Data

```typescript
import * as fs from 'fs';
import * as path from 'path';

const testData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../test-data/users.json'), 'utf-8')
);

// Use in tests
test('use test data', async ({ page }) => {
  const user = testData.testUsers[0];
  await page.fill('#username', user.username);
  await page.fill('#password', user.password);
});
```

### Creating Test Data Helper

```typescript
// src/utils/TestDataLoader.ts
export class TestDataLoader {
  static loadUsers() {
    const data = fs.readFileSync('test-data/users.json', 'utf-8');
    return JSON.parse(data);
  }
}
```

## Files

- `users.json` - Sample user data for authentication tests
- Add more data files as needed for your tests

## Best Practices

1. **Keep data generic** - Use example.com for emails, avoid real data
2. **Version control safe** - Don't include sensitive information
3. **Organize by domain** - Group related data (users, products, etc.)
4. **Use TypeScript interfaces** - Define types for your test data
5. **Generate when possible** - Use TestDataHelper for dynamic data instead of static files
