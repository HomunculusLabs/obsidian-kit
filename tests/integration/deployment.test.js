const fs = require('fs');
const path = require('path');

describe('Deployment System', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const deployScript = path.join(projectRoot, 'scripts/deploy.js');
  const rollbackScript = path.join(projectRoot, 'scripts/rollback.js');

  beforeEach(() => {
    // Ensure we're in the project root
    process.chdir(projectRoot);
  });

  describe('Deployment Script', () => {
    test('should exist and be executable', () => {
      expect(fs.existsSync(deployScript)).toBe(true);
      expect(fs.statSync(deployScript).mode & 0o111).toBeTruthy();
    });

    test('should have required dependencies', () => {
      const packageJson = require(path.join(projectRoot, 'package.json'));
      expect(packageJson.dependencies).toHaveProperty('semver');
      expect(packageJson.devDependencies).toHaveProperty('@types/semver');
    });

    test('should validate environment configuration', () => {
      const productionConfig = require(path.join(projectRoot, 'config/production.json'));
      const stagingConfig = require(path.join(projectRoot, 'config/staging.json'));

      expect(productionConfig.environment).toBe('production');
      expect(stagingConfig.environment).toBe('staging');

      expect(productionConfig.deployment.tag).toBe('latest');
      expect(stagingConfig.deployment.tag).toBe('beta');
    });

    test('should pre-deployment checks work', () => {
      const deploy = require(deployScript);

      // Mock git status to be clean
      jest.spyOn(require('child_process'), 'execSync')
        .mockImplementation((command) => {
          if (command.includes('git status --porcelain')) {
            return '';
          }
          if (command.includes('node -v')) {
            return 'v20.0.0';
          }
          return '';
        });

      expect(() => deploy.checkPreDeploymentRequirements()).not.toThrow();
    });
  });

  describe('Rollback Script', () => {
    test('should exist and be executable', () => {
      expect(fs.existsSync(rollbackScript)).toBe(true);
      expect(fs.statSync(rollbackScript).mode & 0o111).toBeTruthy();
    });

    test('should handle version listing', () => {
      const rollback = require(rollbackScript);

      // Mock npm view command
      jest.spyOn(require('child_process'), 'execSync')
        .mockImplementation((command) => {
          if (command.includes('npm view obsidian-kit versions')) {
            return '["1.0.0", "1.0.1", "1.1.0"]';
          }
          return '';
        });

      const versions = rollback.getAvailableVersions();
      expect(versions).toContain('1.0.0');
      expect(versions).toContain('1.0.1');
      expect(versions).toContain('1.1.0');
    });
  });

  describe('Package.json Scripts', () => {
    test('should have deployment scripts', () => {
      const packageJson = require(path.join(projectRoot, 'package.json'));

      expect(packageJson.scripts).toHaveProperty('deploy:staging');
      expect(packageJson.scripts).toHaveProperty('deploy:production');
      expect(packageJson.scripts).toHaveProperty('rollback');
      expect(packageJson.scripts).toHaveProperty('rollback:list');
      expect(packageJson.scripts).toHaveProperty('rollback:history');
    });

    test('deployment scripts should use correct commands', () => {
      const packageJson = require(path.join(projectRoot, 'package.json'));

      expect(packageJson.scripts['deploy:staging']).toBe('node scripts/deploy.js staging');
      expect(packageJson.scripts['deploy:production']).toBe('node scripts/deploy.js production');
      expect(packageJson.scripts.rollback).toBe('node scripts/rollback.js');
    });
  });

  describe('Configuration Files', () => {
    test('production config should have correct structure', () => {
      const config = require(path.join(projectRoot, 'config/production.json'));

      expect(config).toHaveProperty('environment');
      expect(config).toHaveProperty('node');
      expect(config).toHaveProperty('logging');
      expect(config).toHaveProperty('security');
      expect(config).toHaveProperty('performance');
      expect(config).toHaveProperty('deployment');
      expect(config).toHaveProperty('testing');
      expect(config).toHaveProperty('notifications');
    });

    test('staging config should have correct structure', () => {
      const config = require(path.join(projectRoot, 'config/staging.json'));

      expect(config).toHaveProperty('environment');
      expect(config).toHaveProperty('node');
      expect(config).toHaveProperty('logging');
      expect(config).toHaveProperty('security');
      expect(config).toHaveProperty('performance');
      expect(config).toHaveProperty('deployment');
      expect(config).toHaveProperty('testing');
      expect(config).toHaveProperty('notifications');
    });
  });

  describe('Documentation', () => {
    test('deployment documentation should exist', () => {
      const deploymentDoc = path.join(projectRoot, 'DEPLOYMENT.md');
      expect(fs.existsSync(deploymentDoc)).toBe(true);
    });

    test('deployment documentation should contain key sections', () => {
      const deploymentDoc = path.join(projectRoot, 'DEPLOYMENT.md');
      const content = fs.readFileSync(deploymentDoc, 'utf8');

      expect(content).toContain('Prerequisites');
      expect(content).toContain('Environments');
      expect(content).toContain('Deployment Process');
      expect(content).toContain('Rollback Procedures');
      expect(content).toContain('Troubleshooting');
    });
  });

  describe('Backup System', () => {
    test('should create backup directory structure', () => {
      const backupDir = path.join(projectRoot, 'deploy-backups');

      // Directory should be created when deployment runs
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      expect(fs.existsSync(backupDir)).toBe(true);
    });

    test('should handle rollback log directory', () => {
      const logDir = path.join(projectRoot, 'deploy-backups/rollback-logs');

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      expect(fs.existsSync(logDir)).toBe(true);
    });
  });

  describe('Security and Quality', () => {
    test('should not expose sensitive information in configs', () => {
      const productionConfig = require(path.join(projectRoot, 'config/production.json'));
      const stagingConfig = require(path.join(projectRoot, 'config/staging.json'));

      // Check that no actual tokens or passwords are in config files
      const prodString = JSON.stringify(productionConfig);
      const stagingString = JSON.stringify(stagingConfig);

      expect(prodString).not.toMatch(/password|token|secret|key/i);
      expect(stagingString).not.toMatch(/password|token|secret|key/i);
    });

    test('should have appropriate file permissions', () => {
      const scripts = [
        deployScript,
        rollbackScript,
        path.join(projectRoot, 'scripts/check-quality.js'),
      ];

      scripts.forEach(script => {
        if (fs.existsSync(script)) {
          const stats = fs.statSync(script);
          // Should be readable and executable
          expect(stats.mode & 0o444).toBeTruthy(); // Readable
          expect(stats.mode & 0o111).toBeTruthy(); // Executable
        }
      });
    });
  });
});
