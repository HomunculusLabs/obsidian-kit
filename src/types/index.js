/**
 * Type definitions and interfaces for Obsidian Kit
 */

/**
 * Base task interface
 */
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  CANCELLED: 'cancelled'
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Project configuration interface
 */
export const ProjectConfig = {
  name: 'string',
  description: 'string',
  version: 'string',
  paths: {
    vault: 'string',
    templates: 'string',
    output: 'string',
    cache: 'string'
  },
  features: {
    knowledgeGraph: 'object',
    semanticSearch: 'object',
    learningSystem: 'object',
    agents: 'object'
  }
};

/**
 * Knowledge graph node interface
 */
export const KnowledgeNode = {
  id: 'string',
  title: 'string',
  content: 'string',
  type: 'string',
  tags: 'array',
  metadata: 'object',
  connections: 'array',
  createdAt: 'date',
  updatedAt: 'date'
};

/**
 * Semantic search result interface
 */
export const SearchResult = {
  id: 'string',
  title: 'string',
  content: 'string',
  score: 'number',
  metadata: 'object',
  highlights: 'array'
};

/**
 * Agent configuration interface
 */
export const AgentConfig = {
  name: 'string',
  type: 'string',
  model: 'string',
  parameters: 'object',
  capabilities: 'array',
  contextWindow: 'number'
};

/**
 * Learning data interface
 */
export const LearningData = {
  id: 'string',
  type: 'string',
  content: 'string',
  context: 'object',
  timestamp: 'date',
  confidence: 'number',
  tags: 'array'
};

/**
 * API response interface
 */
export const APIResponse = {
  success: 'boolean',
  data: 'any',
  error: 'string',
  metadata: 'object'
};

/**
 * Validation schemas
 */
export const ValidationSchemas = {
  task: {
    title: { type: 'string', required: true, minLength: 1 },
    description: { type: 'string', required: false },
    status: { type: 'string', required: true, enum: Object.values(TaskStatus) },
    priority: { type: 'string', required: true, enum: Object.values(TaskPriority) },
    project: { type: 'string', required: true },
    assignee: { type: 'string', required: false },
    dueDate: { type: 'date', required: false },
    tags: { type: 'array', required: false, itemType: 'string' }
  },
  
  project: {
    name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
    description: { type: 'string', required: false, maxLength: 500 },
    status: { type: 'string', required: true, enum: ['active', 'archived', 'suspended'] },
    repository: { type: 'string', required: false, validate: 'url' }
  },
  
  knowledgeNode: {
    title: { type: 'string', required: true, minLength: 1 },
    content: { type: 'string', required: true, minLength: 1 },
    type: { type: 'string', required: true },
    tags: { type: 'array', required: false, itemType: 'string' }
  }
};

/**
 * Error types
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  CONFIGURATION_ERROR: 'ConfigurationError',
  FILE_SYSTEM_ERROR: 'FileSystemError',
  NETWORK_ERROR: 'NetworkError',
  INTEGRATION_ERROR: 'IntegrationError',
  AGENT_ERROR: 'AgentError'
};

/**
 * Event types
 */
export const EventTypes = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_COMPLETED: 'task:completed',
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  KNOWLEDGE_ADDED: 'knowledge:added',
  KNOWLEDGE_UPDATED: 'knowledge:updated',
  AGENT_STARTED: 'agent:started',
  AGENT_COMPLETED: 'agent:completed',
  ERROR_OCCURRED: 'error:occurred'
};

export default {
  TaskStatus,
  TaskPriority,
  ProjectConfig,
  KnowledgeNode,
  SearchResult,
  AgentConfig,
  LearningData,
  APIResponse,
  ValidationSchemas,
  ErrorTypes,
  EventTypes
};