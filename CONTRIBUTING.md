# Contributing to Nylas Web

👋 Thank you for your interest in contributing to Nylas Web! We're excited to have you as part of our open source community.

This repository contains modern, developer-friendly JavaScript/TypeScript packages for integrating with the Nylas platform. Your contributions help make email, calendar, and contacts integration easier for developers everywhere.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Style Guide](#style-guide)
- [Getting Help](#getting-help)

## 🤝 Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment. By participating, you are expected to uphold these standards. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 22 or higher
- **pnpm**: We use pnpm for package management
- **Git**: For version control

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/web.git
   cd web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm build
   ```

4. **Run tests to ensure everything is working**
   ```bash
   pnpm test
   ```

### Project Structure

This is a monorepo containing multiple packages:

- **`packages/nylas-connect/`** - Modern OAuth connection library for Nylas APIs
- More packages coming soon!

Each package is independently versioned and published to npm.

## 🛠 How to Contribute

### Reporting Bugs

Found a bug? Help us fix it!

1. **Search existing issues** first to avoid duplicates
2. **Create a new issue** using our bug report template
3. **Include**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, browser, etc.)
   - Code samples if applicable

[**Report a Bug →**](https://github.com/nylas/web/issues/new?template=bug_report.md)

### Suggesting Features

Have an idea for improvement?

1. **Check existing feature requests** to see if it's already been suggested
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach (if you have ideas)

[**Request a Feature →**](https://github.com/nylas/web/issues/new?template=feature_request.md)

### Contributing Code

We welcome code contributions! Here's how to get started:

#### For Bug Fixes
- Feel free to submit a PR directly
- Reference the issue number in your PR description

#### For New Features
- **Please open an issue first** to discuss the feature
- This helps ensure alignment with project goals
- Avoids duplicate work

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow our style guide
   - Add tests for new functionality

3. **Test your changes**
   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Tests pass locally (`pnpm test`)
- [ ] Code follows our style guide (`pnpm lint`)
- [ ] Changes are documented (JSDoc, README updates, etc.)
- [ ] Commit messages follow [conventional commit format](https://conventionalcommits.org/)

### PR Requirements

1. **Clear title and description**
   - Explain what changes you made and why
   - Reference any related issues

2. **License confirmation**
   - All external contributors must include this text in the PR description:
   
   > "I confirm that this contribution is made under the terms of the MIT license and that I have the authority necessary to make this contribution on behalf of its copyright owner."

3. **Maintain test coverage**
   - New features require tests
   - Bug fixes should include regression tests

### Review Process

- Maintainers will review your PR as soon as possible
- We may request changes or ask questions
- Once approved, a maintainer will merge your PR

## 🧪 Testing

We use **Vitest** for testing. Our test philosophy:

- **Unit tests** for individual functions and components
- **Integration tests** for complex workflows
- **High coverage** to ensure reliability

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter @nylas/connect test
```

### Writing Tests

- Place test files next to the code they test (`.test.ts` suffix)
- Use descriptive test names
- Test both happy paths and error cases
- Mock external dependencies appropriately

## 📝 Style Guide

### Code Style

- **ESM only** - No CommonJS support
- **TypeScript** - Strongly typed code
- **Modern JavaScript** - Use latest ES features
- **Functional programming** - Prefer pure functions when possible

### Formatting

We use automated formatting tools:

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

feat(connect): add popup authentication flow
fix(connect): resolve token refresh issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🆘 Getting Help

### Questions & Discussions

- **General questions**: [GitHub Discussions](https://github.com/nylas/web/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/nylas/web/issues)
- **Feature requests**: [GitHub Issues](https://github.com/nylas/web/issues)

### Nylas Support

- **Developer documentation**: [developer.nylas.com](https://developer.nylas.com)
- **Community forum**: [discuss.nylas.com](https://discuss.nylas.com)
- **Support email**: support@nylas.com

---

## 🙏 Recognition

Contributors are recognized in our [CONTRIBUTORS.md](./CONTRIBUTORS.md) file and release notes. Thank you for helping make Nylas Web better!

---

*This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.*

