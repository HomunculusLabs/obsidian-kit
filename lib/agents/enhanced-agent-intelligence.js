#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const EventEmitter = require('events');

/**
 * Enhanced Agent Intelligence System
 * Provides context-aware AI agent configurations with dynamic context injection
 */
class EnhancedAgentIntelligence extends EventEmitter {
  constructor(projectPath) {
    super();
    this.projectPath = projectPath;
    this.agentsPath = path.join(projectPath, 'agents');
    this.specifyPath = path.join(projectPath, '.specify');
    this.projectsPath = path.join(projectPath, '4 - Projects');
    
    // Context management
    this.contextCache = new Map();
    this.agentProfiles = new Map();
    this.contextHistory = [];
    this.learningData = new Map();
    
    // Intelligence components
    this.contextAnalyzer = new ContextAnalyzer(this);
    this.dynamicInjector = new DynamicContextInjector(this);
    this.adaptiveLearner = new AdaptiveLearner(this);
    this.decisionEngine = new DecisionEngine(this);
    
    this.initialized = false;
  }

  async initialize() {
    console.log(chalk.cyan('🧠 Initializing Enhanced Agent Intelligence...'));
    
    try {
      // Load agent configurations
      await this.loadAgentProfiles();
      
      // Initialize context analysis
      await this.contextAnalyzer.initialize();
      
      // Setup dynamic injection system
      await this.dynamicInjector.initialize();
      
      // Initialize adaptive learning
      await this.adaptiveLearner.initialize();
      
      // Initialize decision engine
      await this.decisionEngine.initialize();
      
      this.initialized = true;
      console.log(chalk.green('✅ Enhanced Agent Intelligence ready'));
      this.emit('initialized');
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize Enhanced Agent Intelligence:'), error.message);
      throw error;
    }
  }

  async loadAgentProfiles() {
    const agentFiles = await fs.readdir(this.agentsPath);
    
    for (const file of agentFiles) {
      if (file.endsWith('.md') && file !== 'universal-context.md' && file !== 'slash-commands.md') {
        const agentName = path.basename(file, '.md');
        const agentPath = path.join(this.agentsPath, file);
        const content = await fs.readFile(agentPath, 'utf8');
        
        const profile = this.parseAgentProfile(agentName, content);
        this.agentProfiles.set(agentName, profile);
      }
    }
    
    console.log(chalk.gray(`   ✓ Loaded ${this.agentProfiles.size} agent profiles`));
  }

  parseAgentProfile(name, content) {
    const profile = {
      name,
      type: this.detectAgentType(content),
      capabilities: this.extractCapabilities(content),
      context: this.extractContextRequirements(content),
      personality: this.extractPersonality(content),
      tools: this.extractTools(content),
      workflows: this.extractWorkflows(content),
      learningStyle: this.detectLearningStyle(content),
      adaptationLevel: 'medium' // Will be updated by adaptive learner
    };

    return profile;
  }

  detectAgentType(content) {
    if (content.includes('Claude Code')) return 'claude-code';
    if (content.includes('VS Code') || content.includes('OpenCode')) return 'opencode';
    if (content.includes('Cursor')) return 'cursor';
    if (content.includes('Copilot')) return 'copilot';
    return 'unknown';
  }

