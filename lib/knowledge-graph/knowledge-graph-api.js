#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

class KnowledgeGraphAPI {
  constructor(graphPath, port = 3000) {
    this.graphPath = graphPath;
    this.port = port;
    this.graph = this.loadGraph();
    this.server = null;
  }

  loadGraph() {
    if (!fs.existsSync(this.graphPath)) {
      throw new Error(`Knowledge graph file not found: ${this.graphPath}`);
    }

    const content = fs.readFileSync(this.graphPath, 'utf8');
    return JSON.parse(content);
  }

  // API endpoint handlers
  handleGetEntities(req, res) {
    const { type, status, search } = url.parse(req.url, true).query;

    let entities = this.graph.nodes;

    if (type) {
      entities = entities.filter(n => n.type === type);
    }

    if (status) {
      entities = entities.filter(n => n.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      entities = entities.filter(n =>
        (n.name && n.name.toLowerCase().includes(searchLower)) ||
                n.id.toLowerCase().includes(searchLower),
      );
    }

    this.sendJSON(res, { entities, total: entities.length });
  }

  handleGetEntity(req, res, id) {
    const entity = this.graph.nodes.find(n => n.id === id);

    if (!entity) {
      this.sendError(res, 404, 'Entity not found');
      return;
    }

    // Get relationships for this entity
    const relationships = this.graph.edges.filter(e =>
      e.source === id || e.target === id,
    );

    // Get connected entities
    const connectedIds = new Set();
    relationships.forEach(rel => {
      connectedIds.add(rel.source === id ? rel.target : rel.source);
    });

    const connectedEntities = this.graph.nodes.filter(n => connectedIds.has(n.id));

    this.sendJSON(res, {
      entity,
      relationships,
      connectedEntities,
    });
  }

  handleGetRelationships(req, res) {
    const { type, from, to } = url.parse(req.url, true).query;

    let relationships = this.graph.edges;

    if (type) {
      relationships = relationships.filter(e => e.type === type);
    }

    if (from) {
      relationships = relationships.filter(e => e.source === from);
    }

    if (to) {
      relationships = relationships.filter(e => e.target === to);
    }

    this.sendJSON(res, { relationships, total: relationships.length });
  }

  handleGetPath(req, res) {
    const { from, to } = url.parse(req.url, true).query;

    if (!from || !to) {
      this.sendError(res, 400, 'Both "from" and "to" parameters are required');
      return;
    }

    const path = this.findPath(from, to);
    this.sendJSON(res, { path, found: !!path });
  }

  handleGetStats(req, res) {
    const entityStats = {};
    const relationshipStats = {};

    // Count entity types
    for (const node of this.graph.nodes) {
      entityStats[node.type] = (entityStats[node.type] || 0) + 1;
    }

    // Count relationship types
    for (const edge of this.graph.edges) {
      relationshipStats[edge.type] = (relationshipStats[edge.type] || 0) + 1;
    }

    // Most connected entities
    const connections = {};
    for (const edge of this.graph.edges) {
      connections[edge.source] = (connections[edge.source] || 0) + 1;
      connections[edge.target] = (connections[edge.target] || 0) + 1;
    }

    const mostConnected = Object.entries(connections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => {
        const entity = this.graph.nodes.find(n => n.id === id);
        return { id, name: entity ? entity.name : id, count };
      });

    this.sendJSON(res, {
      metadata: this.graph.metadata,
      entityStats,
      relationshipStats,
      mostConnected,
    });
  }

  handleGetContext(req, res) {
    const { entityId, depth = 2 } = url.parse(req.url, true).query;

    if (!entityId) {
      this.sendError(res, 400, 'entityId parameter is required');
      return;
    }

    const context = this.getContext(entityId, parseInt(depth));
    this.sendJSON(res, context);
  }

  // Helper methods
  findPath(fromId, toId) {
    const visited = new Set();
    const queue = [{ id: fromId, path: [fromId] }];

    while (queue.length > 0) {
      const { id, path } = queue.shift();

      if (id === toId) {
        return path.map(pid => {
          const entity = this.graph.nodes.find(n => n.id === pid);
          return entity ? { id: pid, name: entity.name, type: entity.type } : { id: pid };
        });
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

  getContext(entityId, depth) {
    const visited = new Set();
    const result = {
      entity: null,
      relationships: [],
      connectedEntities: [],
      context: [],
    };

    // Find the main entity
    result.entity = this.graph.nodes.find(n => n.id === entityId);
    if (!result.entity) {
      return result;
    }

    // Get direct relationships
    result.relationships = this.graph.edges.filter(e =>
      e.source === entityId || e.target === entityId,
    );

    // Get connected entities with depth
    const traverse = (currentId, currentDepth, path = []) => {
      if (visited.has(currentId) || currentDepth > depth) return;
      visited.add(currentId);

      const connections = this.graph.edges
        .filter(e => e.source === currentId || e.target === currentId)
        .map(e => {
          const otherId = e.source === currentId ? e.target : e.source;
          const entity = this.graph.nodes.find(n => n.id === otherId);
          return {
            entity,
            relationship: e.type,
            direction: e.source === currentId ? 'outgoing' : 'incoming',
            depth: currentDepth + 1,
            path: [...path, otherId],
          };
        })
        .filter(item => item.entity && !visited.has(item.entity.id));

      result.connectedEntities.push(...connections);

      for (const conn of connections) {
        if (currentDepth < depth) {
          traverse(conn.entity.id, currentDepth + 1, conn.path);
        }
      }
    };

    traverse(entityId, 0);

    // Build context summary
    const types = {};
    result.connectedEntities.forEach(conn => {
      types[conn.entity.type] = (types[conn.entity.type] || 0) + 1;
    });

    result.context = Object.entries(types).map(([type, count]) => ({
      type,
      count,
      examples: result.connectedEntities
        .filter(conn => conn.entity.type === type)
        .slice(0, 3)
        .map(conn => conn.entity.name || conn.entity.id),
    }));

    return result;
  }

  // HTTP utilities
  sendJSON(res, data) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  }

  sendError(res, code, message) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }

  // Start the server
  start() {
    this.server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname;
      const method = req.method;

      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (method !== 'GET') {
        this.sendError(res, 405, 'Method not allowed');
        return;
      }

      try {
        // Route handling
        if (path === '/api/entities') {
          this.handleGetEntities(req, res);
        } else if (path.startsWith('/api/entities/')) {
          const id = path.split('/')[3];
          this.handleGetEntity(req, res, id);
        } else if (path === '/api/relationships') {
          this.handleGetRelationships(req, res);
        } else if (path === '/api/path') {
          this.handleGetPath(req, res);
        } else if (path === '/api/stats') {
          this.handleGetStats(req, res);
        } else if (path === '/api/context') {
          this.handleGetContext(req, res);
        } else if (path === '/api' || path === '/') {
          // API documentation
          this.sendJSON(res, {
            title: 'Knowledge Graph API',
            version: '1.0.0',
            endpoints: {
              'GET /api/entities': 'List all entities (supports: type, status, search query params)',
              'GET /api/entities/:id': 'Get specific entity with relationships',
              'GET /api/relationships': 'List relationships (supports: type, from, to query params)',
              'GET /api/path': 'Find path between entities (requires: from, to query params)',
              'GET /api/stats': 'Get graph statistics and analytics',
              'GET /api/context': 'Get context for an entity (requires: entityId, optional: depth query params)',
            },
            example: 'http://localhost:3000/api/entities?type=project&status=planning',
          });
        } else {
          this.sendError(res, 404, 'Endpoint not found');
        }
      } catch (error) {
        console.error('API Error:', error);
        this.sendError(res, 500, 'Internal server error');
      }
    });

    this.server.listen(this.port, () => {
      console.log(`🧠 Knowledge Graph API Server running on http://localhost:${this.port}`);
      console.log(`📊 Graph loaded: ${this.graph.nodes.length} entities, ${this.graph.edges.length} relationships`);
      console.log(`📖 API documentation: http://localhost:${this.port}/api`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('Knowledge Graph API Server stopped');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const graphPath = './knowledge-graph.json';
  const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3000;

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🧠 Knowledge Graph API Server');
    console.log('\nUsage:');
    console.log('  node knowledge-graph-api.js [options]');
    console.log('\nOptions:');
    console.log('  --port=<number>    Port to run the server on (default: 3000)');
    console.log('  --help, -h         Show this help message');
    console.log('\nExample:');
    console.log('  node knowledge-graph-api.js --port=8080');
    console.log('\nAPI Endpoints:');
    console.log('  GET /api/entities                    List all entities');
    console.log('  GET /api/entities?type=project       Filter by type');
    console.log('  GET /api/entities/:id                Get specific entity');
    console.log('  GET /api/relationships               List relationships');
    console.log('  GET /api/path?from=A&to=B            Find path between entities');
    console.log('  GET /api/stats                       Get graph statistics');
    console.log('  GET /api/context?entityId=A          Get entity context');
    return;
  }

  try {
    const api = new KnowledgeGraphAPI(graphPath, port);
    api.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      api.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start API server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = KnowledgeGraphAPI;
