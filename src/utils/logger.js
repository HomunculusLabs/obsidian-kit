/**
 * Logger utility for Obsidian Kit
 */

export class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.prefix = options.prefix || 'ObsidianKit';
    this.colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    };
  }

  /**
   * Get timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  formatMessage(level, message, color = this.colors.reset) {
    const timestamp = this.getTimestamp();
    return `${color}[${timestamp}] [${this.prefix}] [${level.toUpperCase()}]${this.colors.reset} ${message}`;
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    console.error(this.formatMessage('error', message, this.colors.red));
    if (error) {
      console.error(error);
    }
  }

  /**
   * Log warning message
   */
  warn(message) {
    console.warn(this.formatMessage('warn', message, this.colors.yellow));
  }

  /**
   * Log info message
   */
  info(message) {
    console.log(this.formatMessage('info', message, this.colors.blue));
  }

  /**
   * Log success message
   */
  success(message) {
    console.log(this.formatMessage('success', message, this.colors.green));
  }

  /**
   * Log debug message
   */
  debug(message) {
    if (this.level === 'debug') {
      console.log(this.formatMessage('debug', message, this.colors.cyan));
    }
  }

  /**
   * Create child logger with prefix
   */
  child(prefix) {
    return new Logger({
      level: this.level,
      prefix: `${this.prefix}:${prefix}`
    });
  }
}

// Default logger instance
export const logger = new Logger();

export default Logger;