  extractCapabilities(content) {
    const capabilities = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('**') && (line.includes('File System') || line.includes('Git') || 
          line.includes('Bash') || line.includes('Task'))) {
        capabilities.push(line.replace(/\*\*/g, '').trim());
      }
    }
    
    return capabilities;
  }

  extractContextRequirements(content) {
    const context = {
      required: [],
      preferred: [],
      dynamic: []
    };

    // Extract context requirements from agent configuration
    if (content.includes('constitution')) context.required.push('constitution');
    if (content.includes('specifications')) context.required.push('specifications');
    if (content.includes('tasks')) context.required.push('tasks');
    if (content.includes('decisions')) context.preferred.push('decisions');
    if (content.includes('memory')) context.dynamic.push('memory');

    return context;
  }

  extractPersonality(content) {
    const personality = {
      style: 'professional',
      approach: 'balanced',
      communication: 'direct',
      principles: []
    };

    // Extract personality traits
    if (content.includes('Concise and Direct')) personality.communication = 'direct';
    if (content.includes('Action-Oriented')) personality.approach = 'action-oriented';
    if (content.includes('Context-Aware')) personality.style = 'context-aware';

    // Extract working principles
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.match(/^\d+\.\s+\*\*.*\*\*/)) {
        personality.principles.push(line.replace(/\*\*/g, '').replace(/^\d+\.\s+/, '').trim());
      }
    }

    return personality;
  }

  extractTools(content) {
    const tools = [];
    const toolKeywords = ['bash', 'git', 'file system', 'task management', 'mcp', 'api'];
    
    for (const keyword of toolKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        tools.push(keyword);
      }
    }
    
    return tools;
  }

  extractWorkflows(content) {
    const workflows = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('### `/') && line.includes('**')) {
        const command = line.match(/### `\/(\w+)/);
        if (command) {
          workflows.push({
            command: command[1],
            description: line.split('**')[1]?.replace('**', '').trim() || ''
          });
        }
      }
    }
    
    return workflows;
  }

  detectLearningStyle(content) {
    if (content.includes('Adaptive') || content.includes('Learning')) return 'adaptive';
    if (content.includes('Context-Aware')) return 'context-driven';
    if (content.includes('Spec-First')) return 'specification-driven';
    return 'standard';
  }

  // Main intelligence interface
  async enhanceAgent(agentName, context = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const profile = this.agentProfiles.get(agentName);
    if (!profile) {
      throw new Error(`Agent profile not found: ${agentName}`);
    }

    console.log(chalk.cyan(`🧠 Enhancing ${agentName} agent...`));

    // Analyze current context
    const contextAnalysis = await this.contextAnalyzer.analyze(context);
    
    // Inject dynamic context
    const enhancedContext = await this.dynamicInjector.inject(profile, contextAnalysis);
    
    // Apply adaptive learning
    const adaptations = await this.adaptiveLearner.getAdaptations(profile, contextAnalysis);
    
    // Generate decision recommendations
    const decisions = await this.decisionEngine.recommend(profile, enhancedContext, adaptations);
    
    // Create enhanced configuration
    const enhancedConfig = {
      original: profile,
      context: enhancedContext,
      adaptations,
      decisions,
      timestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(profile, contextAnalysis, adaptations)
    };

    // Store learning data
    await this.adaptiveLearner.recordInteraction(agentName, context, enhancedConfig);

    return enhancedConfig;
  }

  calculateConfidence(profile, contextAnalysis, adaptations) {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on context match
    if (contextAnalysis.relevance > 0.8) confidence += 0.2;
    if (contextAnalysis.completeness > 0.7) confidence += 0.1;
    
    // Boost confidence based on adaptation quality
    if (adaptations.length > 0) confidence += 0.1;
    if (adaptations.some(a => a.confidence > 0.8)) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Context management
  async updateContext(newContext) {
    const contextId = Date.now().toString();
    const contextEntry = {
      id: contextId,
      timestamp: new Date().toISOString(),
      context: newContext,
      analysis: await this.contextAnalyzer.analyze(newContext)
    };

    this.contextHistory.push(contextEntry);
    this.contextCache.set(contextId, contextEntry);

    // Keep only last 100 context entries
    if (this.contextHistory.length > 100) {
      this.contextHistory.shift();
    }

    this.emit('contextUpdated', contextEntry);
    return contextId;
  }

  async getContextHistory(limit = 10) {
    return this.contextHistory.slice(-limit);
  }

  // Agent management
  async getAgentProfile(agentName) {
    return this.agentProfiles.get(agentName);
  }

  async getAllAgentProfiles() {
    return Array.from(this.agentProfiles.values());
  }

  async updateAgentProfile(agentName, updates) {
    const profile = this.agentProfiles.get(agentName);
    if (!profile) {
      throw new Error(`Agent profile not found: ${agentName}`);
    }

    Object.assign(profile, updates);
    this.agentProfiles.set(agentName, profile);
    
    // Save to file
    const agentPath = path.join(this.agentsPath, `${agentName}.md`);
    const content = await fs.readFile(agentPath, 'utf8');
    const updatedContent = this.updateAgentContent(content, updates);
    await fs.writeFile(agentPath, updatedContent);

    this.emit('profileUpdated', { agentName, profile, updates });
  }

  updateAgentContent(content, updates) {
    // Simple content update - in production, this would be more sophisticated
    let updatedContent = content;

    if (updates.capabilities) {
      // Update capabilities section
      const capabilitiesSection = updates.capabilities.map(cap => `- **${cap}**`).join('\n');
      updatedContent = updatedContent.replace(
        /### Recommended Extensions[\s\S]*?(?=\n###|\n##|$)/,
        `### Recommended Extensions\n${capabilitiesSection}\n`
      );
    }

    return updatedContent;
  }

  // Analytics and reporting
  async getIntelligenceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      agents: this.agentProfiles.size,
      contextHistory: this.contextHistory.length,
      learningData: this.learningData.size,
      performance: await this.getPerformanceMetrics(),
      recommendations: await this.generateRecommendations()
    };

    return report;
  }

  async getPerformanceMetrics() {
    const metrics = {
      contextAnalysisAccuracy: 0.85, // Placeholder
      adaptationSuccess: 0.78, // Placeholder
      decisionAccuracy: 0.82, // Placeholder
      responseTime: 150 // ms
    };

    // Calculate real metrics from learning data
    if (this.learningData.size > 0) {
      let totalAdaptations = 0;
      let successfulAdaptations = 0;

      for (const [agent, data] of this.learningData) {
        if (data.interactions) {
          totalAdaptations += data.interactions.length;
          successfulAdaptations += data.interactions.filter(i => i.success).length;
        }
      }

      if (totalAdaptations > 0) {
        metrics.adaptationSuccess = successfulAdaptations / totalAdaptations;
      }
    }

    return metrics;
  }

  async generateRecommendations() {
    const recommendations = [];

    // Analyze agent performance
    for (const [agentName, profile] of this.agentProfiles) {
      const learningData = this.learningData.get(agentName);
      if (learningData && learningData.interactions) {
        const recentInteractions = learningData.interactions.slice(-10);
        const avgConfidence = recentInteractions.reduce((sum, i) => sum + i.confidence, 0) / recentInteractions.length;

        if (avgConfidence < 0.6) {
          recommendations.push({
            type: 'agent_improvement',
            agent: agentName,
            message: `Consider updating ${agentName} configuration for better context handling`,
            priority: 'medium'
          });
        }
      }
    }

    return recommendations;
  }
}

