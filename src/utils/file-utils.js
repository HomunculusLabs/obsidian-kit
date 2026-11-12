import fs from 'fs-extra';
import path from 'path';

/**
 * File utility functions for Obsidian Kit
 */
export class FileUtils {
  /**
   * Ensure directory exists
   */
  static async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Read JSON file safely
   */
  static async readJSON(filePath) {
    try {
      return await fs.readJSON(filePath);
    } catch (error) {
      console.warn(`Failed to read JSON file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Write JSON file safely
   */
  static async writeJSON(filePath, data) {
    await this.ensureDir(path.dirname(filePath));
    await fs.writeJSON(filePath, data, { spaces: 2 });
  }

  /**
   * Check if file exists
   */
  static async exists(filePath) {
    return await fs.pathExists(filePath);
  }

  /**
   * Get file stats
   */
  static async getStats(filePath) {
    try {
      return await fs.stat(filePath);
    } catch (error) {
      return null;
    }
  }

  /**
   * Copy file or directory
   */
  static async copy(src, dest) {
    await this.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }

  /**
   * Remove file or directory
   */
  static async remove(targetPath) {
    await fs.remove(targetPath);
  }

  /**
   * List files in directory
   */
  static async listFiles(dirPath, options = {}) {
    const { recursive = false, filter = () => true } = options;
    
    if (!recursive) {
      const files = await fs.readdir(dirPath);
      return files.filter(filter).map(file => path.join(dirPath, file));
    }

    const results = [];
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = await this.getStats(fullPath);
      
      if (stats && stats.isDirectory()) {
        const subFiles = await this.listFiles(fullPath, options);
        results.push(...subFiles);
      } else if (filter(fullPath)) {
        results.push(fullPath);
      }
    }
    
    return results;
  }
}

export default FileUtils;