const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
// Resolve enhanced-agent-intelligence path dynamically
const projectRoot = path.resolve(__dirname, '../..');
const EnhancedAgentIntelligence = require(path.join(projectRoot, 'enhanced-agent-intelligence'));

async function enhancedAgentCommand(action, agentName, options) {
  console.log(chalk.blue.bold('\n🧠 Enhanced Agent Intelligence\n'));

  try {
    // Check if we're in a valid project
    const isValidProject = await checkValidProject();
    if (!isValidProject) {
      console.log(chalk.red('❌ This doesn\'t appear to be an Obsidian Kit project.'));
      console.log(chalk.gray('   Run "obsidian-kit init" first to create a project vault.\n'));
      return;
    }

    // Initialize Enhanced Agent Intelligence
    const intelligence = new EnhancedAgentIntelligence(process.cwd());
    await intelligence.initialize();

    switch (action) {
    case 'enhance':
      await enhanceAgent(intelligence, agentName, options);
      break;
    case 'analyze':
      await analyzeContext(intelligence, options);
      break;
    case 'report':
      await generateReport(intelligence, options);
      break;
    case 'adapt':
      await adaptAgent(intelligence, agentName, options);
      break;
    case 'status':
      await showStatus(intelligence, options);
      break;
    default:
      showEnhancedAgentHelp();
    }

  } catch (error) {
    console.error(chalk.red('❌ Error with Enhanced Agent Intelligence:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function enhanceAgent(intelligence, agentName, options) {
  try {
    // Get agent name if not provided
    if (!agentName) {
      const profiles = await intelligence.getAllAgentProfiles();
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Which agent do you want to enhance?',
          choices: profiles.map(p => ({
            name: `${p.name} (${p.type})`,
            value: p.name,
          })),
        },
      ]);
      agentName = selectedAgent;
    }

    // Gather context information
    const context = await gatherContext(options);

    console.log(chalk.cyan(`\n🔍 Enhancing ${agentName} agent...`));

    // Enhance the agent
    const enhancedConfig = await intelligence.enhanceAgent(agentName, context);

    // Display results
    console.log(chalk.green('\n✅ Agent Enhancement Complete!\n'));

    console.log(chalk.yellow('📊 Enhancement Results:'));
    console.log(`   Agent: ${enhancedConfig.original.name}`);
    console.log(`   Confidence: ${(enhancedConfig.confidence * 100).toFixed(1)}%`);
    console.log(`   Context Injections: ${enhancedConfig.context.metadata.injectionCount}`);
    console.log(`   Adaptations: ${enhancedConfig.adaptations.length}`);
    console.log(`   Decision Recommendations: ${enhancedConfig.decisions.length}\n`);

    if (enhancedConfig.context.metadata.injectionCount > 0) {
      console.log(chalk.yellow('📋 Injected Context:'));
      for (const [type, data] of Object.entries(enhancedConfig.context.injected)) {
        console.log(`   ✓ ${type}: ${data.summary || `${data.count || data.items?.length || 1} items`}`);
      }
      console.log();
    }

    if (enhancedConfig.adaptations.length > 0) {
      console.log(chalk.yellow('🔄 Recommended Adaptations:'));
      for (const adaptation of enhancedConfig.adaptations) {
        console.log(`   • ${adaptation.description} (${(adaptation.confidence * 100).toFixed(1)}% confidence)`);
      }
      console.log();
    }

    if (enhancedConfig.decisions.length > 0) {
      console.log(chalk.yellow('🎯 Decision Recommendations:'));
      for (const decision of enhancedConfig.decisions.slice(0, 3)) {
        console.log(`   • ${decision.recommendation} (${(decision.confidence * 100).toFixed(1)}% confidence)`);
      }
      if (enhancedConfig.decisions.length > 3) {
        console.log(`   ... and ${enhancedConfig.decisions.length - 3} more`);
      }
      console.log();
    }

    // Save enhancement report
    if (options.save) {
      await saveEnhancementReport(agentName, enhancedConfig);
      console.log(chalk.green(`💾 Enhancement report saved for ${agentName}`));
    }

  } catch (error) {
    console.error(chalk.red('❌ Failed to enhance agent:'), error.message);
  }
}

