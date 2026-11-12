/**
 * Obsidian Kit - Main Entry Point
 * 
 * Central entry point for the Obsidian Kit system.
 * Exports core functionality and provides unified access to all modules.
 */

// Core modules
export { default as IntegrationHub } from './core/integration-hub.js';
export { default as UnifiedAPI } from './api/unified-api.js';

// Library modules
export { default as KnowledgeGraph } from '../lib/knowledge-graph/knowledge-graph-api.js';
export { default as SemanticSearch } from '../lib/semantic-search/semantic-search-engine.js';
export { default as LearningSystem } from '../lib/learning/learning-capture-system.js';
export { default as EnhancedAgent } from '../lib/agents/enhanced-agent-intelligence.js';

// Utilities
export * from './utils/index.js';

// Types
export * from './types/index.js';

/**
 * Main Obsidian Kit class that orchestrates all components
 */
export class ObsidianKit {
  constructor(config = {}) {
    this.config = {
      knowledgeGraph: {},
      semanticSearch: {},
      learning: {},
      agents: {},
      ...config
    };
    
    this.components = {};
    this.initialized = false;
  }

  /**
   * Initialize all components
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize core components
      this.components.integrationHub = new IntegrationHub(this.config);
      this.components.unifiedAPI = new UnifiedAPI(this.config);

      // Initialize library modules
      this.components.knowledgeGraph = new KnowledgeGraph(this.config.knowledgeGraph);
      this.components.semanticSearch = new SemanticSearch(this.config.semanticSearch);
      this.components.learningSystem = new LearningSystem(this.config.learning);
      this.components.enhancedAgent = new EnhancedAgent(this.config.agents);

      // Set up integrations
      await this.components.integrationHub.initialize();
      await this.components.unifiedAPI.initialize();

      this.initialized = true;
      console.log('Obsidian Kit initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Obsidian Kit:', error);
      throw error;
    }
  }

  /**
   * Get a component by name
   */
  getComponent(name) {
    if (!this.initialized) {
      throw new Error('Obsidian Kit not initialized. Call initialize() first.');
    }
    return this.components[name];
  }

  /**
   * Shutdown all components
   */
  async shutdown() {
    if (!this.initialized) return;

    try {
      // Shutdown components in reverse order
      const shutdownPromises = Object.values(this.components)
        .filter(component => typeof component.shutdown === 'function')
        .map(component => component.shutdown());

      await Promise.all(shutdownPromises);
      this.initialized = false;
      console.log('Obsidian Kit shutdown successfully');
    } catch (error) {
      console.error('Error during shutdown:', error);
      throw error;
    }
  }
}

export default ObsidianKit;