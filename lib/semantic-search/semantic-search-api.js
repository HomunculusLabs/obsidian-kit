#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const SemanticSearchEngine = require('./semantic-search-engine');

class SemanticSearchAPI {
  constructor(vaultPath, port = 3001) {
    this.vaultPath = vaultPath;
    this.port = port;
    this.searchEngine = null;
    this.server = null;
    this.searchHistory = [];
    this.analytics = {
      totalSearches: 0,
      popularQueries: {},
      averageResults: 0,
      searchTimes: [],
    };
  }

  async initialize() {
    console.log('🔍 Initializing Semantic Search API...');

    try {
      this.searchEngine = new SemanticSearchEngine(this.vaultPath);
      await this.searchEngine.initialize();
      console.log('✅ Semantic Search API ready');
    } catch (error) {
      console.error('❌ Failed to initialize search engine:', error.message);
      throw error;
    }
  }

  // API endpoint handlers
  async handleSearch(req, res) {
    const query = url.parse(req.url, true).query;

    if (!query.q) {
      this.sendError(res, 400, 'Query parameter "q" is required');
      return;
    }

    const searchOptions = {
      maxResults: parseInt(query.max_results) || 10,
      similarityThreshold: parseFloat(query.threshold) || 0.3,
      includeMetadata: query.include_metadata !== 'false',
      boostRecent: query.boost_recent !== 'false',
      boostByType: query.boost_by_type ? JSON.parse(query.boost_by_type) : {},
    };

    const startTime = Date.now();

    try {
      const results = await this.searchEngine.search(query.q, searchOptions);
      const searchTime = Date.now() - startTime;

      // Update analytics
      this.updateAnalytics(query.q, results, searchTime);

      // Add to search history
      this.searchHistory.push({
        query: query.q,
        timestamp: new Date().toISOString(),
        resultCount: results.totalFound,
        searchTime,
      });

      // Keep only last 100 searches
      if (this.searchHistory.length > 100) {
        this.searchHistory = this.searchHistory.slice(-100);
      }

      this.sendJSON(res, {
        ...results,
        searchTime,
        analytics: {
          totalSearches: this.analytics.totalSearches,
          averageResults: this.analytics.averageResults,
        },
      });

    } catch (error) {
      console.error('Search error:', error);
      this.sendError(res, 500, 'Search failed');
    }
  }

