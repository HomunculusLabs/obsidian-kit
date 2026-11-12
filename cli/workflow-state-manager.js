const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class WorkflowStateManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.stateFile = path.join(projectPath, '.obsidian-kit', 'workflow-state.json');
    this.historyFile = path.join(projectPath, '.obsidian-kit', 'workflow-history.json');
    this.templatesDir = path.join(projectPath, '.obsidian-kit', 'workflow-templates');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    await fs.ensureDir(path.dirname(this.stateFile));
    await fs.ensureDir(this.templatesDir);
  }

  // Load current workflow state
  async loadState() {
    try {
      if (await fs.pathExists(this.stateFile)) {
        return await fs.readJson(this.stateFile);
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not load workflow state:', error.message));
    }
    return this.getDefaultState();
  }

  // Save workflow state
  async saveState(state) {
    try {
      await fs.writeJson(this.stateFile, state, { spaces: 2 });
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Failed to save workflow state:', error.message));
      return false;
    }
  }

  // Get default state structure
  getDefaultState() {
    return {
      currentPhase: null,
      phaseHistory: [],
      pausedWorkflows: [],
      completedPhases: [],
      workflowStartTime: null,
      lastActivity: null,
      userPreferences: {
        autoSave: true,
        showProgress: true,
        confirmBeforeAction: true,
      },
      phaseData: {},
    };
  }

  // Start a new workflow phase
  async startPhase(phaseName, data = {}) {
    const state = await this.loadState();
    
    // Save current phase to history if exists
    if (state.currentPhase) {
      state.phaseHistory.push({
        phase: state.currentPhase,
        startTime: state.phaseData[state.currentPhase]?.startTime,
        endTime: new Date().toISOString(),
        data: state.phaseData[state.currentPhase] || {},
      });
    }

    // Set new current phase
    state.currentPhase = phaseName;
    state.phaseData[phaseName] = {
      startTime: new Date().toISOString(),
      status: 'in-progress',
      progress: 0,
      ...data,
    };
    state.lastActivity = new Date().toISOString();

    if (!state.workflowStartTime) {
      state.workflowStartTime = state.lastActivity;
    }

    await this.saveState(state);
    return state;
  }

  // Update phase progress
  async updatePhaseProgress(progress, data = {}) {
    const state = await this.loadState();
    
    if (state.currentPhase && state.phaseData[state.currentPhase]) {
      state.phaseData[state.currentPhase].progress = progress;
      state.phaseData[state.currentPhase] = { ...state.phaseData[state.currentPhase], ...data };
      state.lastActivity = new Date().toISOString();
      
      await this.saveState(state);
    }
    
    return state;
  }

  // Complete current phase
  async completePhase(results = {}) {
    const state = await this.loadState();
    
    if (state.currentPhase) {
      const phaseData = state.phaseData[state.currentPhase];
      phaseData.status = 'completed';
      phaseData.endTime = new Date().toISOString();
      phaseData.results = results;
      
      state.completedPhases.push(state.currentPhase);
      state.phaseHistory.push({
        phase: state.currentPhase,
        startTime: phaseData.startTime,
        endTime: phaseData.endTime,
        status: 'completed',
        results,
      });
      
      state.currentPhase = null;
      state.lastActivity = new Date().toISOString();
      
      await this.saveState(state);
    }
    
    return state;
  }

  // Pause current workflow
  async pauseWorkflow(reason = '') {
    const state = await this.loadState();
    
    if (state.currentPhase) {
      state.pausedWorkflows.push({
        phase: state.currentPhase,
        data: state.phaseData[state.currentPhase],
        pausedAt: new Date().toISOString(),
        reason,
      });
      
      state.currentPhase = null;
      state.lastActivity = new Date().toISOString();
      
      await this.saveState(state);
    }
    
    return state;
  }

  // Resume a paused workflow
  async resumeWorkflow(phaseName) {
    const state = await this.loadState();
    
    const pausedIndex = state.pausedWorkflows.findIndex(w => w.phase === phaseName);
    if (pausedIndex !== -1) {
      const paused = state.pausedWorkflows.splice(pausedIndex, 1)[0];
      state.currentPhase = paused.phase;
      state.phaseData[phaseName] = { ...paused.data, status: 'resumed' };
      state.lastActivity = new Date().toISOString();
      
      await this.saveState(state);
      return state;
    }
    
    return null;
  }

  // Get workflow history
  async getHistory() {
    try {
      if (await fs.pathExists(this.historyFile)) {
        return await fs.readJson(this.historyFile);
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not load workflow history:', error.message));
    }
    return [];
  }

  // Add to history
  async addToHistory(entry) {
    const history = await this.getHistory();
    history.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    try {
      await fs.writeJson(this.historyFile, history, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red('❌ Failed to save workflow history:', error.message));
    }
  }

  // Save workflow template
  async saveTemplate(name, template) {
    const templateFile = path.join(this.templatesDir, `${name}.json`);
    
    try {
      await fs.writeJson(templateFile, {
        name,
        createdAt: new Date().toISOString(),
        ...template,
      }, { spaces: 2 });
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Failed to save template:', error.message));
      return false;
    }
  }

  // Load workflow template
  async loadTemplate(name) {
    const templateFile = path.join(this.templatesDir, `${name}.json`);
    
    try {
      if (await fs.pathExists(templateFile)) {
        return await fs.readJson(templateFile);
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to load template:', error.message));
    }
    
    return null;
  }

  // List available templates
  async listTemplates() {
    try {
      const files = await fs.readdir(this.templatesDir);
      const templates = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const template = await fs.readJson(path.join(this.templatesDir, file));
            templates.push({
              name: template.name,
              description: template.description,
              phases: template.phases?.length || 0,
              createdAt: template.createdAt,
            });
          } catch (error) {
            console.warn(chalk.yellow(`⚠️  Could not read template ${file}:`, error.message));
          }
        }
      }
      
      return templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error(chalk.red('❌ Failed to list templates:', error.message));
      return [];
    }
  }

  // Get workflow statistics
  async getStatistics() {
    const state = await this.loadState();
    const history = await this.getHistory();
    
    const stats = {
      currentPhase: state.currentPhase,
      totalPhasesCompleted: state.completedPhases.length,
      totalWorkflowsStarted: history.filter(h => h.type === 'phase_start').length,
      totalWorkflowsCompleted: history.filter(h => h.type === 'phase_complete').length,
      averagePhaseDuration: this.calculateAveragePhaseDuration(history),
      mostUsedPhases: this.getMostUsedPhases(history),
      lastActivity: state.lastActivity,
      workflowStartTime: state.workflowStartTime,
    };
    
    return stats;
  }

  calculateAveragePhaseDuration(history) {
    const completedPhases = history.filter(h => h.type === 'phase_complete');
    if (completedPhases.length === 0) return 0;
    
    const totalDuration = completedPhases.reduce((sum, phase) => {
      if (phase.startTime && phase.endTime) {
        return sum + (new Date(phase.endTime) - new Date(phase.startTime));
      }
      return sum;
    }, 0);
    
    return Math.round(totalDuration / completedPhases.length / (1000 * 60)); // minutes
  }

  getMostUsedPhases(history) {
    const phaseCounts = {};
    
    history.forEach(entry => {
      if (entry.phase) {
        phaseCounts[entry.phase] = (phaseCounts[entry.phase] || 0) + 1;
      }
    });
    
    return Object.entries(phaseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([phase, count]) => ({ phase, count }));
  }

  // Reset workflow state
  async resetState() {
    const defaultState = this.getDefaultState();
    await this.saveState(defaultState);
    return defaultState;
  }
}

module.exports = WorkflowStateManager;