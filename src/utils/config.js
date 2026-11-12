import path from 'path';
import { FileUtils } from './file-utils.js';

/**
 * Configuration management utilities
 */
export class ConfigManager {
  constructor(configPath = null) {
    this.configPath = configPath || this.getDefaultConfigPath();
    this.config = {};
    this.loaded = false;
  }

  /**
   * Get default configuration path
   */
  getDefaultConfigPath() {
    return path.join(process.cwd(), 'obsidian-kit.config.json');
  }

  /**
   * Load configuration from file
   */
  async load() {
    try {
      if (await FileUtils.exists(this.configPath)) {
        this.config = await FileUtils.readJSON(this.configPath) || {};
      } else {
        this.config = this.getDefaultConfig();
        await this.save();
      }
      this.loaded = true;
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  /**
   * Save configuration to file
   */
  async save() {
    try {
      await FileUtils.writeJSON(this.configPath, this.config);
      return true;
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return {
      version: '1.0.0',
      project: {
        name: 'Obsidian Kit Project',
        description: 'AI-powered knowledge and task management',
        version: '1.0.0'
      },
      paths: {
        vault: './vault',
        templates: './templates',
        output: './output',
        cache: './cache'
      },
      features: {
        knowledgeGraph: {
          enabled: true,
          autoUpdate: true,
          exportFormats: ['json', 'graphml']
        },
        semanticSearch: {
          enabled: true,
          indexing: true,
          similarity: 0.7
        },
        learningSystem: {
          enabled: true,
          captureMode: 'auto',
          analysis: true
        },
        agents: {
          enabled: true,
          defaultAgent: 'enhanced',
          contextWindow: 4000
        }
      },
      cli: {
        verbose: false,
        interactive: true,
        autoSave: true
      },
      integration: {
        obsidian: {
          enabled: true,
          port: 3000
        },
        mcp: {
          enabled: true,
          servers: []
        }
      }
    };
  }

  /**
   * Get configuration value by path
   */
  get(path, defaultValue = null) {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Set configuration value by path
   */
  set(path, value) {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return this;
  }

  /**
   * Merge configuration with object
   */
  merge(obj) {
    if (!this.loaded) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    this.config = this.deepMerge(this.config, obj);
    return this;
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Validate configuration
   */
  validate() {
    const required = ['project.name', 'paths.vault'];
    const errors = [];

    for (const path of required) {
      if (!this.get(path)) {
        errors.push(`Missing required configuration: ${path}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

export default ConfigManager;