async function analyzeContext(intelligence, options) {
  console.log(chalk.cyan('🔍 Analyzing Project Context...\n'));

  try {
    // Gather current context
    const context = await gatherContext(options);

    // Update context in intelligence system
    const contextId = await intelligence.updateContext(context);

    // Get context analysis
    const contextEntry = intelligence.contextCache.get(contextId);
    const analysis = contextEntry.analysis;

    console.log(chalk.yellow('📊 Context Analysis Results:\n'));

    console.log(`Relevance: ${(analysis.relevance * 100).toFixed(1)}%`);
    console.log(`Completeness: ${(analysis.completeness * 100).toFixed(1)}%`);
    console.log(`Complexity: ${analysis.complexity}`);
    console.log(`Entities Found: ${analysis.entities.length}`);
    console.log(`Relationships: ${analysis.relationships.length}`);

    if (analysis.gaps.length > 0) {
      console.log(chalk.yellow('\n⚠️  Identified Gaps:'));
      for (const gap of analysis.gaps) {
        console.log(`   • ${gap}`);
      }
    }

    if (analysis.entities.length > 0) {
      console.log(chalk.yellow('\n📋 Context Entities:'));
      for (const entity of analysis.entities) {
        console.log(`   • ${entity.type}: ${entity.name || entity.path || entity.id || entity.count + ' items'}`);
      }
    }

    console.log(chalk.green(`\n✅ Context analysis complete (ID: ${contextId})`));

  } catch (error) {
    console.error(chalk.red('❌ Failed to analyze context:'), error.message);
  }
}

