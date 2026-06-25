<div align="center">
  <a href="https://www.nylas.com/">
    <img width="100%" alt="Nylas" src="https://github.com/user-attachments/assets/137517ae-244d-47a5-8ca7-b12984971fc4" />
  </a>

  <h1>Nylas JavaScript</h1>

  <p>
    <strong>Modern, open source JavaScript/TypeScript packages for Nylas — the infrastructure that powers communications</strong>
  </p>

  <p>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22%2B-green.svg" alt="Node.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" /></a>
  </p>

  <p>
    <a href="https://developer.nylas.com/">📖 Docs</a> ·
    <a href="https://developer.nylas.com/docs/api/v3/">📚 API Reference</a> ·
    <a href="https://dashboard-v3.nylas.com/register">🚀 Sign up</a> ·
    <a href="https://github.com/orgs/nylas-samples/repositories">💡 Samples</a> ·
    <a href="https://forums.nylas.com">💬 Forum</a>
  </p>
</div>

<br />

Modern, open source JavaScript/TypeScript packages for integrating with [Nylas](https://developer.nylas.com/) — the infrastructure that powers communications. Integrate with Gmail, Microsoft, IMAP, Zoom, and 250+ providers in 5 minutes, or give your AI agent its own mailbox. Covers [Agent Accounts](https://developer.nylas.com/docs/v3/agent-accounts/), [Email](https://developer.nylas.com/docs/v3/email/), [Calendar](https://developer.nylas.com/docs/v3/calendar/), [Contacts](https://developer.nylas.com/docs/v3/email/contacts/), [Scheduler](https://developer.nylas.com/docs/v3/scheduler/), and [Notetaker](https://developer.nylas.com/docs/v3/notetaker/).

## 📦 Packages

This monorepo contains developer-friendly packages for building applications with Nylas APIs. Each package is independently versioned and published to npm.

### [`@nylas/connect`](./packages/nylas-connect/)

Modern, secure OAuth connection library for Nylas APIs.

- **ESM-only**, TypeScript-first, zero runtime dependencies
- Works in modern browsers and Node 22+
- Automatic session, token, and scope management
- Popup and inline OAuth flows

[**📖 Documentation →**](./packages/nylas-connect/README.md)

```bash
npm install @nylas/connect
```

### [`@nylas/react`](./packages/react/)

React components and hooks for Nylas API integration.

- **TypeScript-first** with full type safety
- Works with React 18 and 19
- Pre-built UI components for email, calendar, and contacts
- OAuth connection hooks and utilities
- Modular exports for tree-shaking

[**📖 Documentation →**](./packages/react/README.md)

```bash
npm install @nylas/react
```

---

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
- **💬 Community**: [Forums](https://forums.nylas.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/nylas/javascript/issues)

---

*Built with ❤️ by the Nylas team and open source contributors.*
