# Contributing to Playwright Test Framework

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/playwrightplayground.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

### Project Structure

```
src/
├── pages/       # Page Object Models (POM)
├── utils/       # Utility classes (API, DB, helpers)
├── fixtures/    # Test fixtures and setup
└── config/      # Configuration files

tests/
├── ui/          # UI test specifications
├── api/         # API test specifications
└── db/          # Database test specifications
```

### Adding New Features

#### Adding a Page Object

1. Create a new file in `src/pages/`
2. Extend the `BasePage` class
3. Define locators as private readonly properties
4. Implement page-specific methods
5. Export from `src/pages/index.ts`

Example:
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private readonly element = this.page.locator('#element');

  constructor(page: Page) {
    super(page);
  }

  async performAction() {
    await this.click(this.element);
  }
}
```

#### Adding a Utility

1. Create a new file in `src/utils/`
2. Implement utility methods as static or instance methods
3. Add proper TypeScript types
4. Export from `src/utils/index.ts`

#### Adding Tests

1. Create test files in the appropriate directory (`ui/`, `api/`, or `db/`)
2. Use naming convention: `*.spec.ts` for UI, `*.api.spec.ts` for API, `*.db.spec.ts` for DB
3. Import from `src/fixtures/fixtures` for custom fixtures
4. Group related tests using `test.describe()`
5. Use `test.beforeEach()` and `test.afterEach()` for setup/cleanup

### Testing Your Changes

Before submitting a pull request:

1. **Run TypeScript compiler**: `npx tsc --noEmit`
2. **Run all tests**: `npm test` (if applicable)
3. **Check for linting errors**: Ensure code follows project style
4. **Test manually**: Verify your changes work as expected

### Commit Guidelines

- Use clear, descriptive commit messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Keep commits focused on a single change
- Reference issues when applicable: "Fix #123"

Example commit messages:
```
Add database transaction support to DatabaseClient
Fix API client authentication header
Update README with new examples
Remove deprecated utility methods
```

### Pull Request Process

1. **Update documentation** - Update README.md if you change functionality
2. **Add tests** - Include tests for new features
3. **Describe changes** - Provide clear description in PR
4. **Link issues** - Reference related issues
5. **Wait for review** - Maintainers will review your PR

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for changes
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] Commits are clean and descriptive
```

## Types of Contributions

### Bug Reports

When reporting bugs:
- Use the issue tracker
- Include a clear title and description
- Provide steps to reproduce
- Include error messages and logs
- Specify environment (OS, Node version, etc.)

### Feature Requests

When requesting features:
- Check if it already exists
- Describe the use case
- Explain why it would be useful
- Provide examples if possible

### Documentation

Documentation improvements are always welcome:
- Fix typos or grammar
- Add examples or clarifications
- Improve organization
- Add missing information

### Code Contributions

When contributing code:
- Follow project structure and patterns
- Write clean, maintainable code
- Include tests for new functionality
- Update documentation as needed

## Code Review Process

- Maintainers will review PRs regularly
- Feedback will be provided for improvements
- Once approved, PR will be merged
- Contributor will be credited in commit

## Questions?

If you have questions:
- Check existing documentation
- Search closed issues
- Open a new issue for discussion

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes (for significant contributions)
- Special thanks in README (for major features)

Thank you for contributing! 🎉