/**
 * Context Analyzer - Analyzes project context and agent requirements
 */
class ContextAnalyzer {
  constructor(intelligence) {
    this.intelligence = intelligence;
  }

  async initialize() {
    console.log(chalk.gray('   ✓ Context Analyzer initialized'));
  }

  async analyze(context) {
    const analysis = {
      relevance: 0,
      completeness: 0,
      complexity: 'medium',
      entities: [],
      relationships: [],
      gaps: []
    };

    // Analyze project structure
    if (context.projectPath) {
      analysis.entities.push({ type: 'project', path: context.projectPath });
    }

    // Analyze current task
    if (context.currentTask) {
      analysis.entities.push({ type: 'task', id: context.currentTask });
      analysis.completeness += 0.3;
    }

    // Analyze specifications
    if (context.specifications) {
      analysis.entities.push({ type: 'specifications', count: context.specifications.length });
      analysis.completeness += 0.3;
    }

    // Analyze available context
    if (context.availableContext) {
      analysis.completeness += 0.4;
    }

    // Calculate relevance based on entity overlap
    analysis.relevance = Math.min(analysis.completeness, 1.0);

    // Identify gaps
    if (!context.currentTask) analysis.gaps.push('current_task');
    if (!context.specifications) analysis.gaps.push('specifications');
    if (!context.projectPath) analysis.gaps.push('project_path');

    return analysis;
  }
}

/**
 * Dynamic Context Injector - Injects relevant context into agent configurations
 */
class DynamicContextInjector {
  constructor(intelligence) {
    this.intelligence = intelligence;
    this.injectionStrategies = new Map();
  }

  async initialize() {
    // Setup injection strategies
    this.injectionStrategies.set('constitution', this.injectConstitution.bind(this));
    this.injectionStrategies.set('specifications', this.injectSpecifications.bind(this));
    this.injectionStrategies.set('tasks', this.injectTasks.bind(this));
    this.injectionStrategies.set('memory', this.injectMemory.bind(this));
    
    console.log(chalk.gray('   ✓ Dynamic Context Injector initialized'));
  }

