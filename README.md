# Nylas Web

> Modern, open source JavaScript/TypeScript packages for integrating with the Nylas platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📦 Packages

This monorepo contains developer-friendly packages for building applications with Nylas APIs. Each package is independently versioned and published to npm.

### [`@nylas/connect`](./packages/nylas-connect/)

Modern, secure OAuth connection library for Nylas APIs.

- **ESM-only**, TypeScript-first, zero runtime dependencies
- Works in modern browsers and Node 22+
- Automatic session, token, and scope management
- Popup and inline OAuth flows
- React hooks and components included

[**📖 Documentation →**](./packages/nylas-connect/README.md)

```bash
npm install @nylas/connect
```

---

*More packages coming soon! This repository will expand to include additional Nylas integration tools and utilities.*

## 🚀 Quick Start

1. **Install a package**
   ```bash
   npm install @nylas/connect
   ```

2. **Follow the package documentation**
   - Each package has comprehensive documentation in its README
   - Examples and guides are included

3. **Get your Nylas credentials**
   - Sign up at [nylas.com](https://nylas.com)
   - Get your Client ID from the [Nylas Dashboard](https://dashboard.nylas.com)

## 🛠 Development

This is a monorepo managed with **pnpm workspaces**.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up your development environment
- Submitting bug reports and feature requests
- Creating pull requests
- Code style and testing guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **📚 Documentation**: [developer.nylas.com](https://developer.nylas.com)
- **💬 Community**: [GitHub Discussions](https://github.com/nylas/web/discussions)
- **🐛 Issues**: [GitHub Issues](https://github.com/nylas/web/issues)
- **✉️ Email**: support@nylas.com

---

*Built with ❤️ by the Nylas team and open source contributors.*