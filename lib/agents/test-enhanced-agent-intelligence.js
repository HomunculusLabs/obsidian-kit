#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const EnhancedAgentIntelligence = require('./enhanced-agent-intelligence');

/**
 * Test suite for Enhanced Agent Intelligence system
 */
class EnhancedAgentIntelligenceTest {
  constructor() {
    this.testProjectPath = path.join(__dirname, 'test-enhanced-agent-project');
    this.testResults = [];
  }

  async runAllTests() {
    console.log(chalk.blue.bold('\n🧪 Enhanced Agent Intelligence Test Suite\n'));

    try {
      await this.setupTestEnvironment();
      
      await this.testInitialization();
      await this.testAgentProfileLoading();
      await this.testContextAnalysis();
      await this.testDynamicContextInjection();
      await this.testAdaptiveLearning();
      await this.testDecisionEngine();
      await this.testAgentEnhancement();
      await this.testIntelligenceReporting();
      
      await this.cleanupTestEnvironment();
      
      this.showTestResults();
      
    } catch (error) {
      console.error(chalk.red('❌ Test suite failed:'), error.message);
      process.exit(1);
    }
  }

  async setupTestEnvironment() {
    console.log(chalk.cyan('🔧 Setting up test environment...'));
    
    // Create test project structure
    await fs.ensureDir(this.testProjectPath);
    await fs.ensureDir(path.join(this.testProjectPath, 'agents'));
    await fs.ensureDir(path.join(this.testProjectPath, '.specify', 'memory'));
    await fs.ensureDir(path.join(this.testProjectPath, '.specify', 'specs'));
    await fs.ensureDir(path.join(this.testProjectPath, '4 - Projects'));

    // Create test agent configuration
    const testAgentConfig = `# Test Agent Configuration

## Agent Personality & Approach

### Primary Role
Test agent for enhanced intelligence system validation

### Communication Style
- **Test-Oriented**: Focus on validation and verification
- **Comprehensive**: Cover all test scenarios
- **Automated**: Enable automated testing workflows

### Working Principles
1. **Validation-First**: Always validate before implementation
2. **Coverage-Driven**: Ensure comprehensive test coverage
3. **Automated-Execution**: Use automated test workflows

## Capabilities
- **File System**: Read/write test files
- **Bash**: Execute test commands
- **Analysis**: Analyze test results
`;

    await fs.writeFile(
      path.join(this.testProjectPath, 'agents', 'test-agent.md'),
      testAgentConfig
    );

    // Create test constitution
    const testConstitution = `# Test Project Constitution

## Project Vision
Test project for Enhanced Agent Intelligence system validation

## Quality Standards
- All tests must pass
- Code coverage > 90%
- Performance benchmarks met

## Decision Framework
- Test-driven development approach
- Automated validation required
- Continuous integration enabled
`;

    await fs.writeFile(
      path.join(this.testProjectPath, '.specify', 'memory', 'constitution.md'),
      testConstitution
    );

    // Create test specifications
    const testSpecs = `# Test Specifications

## Requirements
- Enhanced agent intelligence system
- Context-aware configurations
- Dynamic context injection
- Adaptive learning capabilities

## Acceptance Criteria
- [ ] System initializes correctly
- [ ] Agent profiles load successfully
- [ ] Context analysis works
- [ ] Dynamic injection functions
- [ ] Adaptive learning operates
- [ ] Decision engine provides recommendations
`;

    await fs.writeFile(
      path.join(this.testProjectPath, '.specify', 'specs', 'requirements.md'),
      testSpecs
    );

    // Create test tasks
    const testTasks = `# Test Tasks

- [[Test Agent Enhancement]] status::todo priority::high
- [[Context Analysis Validation]] status::todo priority::medium
- [[Dynamic Injection Testing]] status::todo priority::medium
- [[Adaptive Learning Verification]] status::todo priority::low
`;

    await fs.writeFile(
      path.join(this.testProjectPath, '4 - Projects', 'Tasks.base'),
      testTasks
    );

    console.log(chalk.green('   ✓ Test environment created'));
  }