  async inject(profile, contextAnalysis) {
    const enhancedContext = {
      original: contextAnalysis,
      injected: {},
      metadata: {
        injectionCount: 0,
        strategies: []
      }
    };

    // Inject required context
    for (const requirement of profile.context.required) {
      const strategy = this.injectionStrategies.get(requirement);
      if (strategy) {
        const injected = await strategy(contextAnalysis);
        if (injected) {
          enhancedContext.injected[requirement] = injected;
          enhancedContext.metadata.injectionCount++;
          enhancedContext.metadata.strategies.push(requirement);
        }
      }
    }

    // Inject preferred context if available
    for (const preference of profile.context.preferred) {
      if (enhancedContext.metadata.injectionCount < 5) { // Limit injections
        const strategy = this.injectionStrategies.get(preference);
        if (strategy) {
          const injected = await strategy(contextAnalysis);
          if (injected) {
            enhancedContext.injected[preference] = injected;
            enhancedContext.metadata.injectionCount++;
            enhancedContext.metadata.strategies.push(preference);
          }
        }
      }
    }

    return enhancedContext;
  }

  async injectConstitution(contextAnalysis) {
    const constitutionPath = path.join(this.intelligence.specifyPath, 'memory', 'constitution.md');
    if (await fs.pathExists(constitutionPath)) {
      const content = await fs.readFile(constitutionPath, 'utf8');
      return {
        type: 'constitution',
        path: constitutionPath,
        summary: this.extractSummary(content),
        principles: this.extractPrinciples(content)
      };
    }
    return null;
  }

  async injectSpecifications(contextAnalysis) {
    const specsPath = path.join(this.intelligence.specifyPath, 'specs');
    if (await fs.pathExists(specsPath)) {
      const specFiles = await fs.readdir(specsPath);
      const specifications = [];

      for (const file of specFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(specsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          specifications.push({
            name: path.basename(file, '.md'),
            path: filePath,
            summary: this.extractSummary(content)
          });
        }
      }

      return {
        type: 'specifications',
        count: specifications.length,
        items: specifications
      };
    }
    return null;
  }

  async injectTasks(contextAnalysis) {
    const tasksBasePath = path.join(this.intelligence.projectsPath, 'Tasks.base');
    if (await fs.pathExists(tasksBasePath)) {
      const content = await fs.readFile(tasksBasePath, 'utf8');
      const tasks = this.parseTasks(content);
      
      return {
        type: 'tasks',
        count: tasks.length,
        items: tasks,
        active: tasks.filter(t => t.status === 'todo' || t.status === 'in-progress')
      };
    }
    return null;
  }

  async injectMemory(contextAnalysis) {
    const memoryPath = path.join(this.intelligence.specifyPath, 'memory');
    if (await fs.pathExists(memoryPath)) {
      const memoryFiles = await fs.readdir(memoryPath);
      const memories = [];

      for (const file of memoryFiles) {
        if (file.endsWith('.md')) {
          const filePath = path.join(memoryPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          memories.push({
            name: path.basename(file, '.md'),
            path: filePath,
            summary: this.extractSummary(content)
          });
        }
      }

      return {
        type: 'memory',
        count: memories.length,
        items: memories
      };
    }
    return null;
  }

  extractSummary(content) {
    const lines = content.split('\n');
    const summaryLines = lines.filter(line => 
      line.startsWith('#') || line.startsWith('##') || line.length > 50
    ).slice(0, 3);
    return summaryLines.join(' ').replace(/#/g, '').trim();
  }

  extractPrinciples(content) {
    const principles = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+/)) {
        principles.push(line.replace(/^\d+\.\s+/, '').trim());
      }
    }
    
    return principles;
  }

  parseTasks(content) {
    const tasks = [];
    const lines = content.split('\n');
    let currentTask = null;

    for (const line of lines) {
      if (line.startsWith('- [[') && line.includes(']]')) {
        if (currentTask) tasks.push(currentTask);
        
        const match = line.match(/\[\[([^\]]+)\]\]/);
        currentTask = {
          name: match ? match[1] : line,
          status: 'todo',
          priority: 'medium'
        };
      } else if (currentTask && line.includes('status::')) {
        currentTask.status = line.match(/status::\s*(\w+)/)?.[1] || 'todo';
      } else if (currentTask && line.includes('priority::')) {
        currentTask.priority = line.match(/priority::\s*(\w+)/)?.[1] || 'medium';
      }
    }

    if (currentTask) tasks.push(currentTask);
    return tasks;
  }
}

