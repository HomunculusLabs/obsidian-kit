/**
 * Validation utilities for Obsidian Kit
 */

export class ValidationUtils {
  /**
   * Validate required fields in an object
   */
  static validateRequired(obj, requiredFields) {
    const missing = requiredFields.filter(field => !obj[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate project name
   */
  static isValidProjectName(name) {
    return typeof name === 'string' && 
           name.length >= 2 && 
           name.length <= 100 && 
           /^[a-zA-Z0-9-_]+$/.test(name);
  }

  /**
   * Validate file path
   */
  static isValidPath(path) {
    return typeof path === 'string' && path.length > 0;
  }

  /**
   * Validate configuration object
   */
  static validateConfig(config, schema) {
    const errors = [];
    
    for (const [key, rules] of Object.entries(schema)) {
      const value = config[key];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
        continue;
      }
      
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${key} must be of type ${rules.type}`);
      }
      
      if (rules.validate && !rules.validate(value)) {
        errors.push(`${key} is invalid`);
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate task status
   */
  static isValidTaskStatus(status) {
    const validStatuses = ['todo', 'in-progress', 'completed', 'blocked', 'cancelled'];
    return validStatuses.includes(status);
  }

  /**
   * Validate priority level
   */
  static isValidPriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return validPriorities.includes(priority);
  }
}

export default ValidationUtils;