const chalk = require('chalk');

/**
 * Validates a project name for safety and compatibility
 * @param {string} name - The project name to validate
 * @returns {string} - The sanitized project name
 * @throws {Error} - If validation fails
 */
function validateProjectName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Project name is required and must be a string');
  }

  const trimmed = name.trim();

  if (trimmed.length < 1) {
    throw new Error('Project name cannot be empty');
  }

  if (trimmed.length > 255) {
    throw new Error('Project name is too long (max 255 characters)');
  }

  // Check for invalid filesystem characters
  // Windows: < > : " / \ | ? * and control characters (0x00-0x1F)
  // Unix: / and null character
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  if (invalidChars.test(trimmed)) {
    throw new Error('Project name contains invalid characters');
  }

  // Prevent directory traversal
  if (trimmed.includes('..') || trimmed.startsWith('.')) {
    throw new Error('Project name cannot contain ".." or start with "."');
  }

  // Prevent reserved names on Windows
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  if (reservedNames.test(trimmed)) {
    throw new Error('Project name cannot be a reserved system name');
  }

  return trimmed;
}

/**
 * Validates a vault name
 * @param {string} name - The vault name to validate
 * @returns {string} - The sanitized vault name
 * @throws {Error} - If validation fails
 */
function validateVaultName(name) {
  // Vault names have similar requirements to project names
  return validateProjectName(name);
}

/**
 * Validates an API key format
 * @param {string} apiKey - The API key to validate
 * @returns {string} - The validated API key
 * @throws {Error} - If validation fails
 */
function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    // API key is optional, so return empty string if not provided
    return '';
  }

  const trimmed = apiKey.trim();

  // API keys should be at least 16 characters
  if (trimmed.length > 0 && trimmed.length < 16) {
    console.log(chalk.yellow('⚠️  Warning: API key seems unusually short'));
  }

  // API keys should not contain spaces
  if (/\s/.test(trimmed)) {
    throw new Error('API key cannot contain whitespace');
  }

  // Check for common patterns that indicate not a real API key
  if (trimmed === 'your-api-key-here' || trimmed === 'placeholder' || trimmed === 'test') {
    throw new Error('Please provide a real API key, not a placeholder');
  }

  return trimmed;
}

/**
 * Validates a file path for security
 * @param {string} filePath - The file path to validate
 * @returns {string} - The validated file path
 * @throws {Error} - If validation fails
 */
function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path is required and must be a string');
  }

  const trimmed = filePath.trim();

  // Prevent directory traversal attacks
  if (trimmed.includes('..')) {
    throw new Error('File path cannot contain ".." (directory traversal)');
  }

  // Check for null bytes (path injection)
  if (trimmed.includes('\0')) {
    throw new Error('File path cannot contain null bytes');
  }

  return trimmed;
}

/**
 * Validates a directory path and checks for common issues
 * @param {string} dirPath - The directory path to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.allowRelative - Allow relative paths (default: true)
 * @param {boolean} options.mustExist - Path must exist (default: false)
 * @returns {string} - The validated directory path
 * @throws {Error} - If validation fails
 */
function validateDirectoryPath(dirPath, options = {}) {
  const { allowRelative = true, mustExist = false } = options;

  const validated = validateFilePath(dirPath);

  if (!allowRelative && !require('path').isAbsolute(validated)) {
    throw new Error('Directory path must be absolute');
  }

  if (mustExist) {
    const fs = require('fs-extra');
    if (!fs.existsSync(validated)) {
      throw new Error(`Directory does not exist: ${validated}`);
    }
  }

  return validated;
}

/**
 * Sanitizes user input by removing dangerous characters
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove control characters and other potentially dangerous chars
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

module.exports = {
  validateProjectName,
  validateVaultName,
  validateApiKey,
  validateFilePath,
  validateDirectoryPath,
  sanitizeInput
};