/**
 * Adaptive Learner - Learns from agent interactions and improves configurations
 */
class AdaptiveLearner {
  constructor(intelligence) {
    this.intelligence = intelligence;
    this.learningRate = 0.1;
    this.adaptationThreshold = 0.7;
  }

  async initialize() {
    console.log(chalk.gray('   ✓ Adaptive Learner initialized'));
  }

  async getAdaptations(profile, contextAnalysis) {
    const adaptations = [];
    const learningData = this.intelligence.learningData.get(profile.name) || { interactions: [] };

    // Analyze performance patterns
    const patterns = this.analyzePatterns(learningData.interactions);
    
    // Generate adaptations based on patterns
    if (patterns.lowConfidenceContexts.length > 0) {
      adaptations.push({
        type: 'context_enhancement',
        description: 'Enhance context handling for specific scenarios',
        confidence: 0.8,
        changes: this.generateContextEnhancements(patterns.lowConfidenceContexts)
      });
    }

    if (patterns.frequentGaps.length > 0) {
      adaptations.push({
        type: 'gap_filling',
        description: 'Add missing context requirements',
        confidence: 0.7,
        changes: this.generateGapFillers(patterns.frequentGaps)
      });
    }

    if (patterns.suboptimalDecisions.length > 0) {
      adaptations.push({
        type: 'decision_improvement',
        description: 'Improve decision-making patterns',
        confidence: 0.75,
        changes: this.generateDecisionImprovements(patterns.suboptimalDecisions)
      });
    }

    return adaptations;
  }

  analyzePatterns(interactions) {
    const patterns = {
      lowConfidenceContexts: [],
      frequentGaps: [],
      suboptimalDecisions: []
    };

    for (const interaction of interactions.slice(-20)) { // Analyze last 20 interactions
      if (interaction.confidence < 0.6) {
        patterns.lowConfidenceContexts.push(interaction.context);
      }

      if (interaction.contextAnalysis && interaction.contextAnalysis.gaps) {
        patterns.frequentGaps.push(...interaction.contextAnalysis.gaps);
      }

      if (interaction.outcome === 'suboptimal') {
        patterns.suboptimalDecisions.push(interaction.decisions);
      }
    }

    // Count frequency of gaps
    const gapCounts = {};
    for (const gap of patterns.frequentGaps) {
      gapCounts[gap] = (gapCounts[gap] || 0) + 1;
    }
    
    patterns.frequentGaps = Object.entries(gapCounts)
      .filter(([_, count]) => count > 2)
      .map(([gap, _]) => gap);

    return patterns;
  }

  generateContextEnhancements(lowConfidenceContexts) {
    const enhancements = [];
    
    // Analyze common patterns in low confidence contexts
    const contextTypes = lowConfidenceContexts.map(c => c.type);
    const commonTypes = this.getMostCommon(contextTypes);
    
    for (const type of commonTypes) {
      enhancements.push({
        area: 'context_handling',
        improvement: `Enhance ${type} context processing`,
        implementation: 'Add specialized context analysis for ' + type
      });
    }

    return enhancements;
  }

  generateGapFillers(frequentGaps) {
    const fillers = [];
    
    for (const gap of frequentGaps) {
      fillers.push({
        gap: gap,
        solution: `Add ${gap} to required context`,
        implementation: `Update agent profile to require ${gap}`
      });
    }

    return fillers;
  }

  generateDecisionImprovements(suboptimalDecisions) {
    const improvements = [];
    
    // Analyze common decision patterns
    const decisionTypes = suboptimalDecisions.map(d => d.type);
    const commonTypes = this.getMostCommon(decisionTypes);
    
    for (const type of commonTypes) {
      improvements.push({
        area: 'decision_making',
        improvement: `Enhance ${type} decision logic`,
        implementation: 'Add specialized decision rules for ' + type
      });
    }

    return improvements;
  }

