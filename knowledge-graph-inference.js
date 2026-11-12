#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class KnowledgeGraphInference {
  constructor(graph) {
    this.graph = graph;
    this.inferredRelationships = [];
    this.confidenceThreshold = 0.7;
  }

  // Main inference engine
  async inferRelationships() {
    console.log('🧠 Starting relationship inference...');

    // Clear previous inferences
    this.inferredRelationships = [];

    // Run different inference strategies
    await this.inferTemporalRelationships();
    await this.inferSemanticRelationships();
    await this.inferStructuralRelationships();
    await this.inferDependencyRelationships();
    await this.inferCollaborativeRelationships();

    // Filter by confidence threshold
    this.inferredRelationships = this.inferredRelationships.filter(
      rel => rel.confidence >= this.confidenceThreshold,
    );

    console.log(`✅ Inferred ${this.inferredRelationships.length} new relationships`);
    return this.inferredRelationships;
  }

  // Infer relationships based on temporal patterns
  async inferTemporalRelationships() {
    console.log('⏰ Analyzing temporal patterns...');

    const nodes = this.graph.nodes;
    const timeBasedRelationships = [];

    // Group nodes by creation date
    const nodesByDate = {};
    nodes.forEach(node => {
      const date = node.created_date || node.createdAt || node.startTime;
      if (date) {
        const dateKey = date.split('T')[0]; // Extract date part
        if (!nodesByDate[dateKey]) {
          nodesByDate[dateKey] = [];
        }
        nodesByDate[dateKey].push(node);
      }
    });

    // Infer sequential relationships
    const sortedDates = Object.keys(nodesByDate).sort();
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      const currentNodes = nodesByDate[currentDate];
      const nextNodes = nodesByDate[nextDate];

      // Create relationships between consecutive days
      currentNodes.forEach(currentNode => {
        nextNodes.forEach(nextNode => {
          if (currentNode.type === 'task' && nextNode.type === 'task') {
            timeBasedRelationships.push({
              source: currentNode.id,
              target: nextNode.id,
              type: 'precedes',
              confidence: 0.8,
              reason: 'Temporal sequence - created on consecutive days',
              metadata: {
                sourceDate: currentDate,
                targetDate: nextDate,
                method: 'temporal',
              },
            });
          }
        });
      });
    }

    this.inferredRelationships.push(...timeBasedRelationships);
  }

  // Infer relationships based on semantic similarity
  async inferSemanticRelationships() {
    console.log('📝 Analyzing semantic similarity...');

    const nodes = this.graph.nodes;
    const semanticRelationships = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        // Skip if already directly connected
        if (this.areDirectlyConnected(node1.id, node2.id)) {
          continue;
        }

        // Calculate semantic similarity
        const similarity = this.calculateSemanticSimilarity(node1, node2);

        if (similarity > 0.7) {
          semanticRelationships.push({
            source: node1.id,
            target: node2.id,
            type: 'semantically_related',
            confidence: similarity,
            reason: `High semantic similarity (${(similarity * 100).toFixed(1)}%)`,
            metadata: {
              similarity,
              method: 'semantic',
            },
          });
        }
      }
    }

    this.inferredRelationships.push(...semanticRelationships);
  }

  // Infer relationships based on structural patterns
  async inferStructuralRelationships() {
    console.log('🏗️  Analyzing structural patterns...');

    const structuralRelationships = [];

    // Find common patterns
    const projectTasks = this.groupNodesByProject();
    const specTypes = this.groupNodesBySpecType();

    // Infer task-to-task relationships within projects
    Object.entries(projectTasks).forEach(([projectId, tasks]) => {
      if (tasks.length > 1) {
        tasks.forEach((task1, i) => {
          tasks.forEach((task2, j) => {
            if (i !== j && !this.areDirectlyConnected(task1.id, task2.id)) {
              // Infer potential collaboration or dependency
              const priorityDiff = this.getPriorityValue(task1.priority) - this.getPriorityValue(task2.priority);

              if (Math.abs(priorityDiff) <= 1) { // Similar priority
                structuralRelationships.push({
                  source: task1.id,
                  target: task2.id,
                  type: 'potential_collaboration',
                  confidence: 0.75,
                  reason: 'Same project with similar priority',
                  metadata: {
                    projectId,
                    method: 'structural',
                  },
                });
              }
            }
          });
        });
      }
    });

    // Infer specification relationships
    Object.entries(specTypes).forEach(([specType, specs]) => {
      if (specs.length > 1) {
        specs.forEach((spec1, i) => {
          specs.forEach((spec2, j) => {
            if (i !== j && !this.areDirectlyConnected(spec1.id, spec2.id)) {
              structuralRelationships.push({
                source: spec1.id,
                target: spec2.id,
                type: 'specification_family',
                confidence: 0.8,
                reason: `Same specification type: ${specType}`,
                metadata: {
                  specType,
                  method: 'structural',
                },
              });
            }
          });
        });
      }
    });

    this.inferredRelationships.push(...structuralRelationships);
  }

  // Infer dependency relationships
  async inferDependencyRelationships() {
    console.log('🔗 Analyzing dependency patterns...');

    const dependencyRelationships = [];
    const nodes = this.graph.nodes;

    // Look for implicit dependencies
    nodes.forEach(node => {
      if (node.type === 'task') {
        // Find tasks that might depend on this one
        const potentialDependents = nodes.filter(other =>
          other.type === 'task' &&
          other.id !== node.id &&
          !this.areDirectlyConnected(other.id, node.id),
        );

        potentialDependents.forEach(potential => {
          const dependencyScore = this.calculateDependencyScore(node, potential);

          if (dependencyScore > 0.6) {
            dependencyRelationships.push({
              source: potential.id,
              target: node.id,
              type: 'likely_depends_on',
              confidence: dependencyScore,
              reason: 'Inferred from task properties and relationships',
              metadata: {
                score: dependencyScore,
                method: 'dependency',
              },
            });
          }
        });
      }
    });

    this.inferredRelationships.push(...dependencyRelationships);
  }

  // Infer collaborative relationships
  async inferCollaborativeRelationships() {
    console.log('👥 Analyzing collaboration patterns...');

    const collaborativeRelationships = [];
    const nodes = this.graph.nodes;

    // Group by assignee
    const assigneeGroups = {};
    nodes.forEach(node => {
      const assignee = node.assignee || 'unassigned';
      if (!assigneeGroups[assignee]) {
        assigneeGroups[assignee] = [];
      }
      assigneeGroups[assignee].push(node);
    });

    // Infer collaboration between same assignee's tasks
    Object.entries(assigneeGroups).forEach(([assignee, tasks]) => {
      if (tasks.length > 1 && assignee !== 'unassigned') {
        tasks.forEach((task1, i) => {
          tasks.forEach((task2, j) => {
            if (i !== j && !this.areDirectlyConnected(task1.id, task2.id)) {
              collaborativeRelationships.push({
                source: task1.id,
                target: task2.id,
                type: 'shared_assignee',
                confidence: 0.85,
                reason: `Both assigned to: ${assignee}`,
                metadata: {
                  assignee,
                  method: 'collaborative',
                },
              });
            }
          });
        });
      }
    });

    this.inferredRelationships.push(...collaborativeRelationships);
  }

  // Helper methods
  areDirectlyConnected(nodeId1, nodeId2) {
    return this.graph.edges.some(edge =>
      (edge.source === nodeId1 && edge.target === nodeId2) ||
      (edge.source === nodeId2 && edge.target === nodeId1),
    );
  }

  calculateSemanticSimilarity(node1, node2) {
    let similarity = 0;
    let factors = 0;

    // Name similarity
    if (node1.name && node2.name) {
      const nameSimilarity = this.stringSimilarity(node1.name, node2.name);
      similarity += nameSimilarity;
      factors++;
    }

    // Type similarity
    if (node1.type === node2.type) {
      similarity += 0.3;
      factors++;
    }

    // Tag similarity
    if (node1.tags && node2.tags) {
      const commonTags = node1.tags.filter(tag => node2.tags.includes(tag));
      const tagSimilarity = commonTags.length / Math.max(node1.tags.length, node2.tags.length);
      similarity += tagSimilarity * 0.5;
      factors++;
    }

    // Project similarity
    if (node1.project && node2.project) {
      if (node1.project === node2.project) {
        similarity += 0.4;
        factors++;
      }
    }

    return factors > 0 ? similarity / factors : 0;
  }

  stringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  groupNodesByProject() {
    const projects = {};
    this.graph.nodes.forEach(node => {
      if (node.project) {
        const projectId = node.project.replace(/\[\[|\]\]/g, '');
        if (!projects[projectId]) {
          projects[projectId] = [];
        }
        projects[projectId].push(node);
      }
    });
    return projects;
  }

  groupNodesBySpecType() {
    const specs = {};
    this.graph.nodes.forEach(node => {
      if (node.type === 'specification' && node.subtype) {
        if (!specs[node.subtype]) {
          specs[node.subtype] = [];
        }
        specs[node.subtype].push(node);
      }
    });
    return specs;
  }

  getPriorityValue(priority) {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return priorityMap[priority] || 2;
  }

  calculateDependencyScore(task1, task2) {
    let score = 0;

    // Priority-based dependency
    const priority1 = this.getPriorityValue(task1.priority);
    const priority2 = this.getPriorityValue(task2.priority);

    if (priority1 > priority2) {
      score += 0.3; // Higher priority might depend on lower priority
    }

    // Due date-based dependency
    if (task1.due_date && task2.due_date) {
      const due1 = new Date(task1.due_date);
      const due2 = new Date(task2.due_date);

      if (due1 > due2) {
        score += 0.4; // Later due date might depend on earlier one
      }
    }

    // Project-based dependency
    if (task1.project === task2.project) {
      score += 0.2;
    }

    // Name-based dependency (look for keywords)
    const dependencyKeywords = ['setup', 'install', 'configure', 'implement', 'build', 'create'];
    const followerKeywords = ['test', 'deploy', 'release', 'document', 'review'];

    const name1 = (task1.name || '').toLowerCase();
    const name2 = (task2.name || '').toLowerCase();

    const task1IsDependency = dependencyKeywords.some(keyword => name1.includes(keyword));
    const task2IsFollower = followerKeywords.some(keyword => name2.includes(keyword));

    if (task1IsDependency && task2IsFollower) {
      score += 0.3;
    }

    return Math.min(score, 1.0);
  }

  // Apply inferred relationships to the graph
  applyInferredRelationships() {
    console.log('🔄 Applying inferred relationships to graph...');

    // Add new edges to the graph
    const newEdges = this.inferredRelationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      inferred: true,
      confidence: rel.confidence,
      reason: rel.reason,
      metadata: rel.metadata,
    }));

    this.graph.edges.push(...newEdges);

    // Update graph metadata
    if (!this.graph.metadata) {
      this.graph.metadata = {};
    }

    this.graph.metadata.inferredRelationships = {
      count: this.inferredRelationships.length,
      generatedAt: new Date().toISOString(),
      confidenceThreshold: this.confidenceThreshold,
      methods: [...new Set(this.inferredRelationships.map(rel => rel.metadata.method))],
    };

    console.log(`✅ Applied ${newEdges.length} inferred relationships to graph`);
    return this.graph;
  }

  // Generate inference report
  generateReport() {
    const report = {
      summary: {
        totalInferred: this.inferredRelationships.length,
        confidenceThreshold: this.confidenceThreshold,
        generatedAt: new Date().toISOString(),
      },
      byType: {},
      byMethod: {},
      byConfidence: {
        high: 0,    // > 0.9
        medium: 0,  // 0.7-0.9
        low: 0,      // 0.7-0.8
      },
      topRelationships: this.inferredRelationships
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10),
    };

    // Group by type
    this.inferredRelationships.forEach(rel => {
      report.byType[rel.type] = (report.byType[rel.type] || 0) + 1;
      report.byMethod[rel.metadata.method] = (report.byMethod[rel.metadata.method] || 0) + 1;

      if (rel.confidence > 0.9) {
        report.byConfidence.high++;
      } else if (rel.confidence > 0.8) {
        report.byConfidence.medium++;
      } else {
        report.byConfidence.low++;
      }
    });

    return report;
  }

  // Save updated graph
  saveGraph(outputPath) {
    const graphData = JSON.stringify(this.graph, null, 2);
    fs.writeFileSync(outputPath, graphData);
    console.log(`✅ Updated graph saved to ${outputPath}`);
  }

  // Save inference report
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportData = JSON.stringify(report, null, 2);
    fs.writeFileSync(outputPath, reportData);
    console.log(`✅ Inference report saved to ${outputPath}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const graphPath = args.find(arg => !arg.startsWith('--')) || './knowledge-graph.json';
  const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || './knowledge-graph-inferred.json';
  const reportPath = args.find(arg => arg.startsWith('--report='))?.split('=')[1] || './inference-report.json';
  const threshold = parseFloat(args.find(arg => arg.startsWith('--threshold='))?.split('=')[1]) || 0.7;

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🧠 Knowledge Graph Relationship Inference');
    console.log('\nUsage:');
    console.log('  node knowledge-graph-inference.js [graph.json] [options]');
    console.log('\nOptions:');
    console.log('  --output=<path>     Output file for updated graph (default: ./knowledge-graph-inferred.json)');
    console.log('  --report=<path>     Output file for inference report (default: ./inference-report.json)');
    console.log('  --threshold=<num>   Confidence threshold (default: 0.7)');
    console.log('  --help, -h          Show this help message');
    console.log('\nExample:');
    console.log('  node knowledge-graph-inference.js knowledge-graph.json --threshold=0.8');
    return;
  }

  try {
    console.log('🧠 Knowledge Graph Relationship Inference');
    console.log(`📁 Input: ${graphPath}`);
    console.log(`💾 Output: ${outputPath}`);
    console.log(`📊 Report: ${reportPath}`);
    console.log(`🎯 Threshold: ${threshold}\n`);

    // Load graph
    if (!fs.existsSync(graphPath)) {
      throw new Error(`Graph file not found: ${graphPath}`);
    }

    const graphData = fs.readFileSync(graphPath, 'utf8');
    const graph = JSON.parse(graphData);

    // Run inference
    const inference = new KnowledgeGraphInference(graph);
    inference.confidenceThreshold = threshold;

    await inference.inferRelationships();
    inference.applyInferredRelationships();

    // Save results
    inference.saveGraph(outputPath);
    inference.saveReport(reportPath);

    // Display summary
    const report = inference.generateReport();
    console.log('\n📊 Inference Summary:');
    console.log(`   Total relationships inferred: ${report.summary.totalInferred}`);
    console.log(`   Confidence threshold: ${report.summary.confidenceThreshold}`);

    console.log('\n🏷️  By Type:');
    Object.entries(report.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n🔧 By Method:');
    Object.entries(report.byMethod).forEach(([method, count]) => {
      console.log(`   ${method}: ${count}`);
    });

    console.log('\n📈 By Confidence:');
    console.log(`   High (>0.9): ${report.byConfidence.high}`);
    console.log(`   Medium (0.8-0.9): ${report.byConfidence.medium}`);
    console.log(`   Low (0.7-0.8): ${report.byConfidence.low}`);

    console.log('\n✅ Inference completed successfully!');

  } catch (error) {
    console.error('❌ Inference failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = KnowledgeGraphInference;
