# Framework Architecture

This document describes the architecture and design decisions of the Playwright Test Automation Framework.

## Overview

The framework follows a modular, layered architecture that separates concerns and promotes reusability:

```
┌─────────────────────────────────────────────────────────────┐
│                        Test Layer                            │
│  (tests/ui, tests/api, tests/db)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────────┐
│                    Fixture Layer                             │
│  (Custom fixtures, setup/teardown)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────────┐
│                  Abstraction Layer                           │
│  (Page Objects, API Client, DB Client)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────────┐
│                   Playwright Core                            │
│  (Browser automation, API requests)                         │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
playwrightplayground/
│
├── src/                      # Source code
│   ├── pages/               # Page Object Models (POM)
│   │   ├── BasePage.ts      # Base class for all page objects
│   │   ├── LoginPage.ts     # Example page object
│   │   └── HomePage.ts      # Example page object
│   │
│   ├── utils/               # Utility classes
│   │   ├── ApiClient.ts     # API testing client
│   │   ├── DatabaseClient.ts # Database operations
│   │   ├── TestDataHelper.ts # Dynamic data generation
│   │   └── TestDataLoader.ts # Static data loading
│   │
│   ├── fixtures/            # Custom Playwright fixtures
│   │   └── fixtures.ts      # Reusable test fixtures
│   │
│   └── config/              # Configuration
│       └── test-config.ts   # Test settings
│
├── tests/                   # Test specifications
│   ├── ui/                  # UI test cases
│   ├── api/                 # API test cases
│   └── db/                  # Database test cases
│
├── test-data/               # Static test data
│   └── users.json          # User test data
│
├── .github/                 # CI/CD configuration
│   └── workflows/
│       └── playwright.yml   # GitHub Actions workflow
│
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── global-setup.ts         # Global test setup
└── global-teardown.ts      # Global test teardown
```

## Design Patterns

### 1. Page Object Model (POM)

All UI interactions are encapsulated in page objects that extend `BasePage`:

**Benefits:**
- Centralized element locators
- Reusable page actions
- Easy maintenance
- Type-safe interactions

**Example:**
```typescript
class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('#username');
  
  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    // ...
  }
}
```

### 2. Custom Fixtures

Playwright fixtures provide dependency injection for tests:

**Benefits:**
- Automatic setup and cleanup
- Shared resources across tests
- Improved test isolation
- Cleaner test code

**Example:**
```typescript
export const test = base.extend<CustomFixtures>({
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await client.init();
    await use(client);
    await client.dispose();
  },
});
```

### 3. Layered Architecture

The framework uses a layered approach:

1. **Test Layer** - Test specifications
2. **Fixture Layer** - Setup and teardown
3. **Abstraction Layer** - Page objects and utilities
4. **Framework Layer** - Playwright core

**Benefits:**
- Clear separation of concerns
- Easy to modify without affecting other layers
- Promotes code reuse
- Simplifies testing

## Component Details

### Base Page

The `BasePage` class provides common methods for all page objects:
- Navigation
- Element interactions (click, fill, getText)
- Waiting mechanisms
- Screenshot capabilities

### API Client

The `ApiClient` provides a simplified interface for API testing:
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Authentication handling
- Request/response management
- Automatic cleanup

### Database Client

The `DatabaseClient` handles database operations:
- Connection management
- CRUD operations
- Transaction support
- Query execution
- Automatic cleanup

### Test Data Management

Two approaches for test data:
1. **Dynamic** - Generate data on-the-fly using `TestDataHelper`
2. **Static** - Load from JSON files using `TestDataLoader`

## Configuration Management

### Environment Variables

Configuration is loaded from `.env` file:
```
BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=testuser
```

### TypeScript Configuration

Strict TypeScript settings ensure type safety:
- Strict mode enabled
- Type checking for all files
- ES2020 target

### Playwright Configuration

Multi-project setup allows different test types:
- UI tests (Chromium, Firefox, WebKit)
- API tests
- Database tests
- Mobile viewports

## Testing Strategy

### Test Organization

Tests are organized by type:
- **UI Tests** - User interface interactions
- **API Tests** - Backend API validation
- **DB Tests** - Database state verification

### Test Isolation

Each test is independent:
- No shared state between tests
- Fixtures handle setup/cleanup
- Parallel execution safe

### Test Data

- Use `TestDataHelper` for dynamic data
- Use `TestDataLoader` for static data
- Clean up test data after execution

## CI/CD Integration

### GitHub Actions Workflow

The framework includes a GitHub Actions workflow:
- Runs on push and pull requests
- Tests on multiple Node.js versions
- Parallel project execution
- Artifact upload for reports

### Environment-Specific Configuration

Different configurations for environments:
- Development (local)
- CI/CD (GitHub Actions)
- Production (deployment)

## Extensibility

### Adding New Page Objects

1. Create file in `src/pages/`
2. Extend `BasePage`
3. Define locators and methods
4. Export from `src/pages/index.ts`

### Adding New Utilities

1. Create file in `src/utils/`
2. Implement utility class/functions
3. Export from `src/utils/index.ts`

### Adding New Fixtures

1. Add to `src/fixtures/fixtures.ts`
2. Implement setup and cleanup
3. Use in tests via dependency injection

### Adding New Test Types

1. Create directory in `tests/`
2. Add test files with appropriate naming
3. Configure in `playwright.config.ts` if needed

## Best Practices

1. **Keep page objects focused** - One page object per page/component
2. **Use fixtures for setup** - Avoid repetitive setup code
3. **Write atomic tests** - Each test should test one thing
4. **Handle test data properly** - Generate or clean up test data
5. **Use TypeScript types** - Leverage type safety
6. **Follow naming conventions** - Consistent naming across the framework
7. **Document complex logic** - Add comments where needed
8. **Keep tests independent** - No dependencies between tests

## Performance Optimization

- Parallel test execution
- Reusable browser contexts
- Efficient fixture management
- Connection pooling for database

## Security Considerations

- Environment variables for sensitive data
- No hardcoded credentials
- .gitignore for sensitive files
- Secure database connections

## Maintenance

### Regular Updates

- Keep Playwright updated
- Update dependencies regularly
- Review and update test data
- Maintain documentation

### Code Quality

- TypeScript strict mode
- Consistent code style
- Regular code reviews
- Automated testing in CI/CD

## Future Enhancements

Potential improvements:
- Visual regression testing
- Performance testing utilities
- Additional database adapters (PostgreSQL, MongoDB)
- Advanced reporting dashboards
- Test data factories
- Mock server integration
- Accessibility testing utilities

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
