#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SemanticSearchEngine {
  constructor(vaultPath, options = {}) {
    this.vaultPath = vaultPath;
    this.options = {
      chunkSize: options.chunkSize || 500,
      overlap: options.overlap || 50,
      maxResults: options.maxResults || 10,
      similarityThreshold: options.similarityThreshold || 0.3,
      ...options,
    };

    this.documents = new Map();
    this.embeddings = new Map();
    this.vocabulary = new Set();
    this.idfScores = new Map();
    this.knowledgeGraph = null;

    this.initialize();
  }

  async initialize() {
    console.log('🔍 Initializing Semantic Search Engine...');

    // Load knowledge graph if available
    const graphPath = path.join(this.vaultPath, '../knowledge-graph.json');
    if (fs.existsSync(graphPath)) {
      this.knowledgeGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
      console.log(`📊 Loaded knowledge graph with ${this.knowledgeGraph.nodes.length} entities`);
    }

    // Process vault documents
    await this.processVault();

    // Build vocabulary and IDF scores
    this.buildVocabulary();
    this.calculateIDFScores();

    console.log(`✅ Initialized with ${this.documents.size} documents and ${this.vocabulary.size} unique terms`);
  }

  async processVault() {
    const directories = [
      '4 - Projects',
      '.specify',
      'agents',
      '3 - Templates',
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.vaultPath, dir);
      if (fs.existsSync(fullPath)) {
        await this.processDirectory(fullPath);
      }
    }
  }

  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        await this.processDirectory(itemPath);
      } else if (item.endsWith('.md')) {
        await this.processDocument(itemPath);
      }
    }
  }

  async processDocument(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.vaultPath, filePath);

    // Extract frontmatter and body
    const frontmatter = this.extractFrontmatter(content);
    const body = content.replace(/^---\n.*?\n---\n/s, '');

    // Create document metadata
    const docId = this.generateDocumentId(relativePath);
    const document = {
      id: docId,
      path: relativePath,
      title: frontmatter.title || this.extractTitle(body),
      type: this.getDocumentType(relativePath, frontmatter),
      tags: frontmatter.tags || [],
      status: frontmatter.status,
      priority: frontmatter.priority,
      project: frontmatter.project,
      content: body,
      frontmatter,
      createdAt: frontmatter.created_date,
      modifiedAt: frontmatter.completed_date,
    };

    // Split content into chunks
    const chunks = this.chunkText(body);

    document.chunks = chunks.map((chunk, index) => ({
      id: `${docId}_chunk_${index}`,
      content: chunk,
      index,
      documentId: docId,
    }));

    this.documents.set(docId, document);
  }

  extractFrontmatter(content) {
    const match = content.match(/^---\n(.*?)\n---\n/s);
    if (!match) return {};

    const frontmatter = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
        }

        frontmatter[key] = value;
      }
    }

    return frontmatter;
  }

  extractTitle(body) {
    const match = body.match(/^#\s+(.+)$/m);
    return match ? match[1] : '';
  }

  getDocumentType(relativePath, frontmatter) {
    if (relativePath.includes('/Tasks/')) return 'task';
    if (relativePath.includes('4 - Projects') && !relativePath.includes('/Tasks/')) return 'project';
    if (relativePath.includes('.specify')) return 'specification';
    if (relativePath.includes('agents')) return 'agent';
    if (relativePath.includes('3 - Templates')) return 'template';
    return 'note';
  }

  generateDocumentId(relativePath) {
    return crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 8);
  }

  chunkText(text, chunkSize = this.options.chunkSize, overlap = this.options.overlap) {
    const words = text.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  // Text preprocessing and tokenization
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 2);
  }

  buildVocabulary() {
    for (const doc of this.documents.values()) {
      for (const chunk of doc.chunks) {
        const tokens = this.preprocessText(chunk.content);
        tokens.forEach(token => this.vocabulary.add(token));
      }
    }
  }

  calculateIDFScores() {
    const docCount = this.documents.size;
    const docFrequency = new Map();

    // Calculate document frequency for each term
    for (const doc of this.documents.values()) {
      const docTerms = new Set();

      for (const chunk of doc.chunks) {
        const tokens = this.preprocessText(chunk.content);
        tokens.forEach(token => docTerms.add(token));
      }

      docTerms.forEach(term => {
        docFrequency.set(term, (docFrequency.get(term) || 0) + 1);
      });
    }

    // Calculate IDF scores
    for (const [term, df] of docFrequency) {
      const idf = Math.log(docCount / df);
      this.idfScores.set(term, idf);
    }
  }

  // Create TF-IDF vector for text
  createVector(text) {
    const tokens = this.preprocessText(text);
    const vector = new Map();

    // Calculate term frequencies
    for (const token of tokens) {
      vector.set(token, (vector.get(token) || 0) + 1);
    }

    // Apply TF-IDF weighting
    for (const [term, tf] of vector) {
      const idf = this.idfScores.get(term) || 0;
      vector.set(term, tf * idf);
    }

    return vector;
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const [term, weight1] of vec1) {
      const weight2 = vec2.get(term) || 0;
      dotProduct += weight1 * weight2;
      norm1 += weight1 * weight1;
    }

    for (const weight2 of vec2.values()) {
      norm2 += weight2 * weight2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Enhanced semantic search with multiple strategies
  async search(query, options = {}) {
    const searchOptions = {
      maxResults: options.maxResults || this.options.maxResults,
      similarityThreshold: options.similarityThreshold || this.options.similarityThreshold,
      includeMetadata: options.includeMetadata !== false,
      boostRecent: options.boostRecent !== false,
      boostByType: options.boostByType || {},
      ...options,
    };

    console.log(`🔍 Searching for: "${query}"`);

    // Create query vector
    const queryVector = this.createVector(query);

    // Search results
    const results = [];

    // Search through all chunks
    for (const doc of this.documents.values()) {
      for (const chunk of doc.chunks) {
        const chunkVector = this.createVector(chunk.content);
        const similarity = this.cosineSimilarity(queryVector, chunkVector);

        if (similarity >= searchOptions.similarityThreshold) {
          // Calculate relevance score with boosting
          let score = similarity;

          // Boost recent documents
          if (searchOptions.boostRecent && doc.modifiedAt) {
            const daysSinceModified = (Date.now() - new Date(doc.modifiedAt)) / (1000 * 60 * 60 * 24);
            const recencyBoost = Math.max(0, 1 - daysSinceModified / 365);
            score += recencyBoost * 0.1;
          }

          // Boost by document type
          const typeBoost = searchOptions.boostByType[doc.type] || 0;
          score += typeBoost;

          // Boost exact title matches
          if (doc.title && doc.title.toLowerCase().includes(query.toLowerCase())) {
            score += 0.2;
          }

          // Knowledge graph context boost
          if (this.knowledgeGraph) {
            const contextBoost = this.calculateContextBoost(doc, query);
            score += contextBoost;
          }

          results.push({
            id: chunk.id,
            documentId: doc.id,
            title: doc.title,
            type: doc.type,
            path: doc.path,
            content: chunk.content,
            score,
            similarity,
            metadata: searchOptions.includeMetadata ? {
              tags: doc.tags,
              status: doc.status,
              priority: doc.priority,
              project: doc.project,
              chunkIndex: chunk.index,
            } : null,
          });
        }
      }
    }

    // Sort by score and return top results
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, searchOptions.maxResults);

    console.log(`📊 Found ${sortedResults.length} relevant results`);

    return {
      query,
      totalFound: results.length,
      results: sortedResults,
      searchTime: Date.now(),
    };
  }

  // Calculate context boost using knowledge graph
  calculateContextBoost(doc, query) {
    if (!this.knowledgeGraph) return 0;

    let boost = 0;

    // Find related entities in knowledge graph
    const relatedEntities = this.findRelatedEntities(doc, query);

    // Boost based on entity relationships
    for (const entity of relatedEntities) {
      if (entity.type === 'project') boost += 0.05;
      if (entity.type === 'task') boost += 0.03;
      if (entity.type === 'concept') boost += 0.02;
    }

    return Math.min(boost, 0.15); // Cap the boost
  }

  findRelatedEntities(doc, query) {
    const related = [];

    // Simple matching based on document metadata
    if (this.knowledgeGraph) {
      for (const node of this.knowledgeGraph.nodes) {
        if (node.name && (
          doc.title?.toLowerCase().includes(node.name.toLowerCase()) ||
                    query.toLowerCase().includes(node.name.toLowerCase()) ||
                    doc.tags.some(tag => tag.toLowerCase().includes(node.name.toLowerCase()))
        )) {
          related.push(node);
        }
      }
    }

    return related;
  }

  // Query expansion and suggestions
  expandQuery(query) {
    const expansions = [];
    const queryTerms = this.preprocessText(query);

    // Find similar terms using co-occurrence
    for (const term of queryTerms) {
      const similarTerms = this.findSimilarTerms(term);
      expansions.push(...similarTerms);
    }

    // Add knowledge graph entities
    if (this.knowledgeGraph) {
      for (const node of this.knowledgeGraph.nodes) {
        if (node.name && node.name.toLowerCase().includes(query.toLowerCase())) {
          expansions.push(node.name);
        }
      }
    }

    return [...new Set(expansions)].slice(0, 5);
  }

  findSimilarTerms(term) {
    const similar = [];
    const termVector = this.createVector(term);

    // Simple character-based similarity for now
    for (const vocabTerm of this.vocabulary) {
      if (vocabTerm !== term && vocabTerm.length > 3) {
        const similarity = this.stringSimilarity(term, vocabTerm);
        if (similarity > 0.7) {
          similar.push(vocabTerm);
        }
      }
    }

    return similar.slice(0, 3);
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

  // Get search suggestions
  getSuggestions(partialQuery) {
    const suggestions = [];
    const queryLower = partialQuery.toLowerCase();

    // Suggest from document titles
    for (const doc of this.documents.values()) {
      if (doc.title && doc.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: doc.title,
          type: 'document',
          path: doc.path,
        });
      }
    }

    // Suggest from vocabulary
    for (const term of this.vocabulary) {
      if (term.toLowerCase().startsWith(queryLower) && term.length > 3) {
        suggestions.push({
          text: term,
          type: 'term',
        });
      }
    }

    return suggestions.slice(0, 8);
  }

  // Export search index
  exportIndex(outputPath) {
    const index = {
      metadata: {
        createdAt: new Date().toISOString(),
        documentCount: this.documents.size,
        vocabularySize: this.vocabulary.size,
        options: this.options,
      },
      documents: Array.from(this.documents.values()).map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        path: doc.path,
        tags: doc.tags,
        chunkCount: doc.chunks.length,
      })),
      vocabulary: Array.from(this.vocabulary),
      idfScores: Object.fromEntries(this.idfScores),
    };

    fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
    console.log(`💾 Search index exported to ${outputPath}`);
  }

  // Generate search analytics
  generateAnalytics() {
    const typeStats = {};
    const tagStats = {};
    const statusStats = {};

    for (const doc of this.documents.values()) {
      typeStats[doc.type] = (typeStats[doc.type] || 0) + 1;

      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => {
          tagStats[tag] = (tagStats[tag] || 0) + 1;
        });
      }

      if (doc.status) {
        statusStats[doc.status] = (statusStats[doc.status] || 0) + 1;
      }
    }

    return {
      documentTypes: typeStats,
      tags: tagStats,
      statuses: statusStats,
      totalDocuments: this.documents.size,
      totalChunks: Array.from(this.documents.values()).reduce((sum, doc) => sum + doc.chunks.length, 0),
      vocabularySize: this.vocabulary.size,
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const vaultPath = args.find(arg => !arg.startsWith('--')) || './Obsidian-Kit-Dev';

  const options = {
    maxResults: parseInt(args.find(arg => arg.startsWith('--max-results='))?.split('=')[1]) || 10,
    similarityThreshold: parseFloat(args.find(arg => arg.startsWith('--threshold='))?.split('=')[1]) || 0.3,
    export: args.find(arg => arg.startsWith('--export='))?.split('=')[1],
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔍 Semantic Search Engine');
    console.log('\nUsage:');
    console.log('  node semantic-search-engine.js [vault-path] [options]');
    console.log('\nOptions:');
    console.log('  --max-results=<number>    Maximum results to return (default: 10)');
    console.log('  --threshold=<number>      Similarity threshold (default: 0.3)');
    console.log('  --export=<path>           Export search index to file');
    console.log('  --help, -h                Show this help message');
    console.log('\nInteractive Search:');
    console.log('  Run without options to enter interactive search mode');
    return;
  }

  try {
    const engine = new SemanticSearchEngine(vaultPath, options);

    if (options.export) {
      engine.exportIndex(options.export);
    }

    // Interactive search mode
    if (args.length === 0 || (args.length === 1 && !args[0].startsWith('--'))) {
      console.log('\n🔍 Interactive Semantic Search');
      console.log('Type your search query or "exit" to quit\n');

      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const askQuery = () => {
        rl.question('🔎 Search: ', async (query) => {
          if (query.toLowerCase() === 'exit') {
            rl.close();
            return;
          }

          if (query.trim()) {
            const results = await engine.search(query);

            console.log(`\n📊 Found ${results.totalFound} results (showing top ${results.results.length}):\n`);

            for (const result of results.results) {
              console.log(`📄 ${result.title} (${result.type})`);
              console.log(`   📁 ${result.path}`);
              console.log(`   🎯 Score: ${result.score.toFixed(3)} (similarity: ${result.similarity.toFixed(3)})`);

              if (result.metadata) {
                const meta = [];
                if (result.metadata.status) meta.push(`status: ${result.metadata.status}`);
                if (result.metadata.priority) meta.push(`priority: ${result.metadata.priority}`);
                if (result.metadata.tags.length > 0) meta.push(`tags: ${result.metadata.tags.join(', ')}`);
                if (meta.length > 0) console.log(`   📋 ${meta.join(' | ')}`);
              }

              // Show content preview
              const preview = result.content.substring(0, 200);
              console.log(`   📝 ${preview}${result.content.length > 200 ? '...' : ''}\n`);
            }

            // Show query suggestions
            const suggestions = engine.expandQuery(query);
            if (suggestions.length > 0) {
              console.log(`💡 Query expansions: ${suggestions.join(', ')}\n`);
            }
          }

          askQuery();
        });
      };

      askQuery();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SemanticSearchEngine;
