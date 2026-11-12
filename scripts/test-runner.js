#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class TestRunner {
  constructor() {
    this.testResults = {
      unit: { passed: 0, failed: 0, duration: 0 },
      integration: { passed: 0, failed: 0, duration: 0 },
      e2e: { passed: 0, failed: 0, duration: 0 },
      performance: { passed: 0, failed: 0, duration: 0 }
    };
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log(chalk.blue.bold('🧪 Obsidian Kit Comprehensive Test Suite\n'));
    
    try {
      // Run test suites in order
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      await this.runPerformanceTests();
      
      // Generate report
      await this.generateTestReport();
      
      // Display summary
      this.displaySummary();
      
    } catch (error) {
      console.error(chalk.red('❌ Test suite failed:'), error.message);
      process.exit(1);
    }
  }

  async runUnitTests() {
    console.log(chalk.cyan('🔬 Running Unit Tests...'));
    const startTime = Date.now();
    
    try {
      const result = await this.runJest('--testPathPattern=tests/unit', 'Unit Tests');
      this.testResults.unit = {
        ...result,
        duration: Date.now() - startTime
      };
      
      if (result.success) {
        console.log(chalk.green('✅ Unit tests passed\n'));
      } else {
        console.log(chalk.red('❌ Unit tests failed\n'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Unit tests error:'), error.message);
      this.testResults.unit.failed += 1;
    }
  }

  async runIntegrationTests() {
    console.log(chalk.cyan('🔗 Running Integration Tests...'));
    const startTime = Date.now();
    
    try {
      const result = await this.runJest('--testPathPattern=tests/integration', 'Integration Tests');
      this.testResults.integration = {
        ...result,
        duration: Date.now() - startTime
      };
      
      if (result.success) {
        console.log(chalk.green('✅ Integration tests passed\n'));
      } else {
        console.log(chalk.red('❌ Integration tests failed\n'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Integration tests error:'), error.message);
      this.testResults.integration.failed += 1;
    }
  }

  async runE2ETests() {
    console.log(chalk.cyan('🎭 Running End-to-End Tests...'));
    const startTime = Date.now();
    
    try {
      const result = await this.runJest('--testPathPattern=tests/e2e', 'E2E Tests');
      this.testResults.e2e = {
        ...result,
        duration: Date.now() - startTime
      };
      
      if (result.success) {
        console.log(chalk.green('✅ E2E tests passed\n'));
      } else {
        console.log(chalk.red('❌ E2E tests failed\n'));
      }
    } catch (error) {
      console.error(chalk.red('❌ E2E tests error:'), error.message);
      this.testResults.e2e.failed += 1;
    }
  }

  async runPerformanceTests() {
    console.log(chalk.cyan('⚡ Running Performance Tests...'));
    const startTime = Date.now();
    
    try {
      const result = await this.runJest('--testPathPattern=tests/performance', 'Performance Tests');
      this.testResults.performance = {
        ...result,
        duration: Date.now() - startTime
      };
      
      if (result.success) {
        console.log(chalk.green('✅ Performance tests passed\n'));
      } else {
        console.log(chalk.red('❌ Performance tests failed\n'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Performance tests error:'), error.message);
      this.testResults.performance.failed += 1;
    }
  }

  async runJest(args, testName) {
    return new Promise((resolve) => {
      const jestProcess = spawn('npx', ['jest', args, '--verbose'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let output = '';
      let errorOutput = '';

      jestProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
      });

      jestProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      jestProcess.on('close', (code) => {
        // Parse Jest output to extract test counts
        const passed = this.extractTestCount(output, 'passed');
        const failed = this.extractTestCount(output, 'failed');
        
        resolve({
          success: code === 0,
          passed,
          failed,
          output,
          errorOutput
        });
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        jestProcess.kill();
        resolve({
          success: false,
          passed: 0,
          failed: 1,
          output: '',
          errorOutput: 'Test timeout'
        });
      }, 300000);
    });
  }

  extractTestCount(output, type) {
    const regex = new RegExp(`(\\d+) ${type}`, 'gi');
    const matches = output.match(regex);
    if (matches && matches.length > 0) {
      const numbers = matches.map(match => parseInt(match.match(/\d+/)[0]));
      return Math.max(...numbers);
    }
    return 0;
  }

  async generateTestReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - this.startTime,
      results: this.testResults,
      summary: this.calculateSummary()
    };

    const reportPath = path.join(__dirname, '../test-report.json');
    await fs.writeJson(reportPath, reportData, { spaces: 2 });

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(reportData);
    const htmlReportPath = path.join(__dirname, '../test-report.html');
    await fs.writeFile(htmlReportPath, htmlReport);

    console.log(chalk.blue(`📊 Test reports generated:`));
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlReportPath}\n`);
  }

  calculateSummary() {
    const totalPassed = Object.values(this.testResults).reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = Object.values(this.testResults).reduce((sum, result) => sum + result.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const successRate = totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(1) : 0;

    return {
      totalPassed,
      totalFailed,
      totalTests,
      successRate: parseFloat(successRate)
    };
  }

  generateHTMLReport(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Obsidian Kit Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007acc; }
        .metric-label { color: #666; margin-top: 5px; }
        .test-suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { border-left: 4px solid #28a745; }
        .failure { border-left: 4px solid #dc3545; }
        .status { font-weight: bold; padding: 4px 8px; border-radius: 3px; color: white; }
        .status.passed { background: #28a745; }
        .status.failed { background: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Obsidian Kit Test Report</h1>
        <p class="timestamp">Generated: ${new Date(data.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${data.summary.totalTests}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.totalPassed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.totalFailed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(data.totalDuration / 1000).toFixed(1)}s</div>
                <div class="metric-label">Total Duration</div>
            </div>
        </div>

        <h2>Test Suite Results</h2>
        
        <div class="test-suite ${data.results.unit.failed === 0 ? 'success' : 'failure'}">
            <h3>Unit Tests <span class="status ${data.results.unit.failed === 0 ? 'passed' : 'failed'}">${data.results.unit.failed === 0 ? 'PASSED' : 'FAILED'}</span></h3>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Passed</td><td>${data.results.unit.passed}</td></tr>
                <tr><td>Failed</td><td>${data.results.unit.failed}</td></tr>
                <tr><td>Duration</td><td>${(data.results.unit.duration / 1000).toFixed(1)}s</td></tr>
            </table>
        </div>

        <div class="test-suite ${data.results.integration.failed === 0 ? 'success' : 'failure'}">
            <h3>Integration Tests <span class="status ${data.results.integration.failed === 0 ? 'passed' : 'failed'}">${data.results.integration.failed === 0 ? 'PASSED' : 'FAILED'}</span></h3>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Passed</td><td>${data.results.integration.passed}</td></tr>
                <tr><td>Failed</td><td>${data.results.integration.failed}</td></tr>
                <tr><td>Duration</td><td>${(data.results.integration.duration / 1000).toFixed(1)}s</td></tr>
            </table>
        </div>

        <div class="test-suite ${data.results.e2e.failed === 0 ? 'success' : 'failure'}">
            <h3>End-to-End Tests <span class="status ${data.results.e2e.failed === 0 ? 'passed' : 'failed'}">${data.results.e2e.failed === 0 ? 'PASSED' : 'FAILED'}</span></h3>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Passed</td><td>${data.results.e2e.passed}</td></tr>
                <tr><td>Failed</td><td>${data.results.e2e.failed}</td></tr>
                <tr><td>Duration</td><td>${(data.results.e2e.duration / 1000).toFixed(1)}s</td></tr>
            </table>
        </div>

        <div class="test-suite ${data.results.performance.failed === 0 ? 'success' : 'failure'}">
            <h3>Performance Tests <span class="status ${data.results.performance.failed === 0 ? 'passed' : 'failed'}">${data.results.performance.failed === 0 ? 'PASSED' : 'FAILED'}</span></h3>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Passed</td><td>${data.results.performance.passed}</td></tr>
                <tr><td>Failed</td><td>${data.results.performance.failed}</td></tr>
                <tr><td>Duration</td><td>${(data.results.performance.duration / 1000).toFixed(1)}s</td></tr>
            </table>
        </div>
    </div>
</body>
</html>`;
  }

  displaySummary() {
    const summary = this.calculateSummary();
    const totalDuration = Date.now() - this.startTime;

    console.log(chalk.blue.bold('\n📊 Test Summary'));
    console.log(chalk.gray('='.repeat(50)));
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(chalk.green(`Passed: ${summary.totalPassed}`));
    console.log(chalk.red(`Failed: ${summary.totalFailed}`));
    console.log(`Success Rate: ${summary.successRate}%`);
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);

    if (summary.totalFailed === 0) {
      console.log(chalk.green.bold('\n✅ All tests passed! System is ready for deployment.'));
    } else {
      console.log(chalk.red.bold('\n❌ Some tests failed. Please review and fix issues.'));
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error(chalk.red('❌ Test runner failed:'), error);
    process.exit(1);
  });
}

module.exports = TestRunner;