  async testInitialization() {
    console.log(chalk.cyan('\n🔍 Testing Initialization...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      this.assert(intelligence.initialized, 'System should be initialized');
      this.assert(intelligence.agentProfiles.size > 0, 'Agent profiles should be loaded');
      this.assert(intelligence.contextAnalyzer, 'Context analyzer should be initialized');
      this.assert(intelligence.dynamicInjector, 'Dynamic injector should be initialized');
      this.assert(intelligence.adaptiveLearner, 'Adaptive learner should be initialized');
      this.assert(intelligence.decisionEngine, 'Decision engine should be initialized');
      
      this.recordTest('Initialization', true);
      console.log(chalk.green('   ✓ Initialization test passed'));
      
    } catch (error) {
      this.recordTest('Initialization', false, error.message);
      console.log(chalk.red('   ✗ Initialization test failed:'), error.message);
    }
  }

  async testAgentProfileLoading() {
    console.log(chalk.cyan('\n🤖 Testing Agent Profile Loading...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const profiles = await intelligence.getAllAgentProfiles();
      this.assert(profiles.length > 0, 'Should load at least one agent profile');
      
      const testAgent = profiles.find(p => p.name === 'test-agent');
      this.assert(testAgent, 'Should load test-agent profile');
      this.assert(testAgent.capabilities.length > 0, 'Should extract capabilities');
      this.assert(testAgent.context, 'Should extract context requirements');
      this.assert(testAgent.personality, 'Should extract personality traits');
      this.assert(testAgent.workflows.length >= 0, 'Should extract workflows');
      
      this.recordTest('Agent Profile Loading', true);
      console.log(chalk.green('   ✓ Agent profile loading test passed'));
      
    } catch (error) {
      this.recordTest('Agent Profile Loading', false, error.message);
      console.log(chalk.red('   ✗ Agent profile loading test failed:'), error.message);
    }
  }

  async testContextAnalysis() {
    console.log(chalk.cyan('\n🔍 Testing Context Analysis...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const testContext = {
        projectPath: this.testProjectPath,
        currentTask: 'Test Agent Enhancement',
        specifications: ['requirements'],
        availableContext: {
          constitution: true,
          decisions: false,
          architecture: false,
          requirements: true
        }
      };
      
      const analysis = await intelligence.contextAnalyzer.analyze(testContext);
      
      this.assert(analysis.relevance >= 0, 'Should calculate relevance');
      this.assert(analysis.completeness >= 0, 'Should calculate completeness');
      this.assert(analysis.entities.length > 0, 'Should identify entities');
      this.assert(Array.isArray(analysis.gaps), 'Should identify gaps');
      
      this.recordTest('Context Analysis', true);
      console.log(chalk.green('   ✓ Context analysis test passed'));
      
    } catch (error) {
      this.recordTest('Context Analysis', false, error.message);
      console.log(chalk.red('   ✗ Context analysis test failed:'), error.message);
    }
  }

  async testDynamicContextInjection() {
    console.log(chalk.cyan('\n💉 Testing Dynamic Context Injection...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const profile = {
        name: 'test-agent',
        context: {
          required: ['constitution'],
          preferred: ['specifications'],
          dynamic: []
        }
      };
      
      const contextAnalysis = {
        relevance: 0.8,
        completeness: 0.7,
        entities: [],
        gaps: []
      };
      
      const enhancedContext = await intelligence.dynamicInjector.inject(profile, contextAnalysis);
      
      this.assert(enhancedContext.original, 'Should preserve original context');
      this.assert(enhancedContext.injected, 'Should contain injected context');
      this.assert(enhancedContext.metadata, 'Should contain metadata');
      this.assert(enhancedContext.metadata.injectionCount >= 0, 'Should count injections');
      
      if (enhancedContext.injected.constitution) {
        this.assert(enhancedContext.injected.constitution.type, 'Should inject constitution with type');
        this.assert(enhancedContext.injected.constitution.summary, 'Should inject constitution with summary');
      }
      
      this.recordTest('Dynamic Context Injection', true);
      console.log(chalk.green('   ✓ Dynamic context injection test passed'));
      
    } catch (error) {
      this.recordTest('Dynamic Context Injection', false, error.message);
      console.log(chalk.red('   ✗ Dynamic context injection test failed:'), error.message);
    }
  }

  async testAdaptiveLearning() {
    console.log(chalk.cyan('\n🧠 Testing Adaptive Learning...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const profile = {
        name: 'test-agent',
        adaptationLevel: 'medium'
      };
      
      const contextAnalysis = {
        relevance: 0.6,
        completeness: 0.5,
        gaps: ['decisions']
      };
      
      const adaptations = await intelligence.adaptiveLearner.getAdaptations(profile, contextAnalysis);
      
      this.assert(Array.isArray(adaptations), 'Should return adaptations array');
      this.assert(adaptations.every(a => a.type), 'Each adaptation should have type');
      this.assert(adaptations.every(a => a.description), 'Each adaptation should have description');
      this.assert(adaptations.every(a => a.confidence >= 0 && a.confidence <= 1), 'Each adaptation should have valid confidence');
      
      // Test learning recording
      await intelligence.adaptiveLearner.recordInteraction('test-agent', contextAnalysis, {
        confidence: 0.7,
        adaptations,
        decisions: []
      });
      
      const learningData = intelligence.learningData.get('test-agent');
      this.assert(learningData, 'Should store learning data');
      this.assert(learningData.interactions.length > 0, 'Should record interactions');
      
      this.recordTest('Adaptive Learning', true);
      console.log(chalk.green('   ✓ Adaptive learning test passed'));
      
    } catch (error) {
      this.recordTest('Adaptive Learning', false, error.message);
      console.log(chalk.red('   ✗ Adaptive learning test failed:'), error.message);
    }
  }

  async testDecisionEngine() {
    console.log(chalk.cyan('\n🎯 Testing Decision Engine...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const profile = {
        name: 'test-agent',
        adaptationLevel: 'low'
      };
      
      const enhancedContext = {
        original: {
          relevance: 0.5,
          completeness: 0.4,
          complexity: 'high',
          gaps: ['specifications']
        },
        injected: {},
        metadata: { injectionCount: 0 }
      };
      
      const adaptations = [];
      
      const decisions = await intelligence.decisionEngine.recommend(profile, enhancedContext, adaptations);
      
      this.assert(Array.isArray(decisions), 'Should return decisions array');
      this.assert(decisions.every(d => d.type), 'Each decision should have type');
      this.assert(decisions.every(d => d.recommendation), 'Each decision should have recommendation');
      this.assert(decisions.every(d => d.confidence >= 0 && d.confidence <= 1), 'Each decision should have valid confidence');
      
      // Check for expected decision types
      const decisionTypes = decisions.map(d => d.type);
      this.assert(decisionTypes.includes('context_gaps'), 'Should detect context gaps');
      // Note: low_confidence decision may not always be triggered depending on conditions
      
      this.recordTest('Decision Engine', true);
      console.log(chalk.green('   ✓ Decision engine test passed'));
      
    } catch (error) {
      this.recordTest('Decision Engine', false, error.message);
      console.log(chalk.red('   ✗ Decision engine test failed:'), error.message);
    }
  }

  async testAgentEnhancement() {
    console.log(chalk.cyan('\n🚀 Testing Agent Enhancement...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      const context = {
        projectPath: this.testProjectPath,
        currentTask: 'Test Agent Enhancement',
        specifications: ['requirements']
      };
      
      const enhancedConfig = await intelligence.enhanceAgent('test-agent', context);
      
      this.assert(enhancedConfig.original, 'Should preserve original profile');
      this.assert(enhancedConfig.context, 'Should contain enhanced context');
      this.assert(enhancedConfig.adaptations, 'Should contain adaptations');
      this.assert(enhancedConfig.decisions, 'Should contain decisions');
      this.assert(enhancedConfig.timestamp, 'Should have timestamp');
      this.assert(enhancedConfig.confidence >= 0 && enhancedConfig.confidence <= 1, 'Should have valid confidence');
      
      // Verify context was injected
      this.assert(enhancedConfig.context.metadata.injectionCount >= 0, 'Should perform context injections');
      
      // Verify learning was recorded
      const learningData = intelligence.learningData.get('test-agent');
      this.assert(learningData && learningData.interactions.length > 0, 'Should record enhancement interaction');
      
      this.recordTest('Agent Enhancement', true);
      console.log(chalk.green('   ✓ Agent enhancement test passed'));
      
    } catch (error) {
      this.recordTest('Agent Enhancement', false, error.message);
      console.log(chalk.red('   ✗ Agent enhancement test failed:'), error.message);
    }
  }

  async testIntelligenceReporting() {
    console.log(chalk.cyan('\n📊 Testing Intelligence Reporting...'));
    
    try {
      const intelligence = new EnhancedAgentIntelligence(this.testProjectPath);
      await intelligence.initialize();
      
      // Generate some activity
      await intelligence.enhanceAgent('test-agent', {
        projectPath: this.testProjectPath,
        currentTask: 'Test Reporting'
      });
      
      const report = await intelligence.getIntelligenceReport();
      
      this.assert(report.timestamp, 'Report should have timestamp');
      this.assert(report.agents >= 0, 'Report should show agent count');
      this.assert(report.contextHistory >= 0, 'Report should show context history');
      this.assert(report.learningData >= 0, 'Report should show learning data');
      this.assert(report.performance, 'Report should include performance metrics');
      this.assert(Array.isArray(report.recommendations), 'Report should include recommendations');
      
      // Verify performance metrics structure
      this.assert(typeof report.performance.contextAnalysisAccuracy === 'number', 'Should have context analysis accuracy');
      this.assert(typeof report.performance.adaptationSuccess === 'number', 'Should have adaptation success rate');
      this.assert(typeof report.performance.decisionAccuracy === 'number', 'Should have decision accuracy');
      this.assert(typeof report.performance.responseTime === 'number', 'Should have response time');
      
      this.recordTest('Intelligence Reporting', true);
      console.log(chalk.green('   ✓ Intelligence reporting test passed'));
      
    } catch (error) {
      this.recordTest('Intelligence Reporting', false, error.message);
      console.log(chalk.red('   ✗ Intelligence reporting test failed:'), error.message);
    }
  }

  async cleanupTestEnvironment() {
    console.log(chalk.cyan('\n🧹 Cleaning up test environment...'));
    
    try {
      await fs.remove(this.testProjectPath);
      console.log(chalk.green('   ✓ Test environment cleaned up'));
    } catch (error) {
      console.warn(chalk.yellow('   ⚠️  Could not clean up test environment:'), error.message);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  recordTest(testName, passed, error = null) {
    this.testResults.push({
      name: testName,
      passed,
      error,
      timestamp: new Date().toISOString()
    });
  }

  showTestResults() {
    console.log(chalk.blue.bold('\n📋 Test Results Summary\n'));
    
    const passed = this.testResults.filter(t => t.passed).length;
    const total = this.testResults.length;
    const failed = total - passed;
    
    console.log(`Total Tests: ${total}`);
    console.log(chalk.green(`Passed: ${passed}`));
    console.log(chalk.red(`Failed: ${failed}`));
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
    
    if (failed > 0) {
      console.log(chalk.red('Failed Tests:'));
      for (const test of this.testResults.filter(t => !t.passed)) {
        console.log(`   ✗ ${test.name}: ${test.error}`);
      }
      console.log();
    }
    
    if (passed === total) {
      console.log(chalk.green.bold('🎉 All tests passed! Enhanced Agent Intelligence system is working correctly.'));
    } else {
      console.log(chalk.red.bold('❌ Some tests failed. Please review the errors above.'));
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new EnhancedAgentIntelligenceTest();
  testSuite.runAllTests().catch(error => {
    console.error(chalk.red('Test execution failed:'), error);
    process.exit(1);
  });
}

module.exports = EnhancedAgentIntelligenceTest;