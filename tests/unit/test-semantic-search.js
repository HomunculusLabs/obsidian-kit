#!/usr/bin/env node

const SemanticSearchEngine = require('./semantic-search-engine');

async function testSemanticSearch() {
  console.log('🧪 Testing Semantic Search Engine\n');

  try {
    // Initialize the search engine
    const engine = new SemanticSearchEngine('./Obsidian-Kit-Dev');
    await engine.initialize();

    // Test queries
    const testQueries = [
      'semantic search',
      'task management',
      'knowledge graph',
      'workflow automation',
      'AI agent',
      'documentation',
      'project planning',
      'obsidian plugin',
    ];

    console.log('📊 Search Engine Analytics:');
    const analytics = engine.generateAnalytics();
    console.log(`   Documents: ${analytics.totalDocuments}`);
    console.log(`   Chunks: ${analytics.totalChunks}`);
    console.log(`   Vocabulary: ${analytics.vocabularySize}`);
    console.log('   Document Types:', analytics.documentTypes);
    console.log('   Tags:', Object.keys(analytics.tags).slice(0, 5));
    console.log('');

    // Perform searches
    for (const query of testQueries) {
      console.log(`🔍 Searching for: "${query}"`);

      const results = await engine.search(query, {
        maxResults: 3,
        similarityThreshold: 0.2,
      });

      console.log(`   Found ${results.totalFound} results (showing top ${results.results.length}):`);

      for (const result of results.results) {
        console.log(`   📄 ${result.title} (${result.type})`);
        console.log(`      🎯 Score: ${result.score.toFixed(3)} (similarity: ${result.similarity.toFixed(3)})`);
        console.log(`      📁 ${result.path}`);

        if (result.metadata) {
          const meta = [];
          if (result.metadata.status) meta.push(`status: ${result.metadata.status}`);
          if (result.metadata.priority) meta.push(`priority: ${result.metadata.priority}`);
          if (result.metadata.tags.length > 0) meta.push(`tags: ${result.metadata.tags.join(', ')}`);
          if (meta.length > 0) console.log(`      📋 ${meta.join(' | ')}`);
        }

        // Show content preview
        const preview = result.content.substring(0, 150).replace(/\n/g, ' ');
        console.log(`      📝 ${preview}${result.content.length > 150 ? '...' : ''}`);
        console.log('');
      }

      // Show query suggestions
      const suggestions = engine.expandQuery(query);
      if (suggestions.length > 0) {
        console.log(`   💡 Query expansions: ${suggestions.join(', ')}`);
      }

      console.log('─'.repeat(60) + '\n');
    }

    // Test suggestions
    console.log('💡 Testing Search Suggestions:');
    const partialQueries = ['knowl', 'task', 'sem', 'work'];

    for (const partial of partialQueries) {
      const suggestions = engine.getSuggestions(partial);
      console.log(`   "${partial}" → ${suggestions.slice(0, 3).map(s => s.text || s).join(', ')}`);
    }

    console.log('\n✅ Semantic Search Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testSemanticSearch();