  getMostCommon(items) {
    const counts = {};
    for (const item of items) {
      counts[item] = (counts[item] || 0) + 1;
    }
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([item]) => item);
  }

  async recordInteraction(agentName, context, enhancedConfig) {
    if (!this.intelligence.learningData.has(agentName)) {
      this.intelligence.learningData.set(agentName, { interactions: [] });
    }

    const agentData = this.intelligence.learningData.get(agentName);
    agentData.interactions.push({
      timestamp: new Date().toISOString(),
      context,
      enhancedConfig,
      confidence: enhancedConfig.confidence,
      outcome: 'pending' // Will be updated when feedback is received
    });

    // Keep only last 50 interactions per agent
    if (agentData.interactions.length > 50) {
      agentData.interactions.shift();
    }
  }

  async recordFeedback(agentName, interactionId, outcome, feedback) {
    const agentData = this.intelligence.learningData.get(agentName);
    if (!agentData) return;

    const interaction = agentData.interactions.find(i => i.id === interactionId);
    if (interaction) {
      interaction.outcome = outcome;
      interaction.feedback = feedback;
      interaction.confidence = this.adjustConfidence(interaction.confidence, outcome);
    }
  }

  adjustConfidence(currentConfidence, outcome) {
    const adjustment = outcome === 'successful' ? 0.1 : -0.1;
    return Math.max(0, Math.min(1, currentConfidence + adjustment));
  }
}

/**
 * Decision Engine - Provides intelligent decision recommendations
 */
class DecisionEngine {
  constructor(intelligence) {
    this.intelligence = intelligence;
    this.decisionRules = new Map();
    this.decisionHistory = [];
  }

  async initialize() {
    // Setup decision rules
    this.setupDecisionRules();
    console.log(chalk.gray('   ✓ Decision Engine initialized'));
  }

  setupDecisionRules() {
    // Context-based decisions
    this.decisionRules.set('high_complexity', {
      condition: (context) => context.complexity === 'high',
      recommendation: 'Use comprehensive context injection and enable adaptive learning',
      confidence: 0.8
    });

    this.decisionRules.set('low_confidence', {
      condition: (profile) => profile.adaptationLevel === 'low',
      recommendation: 'Increase adaptation level and enhance context requirements',
      confidence: 0.7
    });

    this.decisionRules.set('missing_specifications', {
      condition: (context) => context.gaps.includes('specifications'),
      recommendation: 'Prioritize specification creation before implementation',
      confidence: 0.9
    });

    this.decisionRules.set('task_overload', {
      condition: (context) => context.active && context.active.length > 10,
      recommendation: 'Enable task prioritization and focus on critical path',
      confidence: 0.8
    });
  }

  async recommend(profile, enhancedContext, adaptations) {
    const recommendations = [];
    const context = enhancedContext.original;

    // Apply decision rules
    for (const [ruleName, rule] of this.decisionRules) {
      if (rule.condition(context)) {
        recommendations.push({
          type: ruleName,
          recommendation: rule.recommendation,
          confidence: rule.confidence,
          reasoning: this.generateReasoning(ruleName, context)
        });
      }
    }

    // Context-specific recommendations
    if (context.gaps.length > 0) {
      recommendations.push({
        type: 'context_gaps',
        recommendation: `Address missing context: ${context.gaps.join(', ')}`,
        confidence: 0.8,
        reasoning: 'Missing context may lead to suboptimal decisions'
      });
    }

    if (adaptations.length > 0) {
      recommendations.push({
        type: 'apply_adaptations',
        recommendation: `Apply ${adaptations.length} suggested adaptations`,
        confidence: 0.7,
        reasoning: 'Adaptations can improve agent performance'
      });
    }

    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence);

    // Store in history
    this.decisionHistory.push({
      timestamp: new Date().toISOString(),
      agent: profile.name,
      context,
      recommendations
    });

    return recommendations;
  }

  generateReasoning(ruleName, context) {
    const reasoningMap = {
      'high_complexity': 'High complexity requires more comprehensive context and learning capabilities',
      'low_confidence': 'Low adaptation confidence suggests need for enhanced context requirements',
      'missing_specifications': 'Specifications are essential for informed decision-making',
      'task_overload': 'Too many active tasks require prioritization mechanisms'
    };

    return reasoningMap[ruleName] || 'Based on context analysis and agent capabilities';
  }

  async getDecisionHistory(limit = 10) {
    return this.decisionHistory.slice(-limit);
  }
}

module.exports = EnhancedAgentIntelligence;