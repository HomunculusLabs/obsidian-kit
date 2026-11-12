#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class KnowledgeGraphQuery {
  constructor(graphPath) {
    this.graphPath = graphPath;
    this.graph = this.loadGraph();
  }

  loadGraph() {
    if (!fs.existsSync(this.graphPath)) {
      console.error(`❌ Knowledge graph file not found: ${this.graphPath}`);
      console.log('💡 Run the extractor first: node knowledge-graph-extractor.js');
      process.exit(1);
    }

    const content = fs.readFileSync(this.graphPath, 'utf8');
    return JSON.parse(content);
  }

  // Query methods
  findEntityByName(name) {
    return this.graph.nodes.filter(n =>
      n.name && n.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  findEntityByType(type) {
    return this.graph.nodes.filter(n => n.type === type);
  }

  findEntityByStatus(status) {
    return this.graph.nodes.filter(n => n.status === status);
  }

  findRelationships(entityId) {
    return this.graph.edges.filter(e =>
      e.source === entityId || e.target === entityId,
    );
  }

  findConnectedEntities(entityId, depth = 1) {
    const visited = new Set();
    const result = [];

    const traverse = (currentId, currentDepth) => {
      if (visited.has(currentId) || currentDepth > depth) return;
      visited.add(currentId);

      const connections = this.graph.edges
        .filter(e => e.source === currentId || e.target === currentId)
        .map(e => e.source === currentId ? e.target : e.source);

      for (const connId of connections) {
        const entity = this.graph.nodes.find(n => n.id === connId);
        if (entity && !visited.has(connId)) {
          result.push({ entity, depth: currentDepth + 1 });
          traverse(connId, currentDepth + 1);
        }
      }
    };

    traverse(entityId, 0);
    return result;
  }

  findPath(fromId, toId) {
    const visited = new Set();
    const queue = [{ id: fromId, path: [fromId] }];

    while (queue.length > 0) {
      const { id, path } = queue.shift();

      if (id === toId) {
        return path;
      }

      if (visited.has(id)) continue;
      visited.add(id);

      const connections = this.graph.edges
        .filter(e => e.source === id || e.target === id)
        .map(e => e.source === id ? e.target : e.source);

      for (const connId of connections) {
        if (!visited.has(connId)) {
          queue.push({ id: connId, path: [...path, connId] });
        }
      }
    }

    return null;
  }

  getProjectTasks(projectId) {
    const tasks = this.graph.nodes.filter(n =>
      n.type === 'task' && n.project === projectId.replace('project:', ''),
    );
    return tasks;
  }

  getTaskDependencies(taskId) {
    const dependencies = this.graph.edges
      .filter(e => e.source === taskId && e.type === 'depends_on')
      .map(e => e.target);

    return dependencies.map(depId =>
      this.graph.nodes.find(n => n.id === depId),
    ).filter(Boolean);
  }

  getTechnologyUsage(techId) {
    return this.graph.edges
      .filter(e => e.target === techId && e.type === 'uses')
      .map(e => this.graph.nodes.find(n => n.id === e.source))
      .filter(Boolean);
  }

  // Analytics methods
  getEntityStats() {
    const stats = {};
    for (const node of this.graph.nodes) {
      stats[node.type] = (stats[node.type] || 0) + 1;
    }
    return stats;
  }

  getRelationshipStats() {
    const stats = {};
    for (const edge of this.graph.edges) {
      stats[edge.type] = (stats[edge.type] || 0) + 1;
    }
    return stats;
  }

  getMostConnectedEntities(limit = 10) {
    const connections = {};

    for (const edge of this.graph.edges) {
      connections[edge.source] = (connections[edge.source] || 0) + 1;
      connections[edge.target] = (connections[edge.target] || 0) + 1;
    }

    return Object.entries(connections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => {
        const entity = this.graph.nodes.find(n => n.id === id);
        return { entity, connectionCount: count };
      });
  }

  // Output methods
  displayEntity(entity) {
    console.log(`\n📝 ${entity.type.toUpperCase()}: ${entity.name || entity.id}`);
    console.log(`   ID: ${entity.id}`);
    if (entity.status) console.log(`   Status: ${entity.status}`);
    if (entity.priority) console.log(`   Priority: ${entity.priority}`);
    if (entity.project) console.log(`   Project: ${entity.project}`);
    if (entity.assignee) console.log(`   Assignee: ${entity.assignee}`);
    if (entity.timeEstimate) console.log(`   Time Estimate: ${entity.timeEstimate} minutes`);
    if (entity.path) console.log(`   Path: ${entity.path}`);
    if (entity.tags && entity.tags.length > 0) console.log(`   Tags: ${entity.tags.join(', ')}`);
  }

  displayRelationships(relationships, entityId) {
    console.log(`\n🔗 Relationships for ${entityId}:`);

    for (const rel of relationships) {
      const otherId = rel.source === entityId ? rel.target : rel.source;
      const direction = rel.source === entityId ? '→' : '←';
      const otherEntity = this.graph.nodes.find(n => n.id === otherId);

      if (otherEntity) {
        console.log(`   ${direction} ${otherEntity.name || otherId} (${rel.type})`);
      }
    }
  }

  displayPath(path) {
    if (!path) {
      console.log('❌ No path found');
      return;
    }

    console.log('\n🛤️  Path:');
    for (let i = 0; i < path.length; i++) {
      const entity = this.graph.nodes.find(n => n.id === path[i]);
      const name = entity ? (entity.name || entity.id) : path[i];
      console.log(`   ${i + 1}. ${name}`);

      if (i < path.length - 1) {
        const edge = this.graph.edges.find(e =>
          (e.source === path[i] && e.target === path[i + 1]) ||
                    (e.target === path[i] && e.source === path[i + 1]),
        );
        if (edge) {
          console.log(`      (${edge.type})`);
        }
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const graphPath = './knowledge-graph.json';

  if (args.length === 0) {
    console.log('🧠 Knowledge Graph Query Tool');
    console.log('\nUsage:');
    console.log('  node knowledge-graph-query.js <command> [arguments]');
    console.log('\nCommands:');
    console.log('  search <name>              - Find entities by name');
    console.log('  type <type>                - Find entities by type');
    console.log('  status <status>            - Find entities by status');
    console.log('  connections <entityId>     - Show connections for entity');
    console.log('  path <fromId> <toId>       - Find path between entities');
    console.log('  project-tasks <projectId>  - Show tasks for project');
    console.log('  task-deps <taskId>         - Show task dependencies');
    console.log('  tech-usage <techId>        - Show technology usage');
    console.log('  stats                      - Show graph statistics');
    console.log('  most-connected             - Show most connected entities');
    console.log('\nExamples:');
    console.log('  node knowledge-graph-query.js search "Knowledge"');
    console.log('  node knowledge-graph-query.js type project');
    console.log('  node knowledge-graph-query.js connections "task:Knowledge-Graph-Construction"');
    console.log('  node knowledge-graph-query.js project-tasks "project:Knowledge-Integration"');
    return;
  }

  const query = new KnowledgeGraphQuery(graphPath);
  const command = args[0];

  switch (command) {
  case 'search':
    const name = args[1];
    if (!name) {
      console.error('❌ Please provide a search term');
      return;
    }
    const results = query.findEntityByName(name);
    console.log(`🔍 Found ${results.length} entities matching "${name}":`);
    results.forEach(entity => query.displayEntity(entity));
    break;

  case 'type':
    const type = args[1];
    if (!type) {
      console.error('❌ Please provide an entity type');
      return;
    }
    const entities = query.findEntityByType(type);
    console.log(`📋 Found ${entities.length} entities of type "${type}":`);
    entities.forEach(entity => query.displayEntity(entity));
    break;

  case 'status':
    const status = args[1];
    if (!status) {
      console.error('❌ Please provide a status');
      return;
    }
    const statusEntities = query.findEntityByStatus(status);
    console.log(`📊 Found ${statusEntities.length} entities with status "${status}":`);
    statusEntities.forEach(entity => query.displayEntity(entity));
    break;

  case 'connections':
    const entityId = args[1];
    if (!entityId) {
      console.error('❌ Please provide an entity ID');
      return;
    }
    const relationships = query.findRelationships(entityId);
    query.displayRelationships(relationships, entityId);

    const connected = query.findConnectedEntities(entityId, 2);
    console.log('\n🌐 Connected entities (depth 2):');
    connected.forEach(({ entity, depth }) => {
      console.log(`   ${'  '.repeat(depth - 1)}• ${entity.name || entity.id} (${entity.type})`);
    });
    break;

  case 'path':
    const fromId = args[1];
    const toId = args[2];
    if (!fromId || !toId) {
      console.error('❌ Please provide both from and to entity IDs');
      return;
    }
    const path = query.findPath(fromId, toId);
    query.displayPath(path);
    break;

  case 'project-tasks':
    const projectId = args[1];
    if (!projectId) {
      console.error('❌ Please provide a project ID');
      return;
    }
    const tasks = query.getProjectTasks(projectId);
    console.log(`📋 Tasks for project ${projectId}:`);
    tasks.forEach(task => query.displayEntity(task));
    break;

  case 'task-deps':
    const taskId = args[1];
    if (!taskId) {
      console.error('❌ Please provide a task ID');
      return;
    }
    const deps = query.getTaskDependencies(taskId);
    console.log(`🔗 Dependencies for task ${taskId}:`);
    deps.forEach(dep => query.displayEntity(dep));
    break;

  case 'tech-usage':
    const techId = args[1];
    if (!techId) {
      console.error('❌ Please provide a technology ID');
      return;
    }
    const usage = query.getTechnologyUsage(techId);
    console.log(`💻 Technology usage for ${techId}:`);
    usage.forEach(entity => query.displayEntity(entity));
    break;

  case 'stats':
    console.log('📊 Knowledge Graph Statistics:');
    console.log(`   Total Entities: ${query.graph.nodes.length}`);
    console.log(`   Total Relationships: ${query.graph.edges.length}`);

    console.log('\n🏷️  Entity Types:');
    const entityStats = query.getEntityStats();
    for (const [type, count] of Object.entries(entityStats)) {
      console.log(`   ${type}: ${count}`);
    }

    console.log('\n🔗 Relationship Types:');
    const relStats = query.getRelationshipStats();
    for (const [type, count] of Object.entries(relStats)) {
      console.log(`   ${type}: ${count}`);
    }
    break;

  case 'most-connected':
    const limit = parseInt(args[1]) || 10;
    const mostConnected = query.getMostConnectedEntities(limit);
    console.log(`🌟 Top ${limit} Most Connected Entities:`);
    mostConnected.forEach(({ entity, connectionCount }, index) => {
      console.log(`   ${index + 1}. ${entity.name || entity.id} (${entity.type}) - ${connectionCount} connections`);
    });
    break;

  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('💡 Run without arguments to see available commands');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = KnowledgeGraphQuery;
