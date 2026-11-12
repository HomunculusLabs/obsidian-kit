#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class KnowledgeGraphExtractor {
  constructor(vaultPath) {
    this.vaultPath = vaultPath;
    this.entities = new Map();
    this.relationships = [];
    this.graph = { nodes: [], edges: [] };
  }

  // Extract entities from markdown files
  async extractFromVault() {
    console.log('🔍 Extracting knowledge from vault...');

    // Focus on key directories
    const directories = [
      '4 - Projects',
      '.specify',
      'agents',
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.vaultPath, dir);
      if (fs.existsSync(fullPath)) {
        await this.processDirectory(fullPath);
      }
    }

    this.buildGraph();
    return this.graph;
  }

  // Process directory recursively
  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        await this.processDirectory(itemPath);
      } else if (item.endsWith('.md')) {
        await this.processMarkdownFile(itemPath);
      }
    }
  }

  // Process individual markdown file
  async processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.vaultPath, filePath);

    // Extract frontmatter
    const frontmatter = this.extractFrontmatter(content);
    const body = content.replace(/^---\n.*?\n---\n/s, '');

    // Extract entities based on file type and location
    if (relativePath.includes('4 - Projects')) {
      this.extractProjectEntities(relativePath, frontmatter, body);
    } else if (relativePath.includes('.specify')) {
      this.extractSpecificationEntities(relativePath, frontmatter, body);
    } else if (relativePath.includes('agents')) {
      this.extractAgentEntities(relativePath, frontmatter, body);
    }

    // Extract common entities
    this.extractCommonEntities(relativePath, frontmatter, body);
  }

  // Extract frontmatter from markdown
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

        // Handle quoted values
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        // Handle array values
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
        }

        frontmatter[key] = value;
      }
    }

    return frontmatter;
  }

  // Extract project-related entities
  extractProjectEntities(relativePath, frontmatter, body) {
    const pathParts = relativePath.split('/');

    // Project entity
    if (pathParts.length === 2 && !relativePath.includes('/Tasks/')) {
      const projectId = `project:${pathParts[1].replace('.md', '')}`;
      this.addEntity(projectId, {
        type: 'project',
        name: frontmatter.title || pathParts[1].replace('.md', ''),
        status: frontmatter.status,
        priority: frontmatter.priority,
        description: frontmatter.description,
        tags: frontmatter.tags || [],
        path: relativePath,
      });
    }

    // Task entity
    if (relativePath.includes('/Tasks/')) {
      const taskId = `task:${pathParts[pathParts.length - 1].replace('.md', '')}`;
      const projectName = pathParts[2]; // Extract project name from path

      this.addEntity(taskId, {
        type: 'task',
        name: frontmatter.title,
        status: frontmatter.status,
        priority: frontmatter.priority,
        project: projectName,
        assignee: frontmatter.assignee,
        timeEstimate: frontmatter.time_estimate,
        dependencies: frontmatter.dependencies || [],
        tags: frontmatter.tags || [],
        path: relativePath,
      });

      // Task -> Project relationship
      this.addRelationship(taskId, `project:${projectName}`, 'belongs_to');

      // Task dependencies
      if (frontmatter.dependencies) {
        for (const dep of frontmatter.dependencies) {
          this.addRelationship(taskId, `task:${dep}`, 'depends_on');
        }
      }
    }
  }

  // Extract specification entities
  extractSpecificationEntities(relativePath, frontmatter, body) {
    const pathParts = relativePath.split('/');
    const specType = pathParts[1]; // memory, specs, workflows
    const fileName = pathParts[pathParts.length - 1].replace('.md', '');

    const entityId = `spec:${specType}:${fileName}`;
    this.addEntity(entityId, {
      type: 'specification',
      subtype: specType,
      name: fileName,
      title: this.extractTitle(body),
      path: relativePath,
    });
  }

  // Extract agent entities
  extractAgentEntities(relativePath, frontmatter, body) {
    const fileName = path.basename(relativePath, '.md');
    const agentId = `agent:${fileName}`;

    this.addEntity(agentId, {
      type: 'agent',
      name: fileName,
      capabilities: this.extractCapabilities(body),
      path: relativePath,
    });
  }

  // Extract common entities (technologies, concepts, etc.)
  extractCommonEntities(relativePath, frontmatter, body) {
    // Extract technologies mentioned
    const techPatterns = [
      /\b(TypeScript|JavaScript|Node\.js|React|Vue|Angular|Python|Docker|Kubernetes|AWS|Azure|GCP)\b/g,
      /\b(Obsidian|Dataview|Templater|MCP|REST API|GraphQL)\b/g,
    ];

    for (const pattern of techPatterns) {
      const matches = body.match(pattern);
      if (matches) {
        for (const tech of matches) {
          const techId = `tech:${tech.toLowerCase().replace(/\./g, '')}`;
          this.addEntity(techId, {
            type: 'technology',
            name: tech,
          });

          // Link technology to the document
          const docId = this.getDocumentId(relativePath);
          if (docId) {
            this.addRelationship(docId, techId, 'uses');
          }
        }
      }
    }

    // Extract concepts and keywords
    const conceptPatterns = [
      /\b(knowledge graph|semantic search|workflow automation|task management|AI agent|documentation)\b/gi,
      /\b(dependency management|progress tracking|intelligent notifications|spec-driven development)\b/gi,
    ];

    for (const pattern of conceptPatterns) {
      const matches = body.match(pattern);
      if (matches) {
        for (const concept of matches) {
          const conceptId = `concept:${concept.toLowerCase().replace(/\s+/g, '-')}`;
          this.addEntity(conceptId, {
            type: 'concept',
            name: concept,
          });

          // Link concept to the document
          const docId = this.getDocumentId(relativePath);
          if (docId) {
            this.addRelationship(docId, conceptId, 'mentions');
          }
        }
      }
    }
  }

  // Helper methods
  addEntity(id, properties) {
    if (!this.entities.has(id)) {
      this.entities.set(id, { id, ...properties });
    } else {
      // Merge properties
      const existing = this.entities.get(id);
      this.entities.set(id, { ...existing, ...properties });
    }
  }

  addRelationship(fromId, toId, type) {
    // Avoid duplicate relationships
    const exists = this.relationships.some(rel =>
      rel.from === fromId && rel.to === toId && rel.type === type,
    );

    if (!exists) {
      this.relationships.push({ from: fromId, to: toId, type });
    }
  }

  getDocumentId(relativePath) {
    if (relativePath.includes('/Tasks/')) {
      const pathParts = relativePath.split('/');
      return `task:${pathParts[pathParts.length - 1].replace('.md', '')}`;
    } else if (relativePath.includes('4 - Projects') && !relativePath.includes('/Tasks/')) {
      const pathParts = relativePath.split('/');
      return `project:${pathParts[1].replace('.md', '')}`;
    } else if (relativePath.includes('.specify')) {
      const pathParts = relativePath.split('/');
      return `spec:${pathParts[1]}:${pathParts[pathParts.length - 1].replace('.md', '')}`;
    } else if (relativePath.includes('agents')) {
      const fileName = path.basename(relativePath, '.md');
      return `agent:${fileName}`;
    }
    return null;
  }

  extractTitle(body) {
    const match = body.match(/^#\s+(.+)$/m);
    return match ? match[1] : '';
  }

  extractCapabilities(body) {
    const capabilities = [];
    const lines = body.split('\n');

    for (const line of lines) {
      if (line.includes('capability') || line.includes('feature') || line.includes('function')) {
        capabilities.push(line.trim());
      }
    }

    return capabilities;
  }

  // Build final graph structure
  buildGraph() {
    // Convert entities to nodes
    this.graph.nodes = Array.from(this.entities.values());

    // Convert relationships to edges
    this.graph.edges = this.relationships.map(rel => ({
      source: rel.from,
      target: rel.to,
      type: rel.type,
    }));

    // Add metadata
    this.graph.metadata = {
      extractedAt: new Date().toISOString(),
      totalNodes: this.graph.nodes.length,
      totalEdges: this.graph.edges.length,
      entityTypes: this.getEntityTypeStats(),
    };
  }

  getEntityTypeStats() {
    const stats = {};
    for (const entity of this.entities.values()) {
      stats[entity.type] = (stats[entity.type] || 0) + 1;
    }
    return stats;
  }

  // Save graph to file
  saveGraph(outputPath) {
    const graphData = JSON.stringify(this.graph, null, 2);
    fs.writeFileSync(outputPath, graphData);
    console.log(`✅ Knowledge graph saved to ${outputPath}`);
  }

  // Generate summary report
  generateReport() {
    console.log('\n📊 Knowledge Graph Summary:');
    console.log(`   Total Entities: ${this.graph.nodes.length}`);
    console.log(`   Total Relationships: ${this.graph.edges.length}`);
    console.log('\n🏷️  Entity Types:');

    const typeStats = this.getEntityTypeStats();
    for (const [type, count] of Object.entries(typeStats)) {
      console.log(`   ${type}: ${count}`);
    }

    console.log('\n🔗 Relationship Types:');
    const relTypes = {};
    for (const rel of this.relationships) {
      relTypes[rel.type] = (relTypes[rel.type] || 0) + 1;
    }
    for (const [type, count] of Object.entries(relTypes)) {
      console.log(`   ${type}: ${count}`);
    }

    // Sample entities
    console.log('\n📝 Sample Entities:');
    const sampleEntities = this.graph.nodes.slice(0, 5);
    for (const entity of sampleEntities) {
      console.log(`   ${entity.type}: ${entity.name || entity.id}`);
    }

    // Sample relationships
    console.log('\n🔗 Sample Relationships:');
    const sampleRels = this.graph.edges.slice(0, 5);
    for (const rel of sampleRels) {
      console.log(`   ${rel.source} -> ${rel.target} (${rel.type})`);
    }
  }
}

// CLI execution
async function main() {
  const vaultPath = process.argv[2] || './Obsidian-Kit-Dev';
  const outputPath = process.argv[3] || './knowledge-graph.json';

  console.log('🧠 Knowledge Graph Extractor');
  console.log(`📁 Vault: ${vaultPath}`);
  console.log(`💾 Output: ${outputPath}`);

  const extractor = new KnowledgeGraphExtractor(vaultPath);
  const graph = await extractor.extractFromVault();

  extractor.saveGraph(outputPath);
  extractor.generateReport();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = KnowledgeGraphExtractor;
