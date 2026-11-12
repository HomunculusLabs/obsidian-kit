# 🚀 Development Guide

This guide will help you set up a development environment and contribute to Obsidian Kit.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** 7+ (comes with Node.js)
- **Git** 2+
- **VS Code** (recommended, with extensions listed below)

## 🛠️ Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/username/obsidian-kit.git
cd obsidian-kit
npm run dev-setup
```

The `dev-setup` script will:
- Install all dependencies
- Set up development configuration
- Run initial tests
- Create VS Code settings

### 2. Manual Setup (Alternative)

```bash
# Install dependencies
npm install

# Set up Git hooks
npx husky install

# Build the project
npm run build

# Run tests to verify setup
npm test
```

## 🏗️ Project Structure

```
obsidian-kit/
├── cli/                    # CLI source code
│   ├── bin/               # Executable entry point
│   └── commands/          # Command implementations
├── scripts/               # Build and utility scripts
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── fixtures/         # Test data
├── vault-template/        # Template for new vaults
└── docs/                 # Documentation
```

## 🧪 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write code following the project's style guide
- Add tests for new functionality
- Update documentation as needed

### 3. Run Tests and Checks

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check code coverage
npm run test:coverage

# Lint code
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format
```

### 4. Commit Your Changes

```bash
# Stage changes
git add .

# Commit (hooks will run automatically)
git commit -m "feat: add new feature"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style

We use ESLint and Prettier for code formatting. Configuration is in:

- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier configuration

### Key Style Rules

- Use 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline structures
- Maximum line length: 80 characters

## 🧪 Testing

### Test Structure

- **Unit tests**: Test individual functions/modules
- **Integration tests**: Test CLI commands end-to-end
- **Fixtures**: Test data and temporary files

### Writing Tests

```javascript
// Example unit test
describe('functionName', () => {
  it('should do something', () => {
    const result = functionName(input);
    expect(result).toBe(expected);
  });
});
```

### Test Utilities

The test setup provides global utilities:

```javascript
// Create temporary directory
const tempDir = global.createTestDir('test-name');

// Create temporary file
const filePath = global.createTempFile('path/to/file.txt', 'content');

// Check if file exists
const exists = global.fileExists('path/to/file.txt');
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run CLI in development mode |
| `npm run build` | Build the project |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint and fix code |
| `npm run lint:check` | Check code style without fixing |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run clean` | Clean build artifacts |
| `npm run dev-setup` | Set up development environment |

## 🎯 CLI Commands for Development

### Testing the CLI

```bash
# Run CLI directly
node cli/bin/obsidian-kit --help

# Test with development build
npm run dev init test-project

# Test specific command
npm run dev status --verbose
```

### Creating Test Vaults

```bash
# Create a test vault for development
node cli/bin/obsidian-kit init dev-test --force
cd dev-test

# Test status command
node ../../cli/bin/obsidian-kit status
```

## 🐛 Debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/cli/bin/obsidian-kit",
      "args": ["init", "debug-test"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Debugging Tests

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
node --inspect-brk node_modules/.bin/jest --testNamePattern="specific test"
```

## 📦 Building and Publishing

### Local Testing

```bash
# Build the project
npm run build

# Test local installation
npm pack
npm install -g obsidian-kit-*.tgz
```

### Publishing

```bash
# Run full test suite
npm run precommit

# Publish to NPM (requires access)
npm publish
```

## 🔍 Troubleshooting

### Common Issues

**Tests fail with permission errors**
```bash
# Fix file permissions
chmod +x cli/bin/obsidian-kit
```

**TypeScript errors**
```bash
# Clean and rebuild
npm run clean
npm run build
```

**Git hooks not running**
```bash
# Reinstall hooks
npx husky install
```

**Dependencies not found**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check the [GitHub Issues](https://github.com/username/obsidian-kit/issues)
- Start a [Discussion](https://github.com/username/obsidian-kit/discussions)
- Review existing documentation

## 🤝 Contributing Guidelines

### Before Contributing

1. Read this development guide
2. Set up your development environment
3. Look at existing issues and PRs

### Making Changes

1. Create an issue for your feature/bug fix
2. Create a feature branch from `main`
3. Write tests for your changes
4. Ensure all tests pass
5. Update documentation
6. Submit a pull request

### Pull Request Process

1. Update the README.md with details of changes
2. Update the CHANGELOG.md if applicable
3. Ensure your PR description clearly describes the changes
4. Link any relevant issues in the PR description

### Code Review Process

- All PRs require review
- Maintainers will check for:
  - Code quality and style
  - Test coverage
  - Documentation updates
  - Breaking changes

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [ESLint Guide](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Happy coding! 🚀