  async handleSuggestions(req, res) {
    const query = url.parse(req.url, true).query;

    if (!query.q) {
      this.sendError(res, 400, 'Query parameter "q" is required');
      return;
    }

    try {
      const suggestions = this.searchEngine.getSuggestions(query.q);
      const expansions = this.searchEngine.expandQuery(query.q);

      this.sendJSON(res, {
        query: query.q,
        suggestions,
        expansions,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Suggestions error:', error);
      this.sendError(res, 500, 'Failed to get suggestions');
    }
  }

  handleAnalytics(req, res) {
    const engineAnalytics = this.searchEngine.generateAnalytics();

    this.sendJSON(res, {
      searchAnalytics: this.analytics,
      engineAnalytics,
      recentSearches: this.searchHistory.slice(-10),
      timestamp: new Date().toISOString(),
    });
  }

  handleStatus(req, res) {
    this.sendJSON(res, {
      status: 'running',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      documents: this.searchEngine.documents.size,
      vocabulary: this.searchEngine.vocabulary.size,
      lastSearch: this.searchHistory.length > 0 ?
        this.searchHistory[this.searchHistory.length - 1].timestamp : null,
      timestamp: new Date().toISOString(),
    });
  }

  async handleSimilarDocuments(req, res) {
    const query = url.parse(req.url, true).query;

    if (!query.doc_id) {
      this.sendError(res, 400, 'Document ID parameter "doc_id" is required');
      return;
    }

    try {
      const document = this.searchEngine.documents.get(query.doc_id);
      if (!document) {
        this.sendError(res, 404, 'Document not found');
        return;
      }

      // Use document content as query
      const searchQuery = document.title + ' ' + document.content.substring(0, 500);
      const results = await this.searchEngine.search(searchQuery, {
        maxResults: parseInt(query.max_results) || 5,
        similarityThreshold: parseFloat(query.threshold) || 0.2,
      });

      // Filter out the original document
      results.results = results.results.filter(result => result.documentId !== query.doc_id);

      this.sendJSON(res, {
        originalDocument: {
          id: document.id,
          title: document.title,
          type: document.type,
          path: document.path,
        },
        similarDocuments: results.results,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Similar documents error:', error);
      this.sendError(res, 500, 'Failed to find similar documents');
    }
  }

  async handleAdvancedSearch(req, res) {
    const query = url.parse(req.url, true).query;

    if (!query.q) {
      this.sendError(res, 400, 'Query parameter "q" is required');
      return;
    }

    try {
      // Parse advanced filters
      const filters = {
        type: query.type,
        status: query.status,
        priority: query.priority,
        tags: query.tags ? query.tags.split(',') : [],
        project: query.project,
      };

      // Perform search
      const results = await this.searchEngine.search(query.q, {
        maxResults: parseInt(query.max_results) || 20,
        similarityThreshold: parseFloat(query.threshold) || 0.2,
      });

      // Apply filters
      let filteredResults = results.results;

      if (filters.type) {
        filteredResults = filteredResults.filter(r => r.type === filters.type);
      }

      if (filters.status && filteredResults[0]?.metadata?.status) {
        filteredResults = filteredResults.filter(r =>
          r.metadata.status === filters.status,
        );
      }

      if (filters.priority && filteredResults[0]?.metadata?.priority) {
        filteredResults = filteredResults.filter(r =>
          r.metadata.priority === filters.priority,
        );
      }

      if (filters.tags.length > 0 && filteredResults[0]?.metadata?.tags) {
        filteredResults = filteredResults.filter(r =>
          filters.tags.some(tag => r.metadata.tags.includes(tag)),
        );
      }

      if (filters.project && filteredResults[0]?.metadata?.project) {
        filteredResults = filteredResults.filter(r =>
          r.metadata.project === filters.project,
        );
      }

      this.sendJSON(res, {
        query: query.q,
        filters,
        results: filteredResults,
        totalFound: filteredResults.length,
        totalBeforeFiltering: results.results.length,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Advanced search error:', error);
      this.sendError(res, 500, 'Advanced search failed');
    }
  }

  // Helper methods
  updateAnalytics(query, results, searchTime) {
    this.analytics.totalSearches++;
    this.analytics.searchTimes.push(searchTime);

    // Keep only last 100 search times
    if (this.analytics.searchTimes.length > 100) {
      this.analytics.searchTimes = this.analytics.searchTimes.slice(-100);
    }

    // Update popular queries
    const queryLower = query.toLowerCase();
    this.analytics.popularQueries[queryLower] =
            (this.analytics.popularQueries[queryLower] || 0) + 1;

    // Update average results
    this.analytics.averageResults =
            (this.analytics.averageResults * (this.analytics.totalSearches - 1) + results.totalFound) /
            this.analytics.totalSearches;
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
  async start() {
    await this.initialize();

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
        if (path === '/api/search') {
          this.handleSearch(req, res);
        } else if (path === '/api/suggestions') {
          this.handleSuggestions(req, res);
        } else if (path === '/api/analytics') {
          this.handleAnalytics(req, res);
        } else if (path === '/api/status') {
          this.handleStatus(req, res);
        } else if (path === '/api/similar') {
          this.handleSimilarDocuments(req, res);
        } else if (path === '/api/advanced-search') {
          this.handleAdvancedSearch(req, res);
        } else if (path === '/api' || path === '/') {
          // API documentation
          this.sendJSON(res, {
            title: 'Semantic Search API',
            version: '1.0.0',
            endpoints: {
              'GET /api/search': 'Perform semantic search (requires: q query param)',
              'GET /api/suggestions': 'Get search suggestions and expansions (requires: q query param)',
              'GET /api/analytics': 'Get search analytics and statistics',
              'GET /api/status': 'Get API status and system information',
              'GET /api/similar': 'Find similar documents (requires: doc_id query param)',
              'GET /api/advanced-search': 'Advanced search with filters (requires: q query param)',
            },
            parameters: {
              search: {
                q: 'Search query (required)',
                max_results: 'Maximum results to return (default: 10)',
                threshold: 'Similarity threshold (default: 0.3)',
                include_metadata: 'Include document metadata (default: true)',
                boost_recent: 'Boost recent documents (default: true)',
                boost_by_type: 'JSON object with type boosts (e.g., {"task": 0.1, "project": 0.2})',
              },
              advanced_search: {
                type: 'Filter by document type',
                status: 'Filter by status',
                priority: 'Filter by priority',
                tags: 'Filter by tags (comma-separated)',
                project: 'Filter by project',
              },
            },
            examples: {
              basic_search: 'http://localhost:3001/api/search?q=semantic%20search&max_results=5',
              advanced_search: 'http://localhost:3001/api/advanced-search?q=task&type=task&status=todo',
              similar_docs: 'http://localhost:3001/api/similar?doc_id=abc123',
              suggestions: 'http://localhost:3001/api/suggestions?q=knowl',
            },
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
      console.log(`🔍 Semantic Search API Server running on http://localhost:${this.port}`);
      console.log(`📚 Indexed ${this.searchEngine.documents.size} documents`);
      console.log(`📖 API documentation: http://localhost:${this.port}/api`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('Semantic Search API Server stopped');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const vaultPath = args.find(arg => !arg.startsWith('--')) || './Obsidian-Kit-Dev';
  const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3001;

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔍 Semantic Search API Server');
    console.log('\nUsage:');
    console.log('  node semantic-search-api.js [vault-path] [options]');
    console.log('\nOptions:');
    console.log('  --port=<number>    Port to run the server on (default: 3001)');
    console.log('  --help, -h         Show this help message');
    console.log('\nAPI Endpoints:');
    console.log('  GET /api/search                    Perform semantic search');
    console.log('  GET /api/suggestions               Get search suggestions');
    console.log('  GET /api/analytics                 Get search analytics');
    console.log('  GET /api/status                    Get API status');
    console.log('  GET /api/similar                   Find similar documents');
    console.log('  GET /api/advanced-search           Advanced search with filters');
    console.log('\nExample:');
    console.log('  node semantic-search-api.js --port=8080');
    return;
  }

  try {
    const api = new SemanticSearchAPI(vaultPath, port);
    await api.start();

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

module.exports = SemanticSearchAPI;
