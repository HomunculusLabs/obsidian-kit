#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      operations: [],
      memorySnapshots: [],
      responseTimes: [],
      errorRates: {},
      throughput: []
    };
    this.startTime = null;
    this.operationCount = 0;
    this.errorCount = 0;
  }

  startMonitoring() {
    this.startTime = Date.now();
    console.log(chalk.blue('🚀 Performance monitoring started'));
    
    // Take initial memory snapshot
    this.takeMemorySnapshot('initial');
    
    // Set up periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.takeMemorySnapshot();
      this.calculateThroughput();
    }, 5000); // Every 5 seconds
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    console.log(chalk.blue('🛑 Performance monitoring stopped'));
    
    return this.generateReport(totalDuration);
  }

  recordOperation(operationType, duration, success = true, metadata = {}) {
    this.operationCount++;
    
    if (!success) {
      this.errorCount++;
      this.errorRates[operationType] = (this.errorRates[operationType] || 0) + 1;
    }

    const operation = {
      id: this.operationCount,
      type: operationType,
      duration,
      success,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.operations.push(operation);
    this.metrics.responseTimes.push(duration);

    // Keep only last 1000 operations in memory
    if (this.metrics.operations.length > 1000) {
      this.metrics.operations.shift();
      this.metrics.responseTimes.shift();
    }
  }

  takeMemorySnapshot(label = '') {
    const memoryUsage = process.memoryUsage();
    const snapshot = {
      timestamp: Date.now(),
      label,
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      arrayBuffers: memoryUsage.arrayBuffers
    };

    this.metrics.memorySnapshots.push(snapshot);

    // Keep only last 100 snapshots
    if (this.metrics.memorySnapshots.length > 100) {
      this.metrics.memorySnapshots.shift();
    }

    return snapshot;
  }

  calculateThroughput() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentOperations = this.metrics.operations.filter(
      op => op.timestamp > oneMinuteAgo
    );
    
    const throughput = recentOperations.length;
    this.metrics.throughput.push({
      timestamp: now,
      operationsPerMinute: throughput
    });

    // Keep only last 20 throughput measurements
    if (this.metrics.throughput.length > 20) {
      this.metrics.throughput.shift();
    }
  }

  generateReport(totalDuration) {
    const report = {
      summary: this.generateSummary(totalDuration),
      operations: this.analyzeOperations(),
      memory: this.analyzeMemory(),
      throughput: this.analyzeThroughput(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateSummary(totalDuration) {
    const successRate = this.operationCount > 0 
      ? ((this.operationCount - this.errorCount) / this.operationCount * 100).toFixed(2)
      : 100;

    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? (this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length).toFixed(2)
      : 0;

    return {
      totalDuration: totalDuration,
      totalOperations: this.operationCount,
      totalErrors: this.errorCount,
      successRate: `${successRate}%`,
      averageResponseTime: `${avgResponseTime}ms`,
      operationsPerSecond: (this.operationCount / (totalDuration / 1000)).toFixed(2)
    };
  }

  analyzeOperations() {
    if (this.metrics.responseTimes.length === 0) {
      return { message: 'No operations recorded' };
    }

    const sortedTimes = [...this.metrics.responseTimes].sort((a, b) => a - b);
    const len = sortedTimes.length;

    return {
      count: this.metrics.responseTimes.length,
      min: sortedTimes[0],
      max: sortedTimes[len - 1],
      mean: (sortedTimes.reduce((a, b) => a + b, 0) / len).toFixed(2),
      median: len % 2 === 0 
        ? ((sortedTimes[len / 2 - 1] + sortedTimes[len / 2]) / 2).toFixed(2)
        : sortedTimes[Math.floor(len / 2)],
      p95: sortedTimes[Math.floor(len * 0.95)],
      p99: sortedTimes[Math.floor(len * 0.99)],
      errorRates: this.errorRates
    };
  }

  analyzeMemory() {
    if (this.metrics.memorySnapshots.length < 2) {
      return { message: 'Insufficient memory data' };
    }

    const initial = this.metrics.memorySnapshots[0];
    const latest = this.metrics.memorySnapshots[this.metrics.memorySnapshots.length - 1];
    
    const heapGrowth = latest.heapUsed - initial.heapUsed;
    const heapGrowthMB = (heapGrowth / 1024 / 1024).toFixed(2);

    return {
      initialHeap: `${(initial.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      currentHeap: `${(latest.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapGrowth: `${heapGrowthMB}MB`,
      peakHeap: `${(Math.max(...this.metrics.memorySnapshots.map(s => s.heapUsed)) / 1024 / 1024).toFixed(2)}MB`,
      rssGrowth: `${((latest.rss - initial.rss) / 1024 / 1024).toFixed(2)}MB`
    };
  }

  analyzeThroughput() {
    if (this.metrics.throughput.length === 0) {
      return { message: 'No throughput data available' };
    }

    const throughputValues = this.metrics.throughput.map(t => t.operationsPerMinute);
    const avgThroughput = throughputValues.reduce((a, b) => a + b, 0) / throughputValues.length;

    return {
      average: avgThroughput.toFixed(2),
      peak: Math.max(...throughputValues),
      minimum: Math.min(...throughputValues),
      current: throughputValues[throughputValues.length - 1] || 0
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const operations = this.analyzeOperations();
    const memory = this.analyzeMemory();

    // Response time recommendations
    if (operations.mean && parseFloat(operations.mean) > 500) {
      recommendations.push('⚠️ High average response time detected. Consider optimizing critical paths.');
    }

    if (operations.p95 && operations.p95 > 2000) {
      recommendations.push('⚠️ 95th percentile response time is high. Some operations may need optimization.');
    }

    // Memory recommendations
    if (memory.heapGrowth && parseFloat(memory.heapGrowth) > 100) {
      recommendations.push('⚠️ High memory growth detected. Check for memory leaks.');
    }

    // Error rate recommendations
    const totalErrorRate = this.operationCount > 0 ? (this.errorCount / this.operationCount) : 0;
    if (totalErrorRate > 0.05) {
      recommendations.push('⚠️ High error rate detected. Review error handling and retry logic.');
    }

    // Throughput recommendations
    const throughput = this.analyzeThroughput();
    if (throughput.average && parseFloat(throughput.average) < 10) {
      recommendations.push('💡 Consider implementing caching or batching to improve throughput.');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Performance looks good! No major issues detected.');
    }

    return recommendations;
  }

  async saveReport(filePath) {
    const report = this.stopMonitoring();
    await fs.writeJson(filePath, report, { spaces: 2 });
    console.log(chalk.green(`📊 Performance report saved to ${filePath}`));
    return report;
  }

  printReport() {
    const report = this.stopMonitoring();
    
    console.log(chalk.bold('\n📊 PERFORMANCE REPORT\n'));
    
    // Summary
    console.log(chalk.yellow('📈 Summary:'));
    console.log(`  Duration: ${report.summary.totalDuration}ms`);
    console.log(`  Operations: ${report.summary.totalOperations}`);
    console.log(`  Success Rate: ${report.summary.successRate}`);
    console.log(`  Avg Response Time: ${report.summary.averageResponseTime}`);
    console.log(`  Ops/Second: ${report.summary.operationsPerSecond}`);
    
    // Operations Analysis
    console.log(chalk.yellow('\n⚡ Operations:'));
    if (report.operations.count) {
      console.log(`  Count: ${report.operations.count}`);
      console.log(`  Min/Max: ${report.operations.min}ms / ${report.operations.max}ms`);
      console.log(`  Mean: ${report.operations.mean}ms`);
      console.log(`  Median: ${report.operations.median}ms`);
      console.log(`  95th: ${report.operations.p95}ms`);
      console.log(`  99th: ${report.operations.p99}ms`);
    } else {
      console.log(`  ${report.operations.message}`);
    }
    
    // Memory Analysis
    console.log(chalk.yellow('\n💾 Memory:'));
    if (report.memory.currentHeap) {
      console.log(`  Initial Heap: ${report.memory.initialHeap}`);
      console.log(`  Current Heap: ${report.memory.currentHeap}`);
      console.log(`  Heap Growth: ${report.memory.heapGrowth}`);
      console.log(`  Peak Heap: ${report.memory.peakHeap}`);
    } else {
      console.log(`  ${report.memory.message}`);
    }
    
    // Throughput Analysis
    console.log(chalk.yellow('\n🚀 Throughput:'));
    if (report.throughput.average) {
      console.log(`  Average: ${report.throughput.average} ops/min`);
      console.log(`  Peak: ${report.throughput.peak} ops/min`);
      console.log(`  Current: ${report.throughput.current} ops/min`);
    } else {
      console.log(`  ${report.throughput.message}`);
    }
    
    // Recommendations
    console.log(chalk.yellow('\n💡 Recommendations:'));
    report.recommendations.forEach(rec => console.log(`  ${rec}`));
    
    console.log('\n');
    return report;
  }
}

module.exports = PerformanceMonitor;