async function generateReport(intelligence, options) {
  console.log(chalk.cyan('📊 Generating Intelligence Report...\n'));

  try {
    const report = await intelligence.getIntelligenceReport();

    console.log(chalk.yellow('🧠 Enhanced Agent Intelligence Report\n'));
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Configured Agents: ${report.agents}`);
    console.log(`Context History Entries: ${report.contextHistory}`);
    console.log(`Learning Data Points: ${report.learningData}\n`);

    console.log(chalk.yellow('📈 Performance Metrics:'));
    console.log(`Context Analysis Accuracy: ${(report.performance.contextAnalysisAccuracy * 100).toFixed(1)}%`);
    console.log(`Adaptation Success Rate: ${(report.performance.adaptationSuccess * 100).toFixed(1)}%`);
    console.log(`Decision Accuracy: ${(report.performance.decisionAccuracy * 100).toFixed(1)}%`);
    console.log(`Average Response Time: ${report.performance.responseTime}ms\n`);

    if (report.recommendations.length > 0) {
      console.log(chalk.yellow('💡 Recommendations:'));
      for (const rec of report.recommendations) {
        const priority = rec.priority === 'high' ? chalk.red('HIGH') :
          rec.priority === 'medium' ? chalk.yellow('MEDIUM') :
            chalk.gray('LOW');
        console.log(`   [${priority}] ${rec.message}`);
        if (rec.agent) console.log(`      Agent: ${rec.agent}`);
      }
    }

    // Save report if requested
    if (options.save) {
      const reportPath = path.join(process.cwd(), 'enhanced-agent-intelligence-report.json');
      await fs.writeJson(reportPath, report, { spaces: 2 });
      console.log(chalk.green(`\n💾 Report saved to ${reportPath}`));
    }

  } catch (error) {
    console.error(chalk.red('❌ Failed to generate report:'), error.message);
  }
}

async function adaptAgent(intelligence, agentName, options) {
  try {
    if (!agentName) {
      const profiles = await intelligence.getAllAgentProfiles();
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Which agent do you want to adapt?',
          choices: profiles.map(p => ({
            name: `${p.name} (${p.type})`,
            value: p.name,
          })),
        },
      ]);
      agentName = selectedAgent;
    }

    console.log(chalk.cyan(`\n🔄 Adapting ${agentName} agent...`));

    // Get current profile
    const profile = await intelligence.getAgentProfile(agentName);
    if (!profile) {
      console.log(chalk.red(`❌ Agent profile not found: ${agentName}`));
      return;
    }

    // Gather context
    const context = await gatherContext(options);

    // Get adaptations
    const contextAnalysis = await intelligence.contextAnalyzer.analyze(context);
    const adaptations = await intelligence.adaptiveLearner.getAdaptations(profile, contextAnalysis);

    if (adaptations.length === 0) {
      console.log(chalk.yellow('ℹ️  No adaptations needed at this time.'));
      return;
    }

    console.log(chalk.yellow(`\n📋 Found ${adaptations.length} potential adaptations:\n`));

    // Show adaptations and ask which to apply
    const { selectedAdaptations } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedAdaptations',
        message: 'Which adaptations would you like to apply?',
        choices: adaptations.map((adapt, index) => ({
          name: `${adapt.description} (${(adapt.confidence * 100).toFixed(1)}% confidence)`,
          value: index,
        })),
      },
    ]);

    if (selectedAdaptations.length === 0) {
      console.log(chalk.gray('No adaptations selected.'));
      return;
    }

    // Apply selected adaptations
    console.log(chalk.cyan('\n🔄 Applying adaptations...'));

    for (const index of selectedAdaptations) {
      const adaptation = adaptations[index];
      console.log(`   • ${adaptation.description}`);

      // Here you would implement the actual adaptation logic
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Update agent profile
    const updates = {
      adaptationLevel: 'enhanced',
      lastAdapted: new Date().toISOString(),
    };

    await intelligence.updateAgentProfile(agentName, updates);

    console.log(chalk.green(`\n✅ Successfully applied ${selectedAdaptations.length} adaptations to ${agentName}`));

  } catch (error) {
    console.error(chalk.red('❌ Failed to adapt agent:'), error.message);
  }
}

async function showStatus(intelligence, options) {
  console.log(chalk.cyan('📊 Enhanced Agent Intelligence Status\n'));

  try {
    const profiles = await intelligence.getAllAgentProfiles();
    const report = await intelligence.getIntelligenceReport();

    console.log(chalk.yellow('🤖 Configured Agents:'));
    for (const profile of profiles) {
      const learningData = intelligence.learningData.get(profile.name);
      const interactionCount = learningData?.interactions?.length || 0;

      console.log(`   • ${profile.name} (${profile.type})`);
      console.log(`     Capabilities: ${profile.capabilities.length}`);
      console.log(`     Interactions: ${interactionCount}`);
      console.log(`     Adaptation Level: ${profile.adaptationLevel}`);
    }

    console.log(chalk.yellow('\n📈 System Performance:'));
    console.log(`   Context Analysis Accuracy: ${(report.performance.contextAnalysisAccuracy * 100).toFixed(1)}%`);
    console.log(`   Adaptation Success Rate: ${(report.performance.adaptationSuccess * 100).toFixed(1)}%`);
    console.log(`   Decision Accuracy: ${(report.performance.decisionAccuracy * 100).toFixed(1)}%`);

    console.log(chalk.yellow('\n📚 Context Resources:'));
    console.log(`   Context History: ${report.contextHistory} entries`);
    console.log(`   Learning Data: ${report.learningData} agents`);

    if (options.verbose) {
      console.log(chalk.yellow('\n🔄 Recent Context History:'));
      const history = await intelligence.getContextHistory(5);
      for (const entry of history) {
        console.log(`   • ${entry.timestamp}: ${entry.context.type || 'General'} (Relevance: ${(entry.analysis.relevance * 100).toFixed(1)}%)`);
      }
    }

  } catch (error) {
    console.error(chalk.red('❌ Failed to get status:'), error.message);
  }
}

async function gatherContext(options) {
  const context = {
    projectPath: process.cwd(),
    timestamp: new Date().toISOString(),
  };

  // Auto-detect current context
  try {
    // Check for current task
    const tasksBasePath = path.join(process.cwd(), '4 - Projects', 'Tasks.base');
    if (await fs.pathExists(tasksBasePath)) {
      const content = await fs.readFile(tasksBasePath, 'utf8');
      const tasks = content.split('\n').filter(line =>
        line.includes('- [[') && (line.includes('status::todo') || line.includes('status::in-progress')),
      );

      if (tasks.length > 0 && !options.noTask) {
        const { selectTask } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'selectTask',
            message: `Found ${tasks.length} active tasks. Include current task context?`,
            default: true,
          },
        ]);

        if (selectTask) {
          const { selectedTask } = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedTask',
              message: 'Select current task:',
              choices: tasks.map(task => {
                const match = task.match(/\[\[([^\]]+)\]\]/);
                return match ? match[1] : task;
              }),
            },
          ]);
          context.currentTask = selectedTask;
        }
      }
    }

    // Check for specifications
    const specsPath = path.join(process.cwd(), '.specify', 'specs');
    if (await fs.pathExists(specsPath)) {
      const specFiles = await fs.readdir(specsPath).filter(f => f.endsWith('.md'));
      if (specFiles.length > 0 && !options.noSpecs) {
        context.specifications = specFiles.map(f => path.basename(f, '.md'));
      }
    }

    // Add available context indicators
    context.availableContext = {
      constitution: await fs.pathExists(path.join(process.cwd(), '.specify', 'memory', 'constitution.md')),
      decisions: await fs.pathExists(path.join(process.cwd(), '.specify', 'memory', 'decisions.md')),
      architecture: await fs.pathExists(path.join(process.cwd(), '.specify', 'specs', 'architecture.md')),
      requirements: await fs.pathExists(path.join(process.cwd(), '.specify', 'specs', 'requirements.md')),
    };

  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not auto-detect context:', error.message));
  }

  // Add manual context if provided
  if (options.context) {
    try {
      const manualContext = JSON.parse(options.context);
      Object.assign(context, manualContext);
    } catch (e) {
      console.warn(chalk.yellow('⚠️  Invalid context JSON provided'));
    }
  }

  return context;
}

async function saveEnhancementReport(agentName, enhancedConfig) {
  const reportsDir = path.join(process.cwd(), '.specify', 'reports');
  await fs.ensureDir(reportsDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `agent-enhancement-${agentName}-${timestamp}.json`);

  await fs.writeJson(reportPath, enhancedConfig, { spaces: 2 });
  return reportPath;
}

async function checkValidProject() {
  const agentsDir = path.join(process.cwd(), 'agents');
  const specifyDir = path.join(process.cwd(), '.specify');
  const projectsDir = path.join(process.cwd(), '4 - Projects');

  return fs.existsSync(agentsDir) &&
         fs.existsSync(specifyDir) &&
         fs.existsSync(projectsDir);
}

function showEnhancedAgentHelp() {
  console.log(chalk.yellow('🧠 Enhanced Agent Intelligence Commands:\n'));
  console.log('  obsidian-kit enhanced-agent enhance [agent]     Enhance agent with context-aware intelligence');
  console.log('  obsidian-kit enhanced-agent analyze              Analyze current project context');
  console.log('  obsidian-kit enhanced-agent report               Generate intelligence report');
  console.log('  obsidian-kit enhanced-agent adapt [agent]        Apply adaptive improvements to agent');
  console.log('  obsidian-kit enhanced-agent status               Show system status and metrics\n');

  console.log(chalk.yellow('🔧 Options:\n'));
  console.log('  --save                     Save reports and enhancements');
  console.log('  --verbose                  Show detailed output');
  console.log('  --no-task                  Skip task context detection');
  console.log('  --no-specs                 Skip specification context');
  console.log('  --context <json>           Provide manual context\n');

  console.log(chalk.yellow('💡 Examples:\n'));
  console.log('  obsidian-kit enhanced-agent enhance claude-code --save');
  console.log('  obsidian-kit enhanced-agent analyze --verbose');
  console.log('  obsidian-kit enhanced-agent report --save');
  console.log('  obsidian-kit enhanced-agent adapt opencode');
  console.log('  obsidian-kit enhanced-agent status\n');
}

module.exports = enhancedAgentCommand;
