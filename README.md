# Playwright Test Automation Framework

A comprehensive test automation framework built with Playwright for UI, API, and Database testing.

## Features

- ✅ **UI Testing** - Page Object Model implementation with reusable components
- ✅ **API Testing** - Built-in API client for REST API testing
- ✅ **Database Testing** - MySQL/MariaDB database utilities for data validation
- ✅ **TypeScript** - Full TypeScript support for type safety
- ✅ **Custom Fixtures** - Reusable test fixtures for common setup
- ✅ **Multiple Browsers** - Support for Chromium, Firefox, and WebKit
- ✅ **Parallel Execution** - Run tests in parallel for faster execution
- ✅ **Rich Reporting** - HTML, JSON, and console reporters
- ✅ **Test Data Helpers** - Utilities for generating test data

## Project Structure

```
playwrightplayground/
├── src/
│   ├── pages/              # Page Object Models
│   │   ├── BasePage.ts     # Base page class with common methods
│   │   └── LoginPage.ts    # Example login page object
│   ├── utils/              # Utility classes
│   │   ├── ApiClient.ts    # API testing utilities
│   │   ├── DatabaseClient.ts # Database operations
│   │   └── TestDataHelper.ts # Test data generation
│   ├── fixtures/           # Custom test fixtures
│   │   └── fixtures.ts     # Reusable fixtures
│   └── config/             # Configuration files
├── tests/
│   ├── ui/                 # UI test specs
│   │   └── login.spec.ts
│   ├── api/                # API test specs
│   │   └── users.api.spec.ts
│   └── db/                 # Database test specs
│       └── users.db.spec.ts
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL/MariaDB (for database tests)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sandboxzor/playwrightplayground.git
cd playwrightplayground
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Base URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=testuser
DB_PASSWORD=testpassword
DB_NAME=testdb

# Test Configuration
HEADLESS=true
TIMEOUT=30000
```

### Playwright Configuration

The `playwright.config.ts` file contains all test execution settings:
- Browser configurations (Chromium, Firefox, WebKit)
- Test timeout settings
- Parallel execution settings
- Reporter configurations
- Base URL and other test options

## Running Tests

### All Tests
```bash
npm test
```

### UI Tests Only
```bash
npm run test:ui
```

### API Tests Only
```bash
npm run test:api
```

### Database Tests Only
```bash
npm run test:db
```

### Run in Headed Mode
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Specific Browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### UI Mode (Interactive)
```bash
npm run test:ui-mode
```

### View Test Report
```bash
npm run test:report
```

## Writing Tests

### UI Tests

Create page objects extending `BasePage`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class MyPage extends BasePage {
  private readonly myElement = this.page.locator('#my-element');

  constructor(page: Page) {
    super(page);
  }

  async performAction() {
    await this.click(this.myElement);
  }
}
```

Write tests using the custom fixtures:

```typescript
import { test, expect } from '../src/fixtures/fixtures';

test('my test', async ({ page }) => {
  // Your test code
});
```

### API Tests

Use the `ApiClient` fixture:

```typescript
import { test, expect } from '../src/fixtures/fixtures';

test('API test', async ({ apiClient }) => {
  const response = await apiClient.get('/endpoint');
  expect(response.ok()).toBeTruthy();
});
```

### Database Tests

Use the `DatabaseClient` fixture:

```typescript
import { test, expect } from '../src/fixtures/fixtures';

test('Database test', async ({ dbClient }) => {
  const users = await dbClient.query('SELECT * FROM users');
  expect(users.length).toBeGreaterThan(0);
});
```

## Best Practices

1. **Use Page Object Model** - Keep locators and page actions in page objects
2. **Use Custom Fixtures** - Leverage fixtures for common setup and teardown
3. **Generate Test Data** - Use `TestDataHelper` for dynamic test data
4. **Isolate Tests** - Each test should be independent and not rely on others
5. **Clean Up** - Always clean up test data in `afterEach` or `afterAll` hooks
6. **Use Descriptive Names** - Name tests and methods clearly
7. **Handle Waits Properly** - Use Playwright's built-in waiting mechanisms
8. **Parallel Execution** - Design tests to run in parallel safely

## CI/CD Integration

The framework is ready for CI/CD integration. Example for GitHub Actions:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - name: Upload report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Browser Installation Issues
```bash
npx playwright install --force
```

### Database Connection Issues
- Verify database credentials in `.env`
- Ensure database server is running
- Check network connectivity

### Test Failures
- Check test reports in `playwright-report/`
- Review screenshots and videos in `test-results/`
- Run tests in headed mode for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue in GitHub
- Check Playwright documentation: https://playwright.dev/

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
