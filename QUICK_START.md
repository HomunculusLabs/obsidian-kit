# 🚀 Quick Start Guide

Get up and running with Obsidian Kit development in minutes!

## ⚡ One-Command Setup

```bash
git clone https://github.com/username/obsidian-kit.git
cd obsidian-kit
npm run dev-setup
```

That's it! The `dev-setup` script will:
- Install all dependencies
- Set up development configuration
- Create VS Code settings
- Run initial tests
- Verify everything works

## 🧪 Verify Installation

```bash
# Test the CLI
npm run dev -- --help

# Run tests
npm test

# Check code quality
npm run check-quality
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run CLI in development mode |
| `npm test` | Run all tests |
| `npm run lint` | Fix code style issues |
| `npm run build` | Build the project |
| `npm run dev-setup` | Re-run development setup |

## 📁 Create Your First Test Vault

```bash
# Create a test vault
npm run dev init my-test-vault --force
cd my-test-vault

# Check vault status
npm run dev status
```

## 🔧 Common Tasks

### Adding a New Command

1. Create file: `cli/commands/your-command.js`
2. Export your command function
3. Add to CLI bin/obsidian-kit
4. Write tests in `tests/unit/cli/your-command.test.js`

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific test file
npm test -- your-test-file
```

### Code Quality

```bash
# Fix all style issues
npm run lint

# Check without fixing
npm run lint:check

# Format code
npm run format
```

## 🐛 Troubleshooting

### "Command not found" errors
```bash
# Reinstall dependencies
npm install

# Rebuild project
npm run build
```

### Test failures
```bash
# Clean test cache
npm run clean
npm test
```

### Linting errors
```bash
# Auto-fix most issues
npm run lint

# Check remaining issues
npm run lint:check
```

## 📚 Next Steps

- Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed guide
- Check existing commands in `cli/commands/`
- Review test structure in `tests/`
- Look at the project structure in the main README

## 🤝 Need Help?

- Check [GitHub Issues](https://github.com/username/obsidian-kit/issues)
- Start a [Discussion](https://github.com/username/obsidian-kit/discussions)
- Review the development documentation

---

Happy coding! 🎉