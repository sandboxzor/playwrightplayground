# Quick Start Guide

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test types
npm run test:ui      # UI tests only
npm run test:api     # API tests only
npm run test:db      # Database tests only
```

## Quick Examples

### Creating a New Page Object

```typescript
// src/pages/MyPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myButton = this.page.locator('#my-button');

  constructor(page: Page) {
    super(page);
  }

  async clickMyButton() {
    await this.click(this.myButton);
  }
}
```

### Writing a UI Test

```typescript
// tests/ui/my-test.spec.ts
import { test, expect } from '../../src/fixtures/fixtures';
import { MyPage } from '../../src/pages/MyPage';

test('my test', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto();
  await myPage.clickMyButton();
});
```

### Writing an API Test

```typescript
// tests/api/my-api.api.spec.ts
import { test, expect } from '../../src/fixtures/fixtures';

test('GET request', async ({ apiClient }) => {
  const response = await apiClient.get('/endpoint');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toBeDefined();
});
```

### Writing a Database Test

```typescript
// tests/db/my-db.db.spec.ts
import { test, expect } from '../../src/fixtures/fixtures';

test('query data', async ({ dbClient }) => {
  const result = await dbClient.query('SELECT * FROM table');
  expect(result.length).toBeGreaterThan(0);
});
```

## Common Commands

```bash
# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui-mode

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View test report
npm run test:report
```

## Useful Tips

1. **Use test fixtures** - They automatically handle setup and cleanup
2. **Generate test data** - Use `TestDataHelper` for dynamic data
3. **Check environment** - Make sure `.env` is configured correctly
4. **Review reports** - Check `playwright-report/` for detailed results
5. **Debug failing tests** - Use `npm run test:debug` for step-by-step debugging

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore example tests in `tests/` directory
- Check out page objects in `src/pages/`
- Review utilities in `src/utils/`

## Need Help?

- Check [Playwright Documentation](https://playwright.dev/)
- Review test examples in the repository
- Look at the comprehensive README.md
