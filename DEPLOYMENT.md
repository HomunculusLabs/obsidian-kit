# 🚀 Obsidian Kit Deployment Guide

This guide covers the deployment process for Obsidian Kit to different environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environments](#environments)
- [Deployment Process](#deployment-process)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before deploying, ensure you have:

1. **Node.js** version 16.0.0 or higher
2. **npm** configured with appropriate permissions
3. **Git** access with push permissions
4. **NPM token** configured for publishing (for production deployments)
5. **Clean working directory** (no uncommitted changes)

### Setup NPM Token

```bash
# Add NPM token to your environment
npm config set //registry.npmjs.org/:_authToken YOUR_NPM_TOKEN

# Or set in environment variable
export NPM_TOKEN=YOUR_NPM_TOKEN
```

## 🌍 Environments

### Staging Environment
- **Purpose**: Testing and validation
- **Registry**: npm (beta tag)
- **Git Tag**: No
- **Requirements**: Basic tests passing
- **Command**: `npm run deploy:staging`

### Production Environment
- **Purpose**: Public release
- **Registry**: npm (latest tag)
- **Git Tag**: Yes
- **Requirements**: All tests passing, stable version
- **Command**: `npm run deploy:production`

## 🚀 Deployment Process

### Automated Deployment

The deployment process is fully automated through the deployment script:

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### Manual Deployment Steps

If you need to deploy manually:

1. **Pre-deployment checks**
   ```bash
   npm run lint:check
   npm run typecheck
   npm test
   ```

2. **Build the project**
   ```bash
   npm run clean
   npm run build
   ```

3. **Create deployment artifacts**
   ```bash
   npm pack
   ```

4. **Publish to NPM**
   ```bash
   # Staging
   npm publish --tag beta
   
   # Production
   npm publish
   ```

5. **Create Git Tag** (production only)
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### Pre-deployment Checklist

- [ ] All tests are passing
- [ ] Code quality checks pass
- [ ] Version number is updated (semantic versioning)
- [ ] CHANGELOG.md is updated
- [ ] Documentation is current
- [ ] No uncommitted changes
- [ ] Dependencies are secure

## 🔄 Rollback Procedures

### Quick Rollback

```bash
# List available versions
npm run rollback:list

# Rollback to specific version
npm run rollback 1.0.0

# View rollback history
npm run rollback:history
```

### Manual Rollback

```bash
# Uninstall current version
npm uninstall -g obsidian-kit

# Install specific version
npm install -g obsidian-kit@1.0.0

# Verify installation
obsidian-kit --version
```

### Rollback Scenarios

1. **Critical Bug Discovery**
   - Immediately rollback to previous stable version
   - Create hotfix branch
   - Test and deploy hotfix

2. **Performance Issues**
   - Monitor impact
   - If severe, rollback within 30 minutes
   - Investigate and fix before redeploy

3. **Security Vulnerability**
   - Immediate rollback if critical
   - Patch and redeploy within 24 hours

## 📊 Monitoring and Maintenance

### Post-deployment Monitoring

1. **NPM Download Stats**
   - Monitor download trends
   - Check for unusual spikes

2. **Error Tracking**
   - Monitor GitHub issues
   - Check error reports

3. **Performance Metrics**
   - CLI response times
   - Memory usage

### Regular Maintenance

- **Weekly**: Check dependency updates
- **Monthly**: Security audit
- **Quarterly**: Performance review

## 🛠️ Configuration

### Environment Configuration

Configuration files are located in `/config/`:

- `production.json` - Production settings
- `staging.json` - Staging settings

### Deployment Configuration

Key settings in deployment scripts:

```javascript
// scripts/deploy.js
const config = {
  production: {
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    publishCommand: 'npm publish',
    registry: 'https://registry.npmjs.org',
  },
  staging: {
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    publishCommand: 'npm publish --tag beta',
    registry: 'https://registry.npmjs.org',
  }
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Fix NPM permissions
sudo chown -R $(whoami) ~/.npm
```

#### 2. Git Tag Already Exists
```bash
# Delete existing tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

#### 3. NPM Publish Fails
```bash
# Check NPM authentication
npm whoami

# Re-authenticate if needed
npm login
```

#### 4. Tests Fail
```bash
# Run tests with verbose output
npm test -- --verbose

# Check specific test file
npm test -- --testPathPattern=specific.test.js
```

### Emergency Procedures

#### Deployment Failure Mid-process
1. Check logs for error details
2. Fix the issue
3. Restart deployment process
4. If needed, rollback to previous version

#### Production Issues
1. Immediately assess impact
2. If critical, rollback within 15 minutes
3. Communicate with users
4. Investigate and fix issue
5. Test thoroughly before redeploy

## 📝 Deployment History

Deployment logs are maintained in:
- `deploy-backups/` - Backup artifacts and rollback scripts
- `deploy-backups/rollback-logs/rollback-history.json` - Rollback history

## 🔄 CI/CD Integration

### GitHub Actions

The project includes automated CI/CD workflows:

- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/release.yml` - Release automation
- `.github/workflows/test.yml` - Test automation

### Environment Variables

Required for CI/CD:

- `NPM_TOKEN` - NPM publishing token
- `GITHUB_TOKEN` - GitHub API token

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

For questions or issues with deployment, please create an issue in the GitHub repository.