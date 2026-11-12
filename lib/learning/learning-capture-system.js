#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class LearningCaptureSystem {
  constructor(vaultPath, options = {}) {
    this.vaultPath = vaultPath;
    this.options = {
      insightConfidence: options.insightConfidence || 0.7,
      knowledgeGapThreshold: options.knowledgeGapThreshold || 0.5,
      learningRetentionDays: options.learningRetentionDays || 90,
      maxInsightsPerActivity: options.maxInsightsPerActivity || 5,
      ...options,
    };

    this.insights = new Map();
    this.knowledgeGaps = new Map();
    this.learningPatterns = new Map();
    this.activities = [];
    this.knowledgeGraph = null;
    this.semanticSearch = null;

    this.initialize();
  }

  async initialize() {
    console.log('🎓 Initializing Learning Capture System...');

    // Load existing knowledge graph
    const graphPath = path.join(this.vaultPath, '../knowledge-graph.json');
    if (fs.existsSync(graphPath)) {
      this.knowledgeGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    }

    // Load semantic search engine
    try {
      const SemanticSearchEngine = require('./semantic-search-engine');
      this.semanticSearch = new SemanticSearchEngine(this.vaultPath);
      await this.semanticSearch.initialize();
    } catch (error) {
      console.warn('⚠️  Semantic search engine not available:', error.message);
    }

    // Load existing learning data
    this.loadLearningData();

    // Process recent activities
    await this.processRecentActivities();

    console.log(`✅ Initialized with ${this.insights.size} insights and ${this.knowledgeGaps.size} knowledge gaps`);
  }

  loadLearningData() {
    const learningDataPath = path.join(this.vaultPath, '../learning-data.json');
    if (fs.existsSync(learningDataPath)) {
      const data = JSON.parse(fs.readFileSync(learningDataPath, 'utf8'));
      this.insights = new Map(data.insights || []);
      this.knowledgeGaps = new Map(data.knowledgeGaps || []);
      this.learningPatterns = new Map(data.learningPatterns || []);
      this.activities = data.activities || [];
    }
  }

  saveLearningData() {
    const learningDataPath = path.join(this.vaultPath, '../learning-data.json');
    const data = {
      insights: Array.from(this.insights.entries()),
      knowledgeGaps: Array.from(this.knowledgeGaps.entries()),
      learningPatterns: Array.from(this.learningPatterns.entries()),
      activities: this.activities,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(learningDataPath, JSON.stringify(data, null, 2));
  }

  // Phase 1: Activity Analysis
  async processRecentActivities() {
    console.log('🔍 Analyzing recent activities...');

    // Get completed tasks and recent changes
    const completedTasks = await this.getCompletedTasks();
    const recentChanges = await this.getRecentChanges();

    // Process each activity for insights
    for (const task of completedTasks) {
      await this.extractInsightsFromTask(task);
    }

    for (const change of recentChanges) {
      await this.extractInsightsFromChange(change);
    }

    console.log(`📊 Processed ${completedTasks.length + recentChanges.length} activities`);
  }

  async getCompletedTasks() {
    const completedTasks = [];
    const tasksDir = path.join(this.vaultPath, '4 - Projects');

    if (!fs.existsSync(tasksDir)) return completedTasks;

    const processDirectory = (dirPath) => {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          processDirectory(itemPath);
        } else if (item.endsWith('.md') && itemPath.includes('/Tasks/')) {
          const content = fs.readFileSync(itemPath, 'utf8');
          const frontmatter = this.extractFrontmatter(content);

          if (frontmatter.status === 'completed' || frontmatter.status === 'done') {
            completedTasks.push({
              path: path.relative(this.vaultPath, itemPath),
              frontmatter,
              content: content.replace(/^---\n.*?\n---\n/s, ''),
              completedAt: frontmatter.completed_date || new Date().toISOString(),
            });
          }
        }
      }
    };

    processDirectory(tasksDir);
    return completedTasks;
  }

  async getRecentChanges() {
    // This would integrate with git or file system monitoring
    // For now, return recent markdown files
    const recentChanges = [];
    const directories = ['4 - Projects', '.specify', 'agents'];

    for (const dir of directories) {
      const dirPath = path.join(this.vaultPath, dir);
      if (fs.existsSync(dirPath)) {
        await this.scanDirectoryForChanges(dirPath, recentChanges);
      }
    }

    return recentChanges;
  }

  async scanDirectoryForChanges(dirPath, changes, depth = 0) {
    if (depth > 3) return; // Limit recursion depth

    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          await this.scanDirectoryForChanges(itemPath, changes, depth + 1);
        } else if (item.endsWith('.md')) {
          const mtime = stat.mtime;
          const daysSinceModified = (Date.now() - mtime.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceModified <= 7) { // Recent changes within 7 days
            const content = fs.readFileSync(itemPath, 'utf8');
            changes.push({
              path: path.relative(this.vaultPath, itemPath),
              content: content.replace(/^---\n.*?\n---\n/s, ''),
              modifiedAt: mtime.toISOString(),
              type: 'file_modification',
            });
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error scanning directory ${dirPath}:`, error.message);
    }
  }

  async extractInsightsFromTask(task) {
    const insights = [];

    // Extract insights from task content
    const contentInsights = await this.analyzeContentForInsights(task.content, 'task');
    insights.push(...contentInsights);

    // Extract insights from frontmatter
    const metadataInsights = this.analyzeMetadataForInsights(task.frontmatter);
    insights.push(...metadataInsights);

    // Extract pattern-based insights
    const patternInsights = this.extractPatternInsights(task);
    insights.push(...patternInsights);

    // Store insights with confidence scores
    for (const insight of insights) {
      const insightId = this.generateInsightId(insight);
      insight.confidence = this.calculateInsightConfidence(insight, task);

      if (insight.confidence >= this.options.insightConfidence) {
        this.insights.set(insightId, {
          ...insight,
          source: task.path,
          sourceType: 'task',
          extractedAt: new Date().toISOString(),
          taskId: task.frontmatter.title || path.basename(task.path, '.md'),
        });
      }
    }

    // Record activity
    this.activities.push({
      type: 'task_completion',
      path: task.path,
      insightsExtracted: insights.filter(i => i.confidence >= this.options.insightConfidence).length,
      timestamp: new Date().toISOString(),
    });
  }

  async extractInsightsFromChange(change) {
    const insights = await this.analyzeContentForInsights(change.content, 'change');

    for (const insight of insights) {
      const insightId = this.generateInsightId(insight);
      insight.confidence = this.calculateInsightConfidence(insight, change);

      if (insight.confidence >= this.options.insightConfidence) {
        this.insights.set(insightId, {
          ...insight,
          source: change.path,
          sourceType: 'file_modification',
          extractedAt: new Date().toISOString(),
        });
      }
    }

    this.activities.push({
      type: 'file_modification',
      path: change.path,
      insightsExtracted: insights.filter(i => i.confidence >= this.options.insightConfidence).length,
      timestamp: new Date().toISOString(),
    });
  }

  async analyzeContentForInsights(content, context) {
    const insights = [];

    // Problem-solution pattern
    const problemSolutionMatches = content.match(/(?:problem|issue|challenge|bug)[\s\S]*?(?:solution|fix|resolve|answer)[\s\S]*?(?:\n\n|\n#|$)/gi);
    if (problemSolutionMatches) {
      for (const match of problemSolutionMatches) {
        insights.push({
          type: 'problem_solution',
          category: 'learning',
          title: this.extractInsightTitle(match),
          content: match.trim(),
          context,
          tags: ['problem-solving', 'solution'],
        });
      }
    }

    // Decision rationale pattern
    const decisionMatches = content.match(/(?:decision|chose|selected|decided)[\s\S]*?(?:because|reason|due to|as)[\s\S]*?(?:\n\n|\n#|$)/gi);
    if (decisionMatches) {
      for (const match of decisionMatches) {
        insights.push({
          type: 'decision_rationale',
          category: 'decision',
          title: this.extractInsightTitle(match),
          content: match.trim(),
          context,
          tags: ['decision-making', 'rationale'],
        });
      }
    }

    // Best practice pattern
    const bestPracticeMatches = content.match(/(?:best practice|recommendation|should|avoid|always|never)[\s\S]*?(?:\n\n|\n#|$)/gi);
    if (bestPracticeMatches) {
      for (const match of bestPracticeMatches) {
        insights.push({
          type: 'best_practice',
          category: 'guideline',
          title: this.extractInsightTitle(match),
          content: match.trim(),
          context,
          tags: ['best-practice', 'guideline'],
        });
      }
    }

    // Learning/discovery pattern
    const learningMatches = content.match(/(?:learned|discovered|found|realized|noticed)[\s\S]*?(?:\n\n|\n#|$)/gi);
    if (learningMatches) {
      for (const match of learningMatches) {
        insights.push({
          type: 'learning',
          category: 'discovery',
          title: this.extractInsightTitle(match),
          content: match.trim(),
          context,
          tags: ['learning', 'discovery'],
        });
      }
    }

    // Technical insight pattern
    const technicalMatches = content.match(/(?:implementation|approach|technique|method)[\s\S]*?(?:works|effective|successful|failed)[\s\S]*?(?:\n\n|\n#|$)/gi);
    if (technicalMatches) {
      for (const match of technicalMatches) {
        insights.push({
          type: 'technical_insight',
          category: 'technical',
          title: this.extractInsightTitle(match),
          content: match.trim(),
          context,
          tags: ['technical', 'implementation'],
        });
      }
    }

    return insights.slice(0, this.options.maxInsightsPerActivity);
  }

  analyzeMetadataForInsights(frontmatter) {
    const insights = [];

    // Time estimation insights
    if (frontmatter.time_estimate && frontmatter.time_spent) {
      const estimated = parseInt(frontmatter.time_estimate);
      const actual = parseInt(frontmatter.time_spent);

      if (estimated && actual) {
        const variance = Math.abs(estimated - actual) / estimated;
        if (variance > 0.5) { // More than 50% variance
          insights.push({
            type: 'time_estimation',
            category: 'planning',
            title: `Time Estimation Variance: ${actual}h vs estimated ${estimated}h`,
            content: `Task took ${actual > estimated ? 'longer' : 'shorter'} than expected by ${Math.round(variance * 100)}%`,
            tags: ['planning', 'estimation', 'time-management'],
          });
        }
      }
    }

    // Priority insights
    if (frontmatter.priority === 'high' && frontmatter.status === 'completed') {
      insights.push({
        type: 'priority_completion',
        category: 'execution',
        title: 'High Priority Task Completed',
        content: 'Successfully completed high priority task',
        tags: ['priority', 'execution', 'success'],
      });
    }

    return insights;
  }

  extractPatternInsights(task) {
    const insights = [];

    // Dependency resolution insights
    if (task.frontmatter.dependencies && task.frontmatter.dependencies.length > 0) {
      insights.push({
        type: 'dependency_management',
        category: 'coordination',
        title: `Task with ${task.frontmatter.dependencies.length} Dependencies Completed`,
        content: `Successfully managed and completed task with dependencies: ${task.frontmatter.dependencies.join(', ')}`,
        tags: ['dependencies', 'coordination', 'planning'],
      });
    }

    return insights;
  }

  extractInsightTitle(content) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();

    // Remove markdown formatting
    const title = firstLine
      .replace(/^#+\s*/, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .trim();

    return title.length > 80 ? title.substring(0, 77) + '...' : title;
  }

  calculateInsightConfidence(insight, source) {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on insight type
    const typeBoosts = {
      'problem_solution': 0.3,
      'decision_rationale': 0.25,
      'best_practice': 0.2,
      'learning': 0.35,
      'technical_insight': 0.3,
    };

    confidence += typeBoosts[insight.type] || 0;

    // Boost confidence based on content length
    if (insight.content.length > 100) confidence += 0.1;
    if (insight.content.length > 300) confidence += 0.1;

    // Boost confidence based on specific indicators
    if (insight.content.includes('because')) confidence += 0.1;
    if (insight.content.includes('successful')) confidence += 0.1;
    if (insight.content.includes('learned')) confidence += 0.15;

    // Boost confidence for completed tasks
    if (source.frontmatter && source.frontmatter.status === 'completed') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  generateInsightId(insight) {
    const hash = crypto.createHash('md5');
    hash.update(insight.type + insight.title + insight.content.substring(0, 100));
    return hash.digest('hex').substring(0, 12);
  }

  // Phase 2: Gap Analysis
  async identifyKnowledgeGaps() {
    console.log('🔍 Identifying knowledge gaps...');

    // Analyze question patterns
    await this.analyzeQuestionPatterns();

    // Identify missing documentation
    await this.identifyMissingDocumentation();

    // Detect concept gaps
    await this.detectConceptGaps();

    // Analyze search patterns
    await this.analyzeSearchPatterns();

    console.log(`📊 Identified ${this.knowledgeGaps.size} knowledge gaps`);
  }

  async analyzeQuestionPatterns() {
    // Look for unanswered questions in the vault
    const questionPattern = /\?(?!\s*(?:\n|$|[^.]*\.))/g;
    const directories = ['4 - Projects', '.specify', 'agents'];

    for (const dir of directories) {
      const dirPath = path.join(this.vaultPath, dir);
      if (fs.existsSync(dirPath)) {
        await this.scanDirectoryForQuestions(dirPath);
      }
    }
  }

  async scanDirectoryForQuestions(dirPath, depth = 0) {
    if (depth > 3) return;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        await this.scanDirectoryForQuestions(itemPath, depth + 1);
      } else if (item.endsWith('.md')) {
        const content = fs.readFileSync(itemPath, 'utf8');
        const questions = content.match(/\?[^.]*$/gm) || [];

        for (const question of questions) {
          const gapId = this.generateGapId('question', question);
          this.knowledgeGaps.set(gapId, {
            type: 'unanswered_question',
            category: 'information',
            title: `Unanswered Question: ${question.trim()}`,
            content: question.trim(),
            source: path.relative(this.vaultPath, itemPath),
            priority: this.calculateGapPriority('question', question),
            identifiedAt: new Date().toISOString(),
            tags: ['question', 'information-gap'],
          });
        }
      }
    }
  }

  async identifyMissingDocumentation() {
    if (!this.knowledgeGraph) return;

    // Find technologies without documentation
    const technologies = this.knowledgeGraph.nodes.filter(n => n.type === 'technology');

    for (const tech of technologies) {
      const hasDocumentation = await this.checkTechnologyDocumentation(tech.name);

      if (!hasDocumentation) {
        const gapId = this.generateGapId('documentation', tech.name);
        this.knowledgeGaps.set(gapId, {
          type: 'missing_documentation',
          category: 'documentation',
          title: `Missing Documentation for ${tech.name}`,
          content: `No comprehensive documentation found for ${tech.name}`,
          priority: 'medium',
          identifiedAt: new Date().toISOString(),
          tags: ['documentation', 'technology', tech.name.toLowerCase()],
        });
      }
    }
  }

  async checkTechnologyDocumentation(techName) {
    if (!this.semanticSearch) return false;

    const results = await this.semanticSearch.search(techName, {
      maxResults: 5,
      similarityThreshold: 0.5,
    });

    return results.results.length > 0;
  }

  async detectConceptGaps() {
    // Analyze task descriptions for concepts that aren't well-defined
    const completedTasks = await this.getCompletedTasks();

    for (const task of completedTasks) {
      const concepts = this.extractConceptsFromContent(task.content);

      for (const concept of concepts) {
        const isWellDefined = await this.checkConceptDefinition(concept);

        if (!isWellDefined) {
          const gapId = this.generateGapId('concept', concept);
          this.knowledgeGaps.set(gapId, {
            type: 'poorly_defined_concept',
            category: 'concept',
            title: `Poorly Defined Concept: ${concept}`,
            content: `Concept "${concept}" is referenced but not well defined`,
            source: task.path,
            priority: 'low',
            identifiedAt: new Date().toISOString(),
            tags: ['concept', 'definition', concept.toLowerCase()],
          });
        }
      }
    }
  }

  extractConceptsFromContent(content) {
    const concepts = [];

    // Technical concepts
    const techConceptPattern = /\b(?:architecture|pattern|framework|methodology|approach|strategy|design|implementation)\b/gi;
    const matches = content.match(techConceptPattern) || [];
    concepts.push(...matches);

    // Domain-specific concepts (capitalize words that might be concepts)
    const domainConceptPattern = /\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g;
    const domainMatches = content.match(domainConceptPattern) || [];
    concepts.push(...domainMatches);

    return [...new Set(concepts)].filter(c => c.length > 3);
  }

  async checkConceptDefinition(concept) {
    if (!this.semanticSearch) return true; // Assume well-defined if can't check

    const results = await this.semanticSearch.search(`${concept} definition`, {
      maxResults: 3,
      similarityThreshold: 0.6,
    });

    return results.results.length > 0;
  }

  async analyzeSearchPatterns() {
    // This would integrate with search analytics
    // For now, create placeholder gaps based on common search patterns
    const commonSearchPatterns = [
      'how to implement',
      'best practices for',
      'troubleshooting',
      'examples of',
      'documentation for',
    ];

    for (const pattern of commonSearchPatterns) {
      const gapId = this.generateGapId('search_pattern', pattern);
      this.knowledgeGaps.set(gapId, {
        type: 'search_pattern_gap',
        category: 'information',
        title: `Common Search Pattern: ${pattern}`,
        content: `Users frequently search for "${pattern}" - may need better documentation`,
        priority: 'medium',
        identifiedAt: new Date().toISOString(),
        tags: ['search-pattern', 'documentation', 'user-needs'],
      });
    }
  }

  calculateGapPriority(type, content) {
    const priorities = {
      'unanswered_question': 'high',
      'missing_documentation': 'medium',
      'poorly_defined_concept': 'low',
      'search_pattern_gap': 'medium',
    };

    return priorities[type] || 'medium';
  }

  generateGapId(type, content) {
    const hash = crypto.createHash('md5');
    hash.update(type + content);
    return hash.digest('hex').substring(0, 12);
  }

  // Phase 3: Learning Organization
  async organizeLearning() {
    console.log('📚 Organizing learning insights...');

    // Categorize insights
    await this.categorizeInsights();

    // Build learning taxonomy
    await this.buildLearningTaxonomy();

    // Create knowledge connections
    await this.createKnowledgeConnections();

    // Implement learning retrieval
    await this.implementLearningRetrieval();

    console.log(`📊 Organized ${this.insights.size} insights into categories`);
  }

  async categorizeInsights() {
    const categories = {
      'problem-solving': [],
      'decision-making': [],
      'best-practices': [],
      'technical-learning': [],
      'process-improvement': [],
      'planning-estimation': [],
    };

    for (const [id, insight] of this.insights) {
      const category = this.determineInsightCategory(insight);
      if (category && categories[category]) {
        categories[category].push(insight);
      }
    }

    // Store categorized insights
    for (const [category, insights] of Object.entries(categories)) {
      this.learningPatterns.set(`category:${category}`, {
        type: 'category',
        name: category,
        insights: insights.map(i => i.id),
        count: insights.length,
        lastUpdated: new Date().toISOString(),
      });
    }
  }

  determineInsightCategory(insight) {
    const categoryKeywords = {
      'problem-solving': ['problem', 'issue', 'challenge', 'bug', 'fix', 'solution'],
      'decision-making': ['decision', 'chose', 'selected', 'because', 'reason'],
      'best-practices': ['best practice', 'recommendation', 'should', 'avoid', 'always'],
      'technical-learning': ['implementation', 'technical', 'approach', 'method'],
      'process-improvement': ['process', 'workflow', 'improvement', 'efficiency'],
      'planning-estimation': ['estimate', 'planning', 'time', 'schedule'],
    };

    const content = (insight.title + ' ' + insight.content).toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        return category;
      }
    }

    return null;
  }

  async buildLearningTaxonomy() {
    const taxonomy = {
      domains: [],
      skills: [],
      technologies: [],
      concepts: [],
    };

    // Extract domains from insights
    for (const [id, insight] of this.insights) {
      // Extract domains
      const domains = this.extractDomains(insight);
      taxonomy.domains.push(...domains);

      // Extract skills
      const skills = this.extractSkills(insight);
      taxonomy.skills.push(...skills);

      // Extract technologies
      const technologies = this.extractTechnologies(insight);
      taxonomy.technologies.push(...technologies);

      // Extract concepts
      const concepts = this.extractConcepts(insight);
      taxonomy.concepts.push(...concepts);
    }

    // Store taxonomy
    this.learningPatterns.set('taxonomy', {
      type: 'taxonomy',
      domains: [...new Set(taxonomy.domains)],
      skills: [...new Set(taxonomy.skills)],
      technologies: [...new Set(taxonomy.technologies)],
      concepts: [...new Set(taxonomy.concepts)],
      lastUpdated: new Date().toISOString(),
    });
  }

  extractDomains(insight) {
    const domains = [];
    const content = (insight.title + ' ' + insight.content).toLowerCase();

    const domainKeywords = {
      'development': ['code', 'programming', 'development', 'implementation'],
      'design': ['design', 'architecture', 'ui', 'ux'],
      'management': ['project', 'task', 'management', 'planning'],
      'documentation': ['documentation', 'writing', 'readme'],
      'testing': ['test', 'testing', 'quality', 'assurance'],
      'deployment': ['deploy', 'deployment', 'release', 'production'],
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        domains.push(domain);
      }
    }

    return domains;
  }

  extractSkills(insight) {
    const skills = [];
    const content = (insight.title + ' ' + insight.content).toLowerCase();

    const skillKeywords = [
      'problem-solving', 'communication', 'planning', 'estimation',
      'debugging', 'optimization', 'refactoring', 'testing',
      'documentation', 'analysis', 'design', 'implementation',
    ];

    for (const skill of skillKeywords) {
      if (content.includes(skill)) {
        skills.push(skill);
      }
    }

    return skills;
  }

  extractTechnologies(insight) {
    const technologies = [];
    const content = (insight.title + ' ' + insight.content);

    const techPattern = /\b(?:JavaScript|TypeScript|Node\.js|React|Vue|Angular|Python|Docker|Kubernetes|AWS|Azure|GCP|Obsidian|Dataview|Templater|MCP|REST|GraphQL|API|Git|GitHub)\b/g;
    const matches = content.match(techPattern) || [];
    technologies.push(...matches);

    return [...new Set(technologies)];
  }

  extractConcepts(insight) {
    const concepts = [];
    const content = (insight.title + ' ' + insight.content);

    // Extract capitalized terms that might be concepts
    const conceptPattern = /\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g;
    const matches = content.match(conceptPattern) || [];

    // Filter out common words
    const filtered = matches.filter(match =>
      !['The', 'This', 'That', 'When', 'Where', 'Why', 'How', 'What', 'A', 'An'].includes(match),
    );

    concepts.push(...filtered);
    return [...new Set(concepts)];
  }

  async createKnowledgeConnections() {
    // Create connections between related insights
    const connections = [];

    for (const [id1, insight1] of this.insights) {
      for (const [id2, insight2] of this.insights) {
        if (id1 >= id2) continue; // Avoid duplicates

        const similarity = this.calculateInsightSimilarity(insight1, insight2);
        if (similarity > 0.6) {
          connections.push({
            from: id1,
            to: id2,
            type: 'similar_insight',
            strength: similarity,
          });
        }
      }
    }

    // Store connections
    this.learningPatterns.set('connections', {
      type: 'connections',
      connections,
      count: connections.length,
      lastUpdated: new Date().toISOString(),
    });
  }

  calculateInsightSimilarity(insight1, insight2) {
    // Simple similarity calculation based on shared tags and content
    let similarity = 0;

    // Tag similarity
    const tags1 = new Set(insight1.tags || []);
    const tags2 = new Set(insight2.tags || []);
    const tagIntersection = new Set([...tags1].filter(tag => tags2.has(tag)));
    const tagUnion = new Set([...tags1, ...tags2]);

    if (tagUnion.size > 0) {
      similarity += (tagIntersection.size / tagUnion.size) * 0.4;
    }

    // Category similarity
    if (insight1.category === insight2.category) {
      similarity += 0.3;
    }

    // Content similarity (simple word overlap)
    const words1 = new Set((insight1.title + ' ' + insight1.content).toLowerCase().split(/\s+/));
    const words2 = new Set((insight2.title + ' ' + insight2.content).toLowerCase().split(/\s+/));
    const wordIntersection = new Set([...words1].filter(word => words2.has(word)));
    const wordUnion = new Set([...words1, ...words2]);

    if (wordUnion.size > 0) {
      similarity += (wordIntersection.size / wordUnion.size) * 0.3;
    }

    return similarity;
  }

  async implementLearningRetrieval() {
    // Create retrieval indexes
    const retrievalIndex = {
      byTag: {},
      byCategory: {},
      byType: {},
      byTechnology: {},
      byDomain: {},
    };

    for (const [id, insight] of this.insights) {
      // Index by tags
      for (const tag of insight.tags || []) {
        if (!retrievalIndex.byTag[tag]) {
          retrievalIndex.byTag[tag] = [];
        }
        retrievalIndex.byTag[tag].push(id);
      }

      // Index by category
      if (insight.category) {
        if (!retrievalIndex.byCategory[insight.category]) {
          retrievalIndex.byCategory[insight.category] = [];
        }
        retrievalIndex.byCategory[insight.category].push(id);
      }

      // Index by type
      if (!retrievalIndex.byType[insight.type]) {
        retrievalIndex.byType[insight.type] = [];
      }
      retrievalIndex.byType[insight.type].push(id);

      // Index by technology
      const technologies = this.extractTechnologies(insight);
      for (const tech of technologies) {
        if (!retrievalIndex.byTechnology[tech]) {
          retrievalIndex.byTechnology[tech] = [];
        }
        retrievalIndex.byTechnology[tech].push(id);
      }

      // Index by domain
      const domains = this.extractDomains(insight);
      for (const domain of domains) {
        if (!retrievalIndex.byDomain[domain]) {
          retrievalIndex.byDomain[domain] = [];
        }
        retrievalIndex.byDomain[domain].push(id);
      }
    }

    // Store retrieval index
    this.learningPatterns.set('retrieval_index', {
      type: 'retrieval_index',
      index: retrievalIndex,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Phase 4: Recommendation System
  async generateRecommendations(context = {}) {
    console.log('💡 Generating learning recommendations...');

    const recommendations = [];

    // Context-based recommendations
    if (context.currentTask) {
      const taskRecommendations = await this.generateTaskRecommendations(context.currentTask);
      recommendations.push(...taskRecommendations);
    }

    // Knowledge gap-based recommendations
    const gapRecommendations = await this.generateGapRecommendations();
    recommendations.push(...gapRecommendations);

    // Learning path recommendations
    const pathRecommendations = await this.generateLearningPathRecommendations();
    recommendations.push(...pathRecommendations);

    // Collaboration recommendations
    const collaborationRecommendations = await this.generateCollaborationRecommendations();
    recommendations.push(...collaborationRecommendations);

    // Sort by relevance and return top recommendations
    return recommendations
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  }

  async generateTaskRecommendations(currentTask) {
    const recommendations = [];

    // Find similar completed tasks
    const similarTasks = await this.findSimilarTasks(currentTask);

    for (const task of similarTasks) {
      const taskInsights = Array.from(this.insights.values())
        .filter(insight => insight.source === task.path);

      for (const insight of taskInsights) {
        recommendations.push({
          type: 'task_insight',
          title: `Learning from similar task: ${task.title}`,
          content: insight.content,
          source: insight.source,
          relevance: this.calculateTaskRelevance(currentTask, task),
          tags: ['task-learning', 'similar-task'],
          insightId: insight.id,
        });
      }
    }

    return recommendations;
  }

  async findSimilarTasks(currentTask) {
    // This would use semantic search to find similar tasks
    // For now, return tasks with similar tags or categories
    const completedTasks = await this.getCompletedTasks();

    return completedTasks.filter(task => {
      if (!task.frontmatter.tags || !currentTask.tags) return false;

      const taskTags = new Set(task.frontmatter.tags);
      const currentTags = new Set(currentTask.tags);

      const intersection = new Set([...taskTags].filter(tag => currentTags.has(tag)));
      return intersection.size > 0;
    });
  }

  calculateTaskRelevance(currentTask, completedTask) {
    let relevance = 0;

    // Tag overlap
    if (currentTask.tags && completedTask.frontmatter.tags) {
      const currentTags = new Set(currentTask.tags);
      const completedTags = new Set(completedTask.frontmatter.tags);
      const intersection = new Set([...currentTags].filter(tag => completedTags.has(tag)));
      relevance += (intersection.size / Math.max(currentTags.size, completedTags.size)) * 0.5;
    }

    // Category overlap
    if (currentTask.category === completedTask.frontmatter.project) {
      relevance += 0.3;
    }

    // Priority boost
    if (completedTask.frontmatter.priority === 'high') {
      relevance += 0.2;
    }

    return Math.min(relevance, 1.0);
  }

  async generateGapRecommendations() {
    const recommendations = [];

    // Get high-priority knowledge gaps
    const highPriorityGaps = Array.from(this.knowledgeGaps.values())
      .filter(gap => gap.priority === 'high');

    for (const gap of highPriorityGaps) {
      recommendations.push({
        type: 'knowledge_gap',
        title: `Address Knowledge Gap: ${gap.title}`,
        content: gap.content,
        source: gap.source,
        relevance: 0.8,
        tags: ['knowledge-gap', 'learning-opportunity'],
        gapId: gap.id,
        priority: gap.priority,
      });
    }

    return recommendations;
  }

  async generateLearningPathRecommendations() {
    const recommendations = [];

    // Analyze learning patterns to suggest paths
    const taxonomy = this.learningPatterns.get('taxonomy');
    if (!taxonomy) return recommendations;

    // Find domains with many insights but low coverage
    for (const domain of taxonomy.domains) {
      const domainInsights = Array.from(this.insights.values())
        .filter(insight => this.extractDomains(insight).includes(domain));

      if (domainInsights.length > 0 && domainInsights.length < 5) {
        recommendations.push({
          type: 'learning_path',
          title: `Deepen ${domain} knowledge`,
          content: `You have ${domainInsights.length} insights in ${domain}. Consider deepening this knowledge area.`,
          relevance: 0.6,
          tags: ['learning-path', 'domain-knowledge'],
          domain,
          currentInsights: domainInsights.length,
        });
      }
    }

    return recommendations;
  }

  async generateCollaborationRecommendations() {
    const recommendations = [];

    // Find insights that could benefit from collaboration
    const complexInsights = Array.from(this.insights.values())
      .filter(insight =>
        insight.type === 'decision_rationale' ||
                insight.type === 'problem_solution',
      );

    for (const insight of complexInsights) {
      recommendations.push({
        type: 'collaboration',
        title: `Share Learning: ${insight.title}`,
        content: 'Consider sharing this insight with team members for broader learning',
        source: insight.source,
        relevance: 0.5,
        tags: ['collaboration', 'knowledge-sharing'],
        insightId: insight.id,
      });
    }

    return recommendations;
  }

  // Utility methods
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

  // Public API methods
  async getInsights(filters = {}) {
    let insights = Array.from(this.insights.values());

    if (filters.category) {
      insights = insights.filter(insight => insight.category === filters.category);
    }

    if (filters.type) {
      insights = insights.filter(insight => insight.type === filters.type);
    }

    if (filters.tags) {
      insights = insights.filter(insight =>
        filters.tags.some(tag => insight.tags.includes(tag)),
      );
    }

    if (filters.minConfidence) {
      insights = insights.filter(insight => insight.confidence >= filters.minConfidence);
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  async getKnowledgeGaps(filters = {}) {
    let gaps = Array.from(this.knowledgeGaps.values());

    if (filters.priority) {
      gaps = gaps.filter(gap => gap.priority === filters.priority);
    }

    if (filters.type) {
      gaps = gaps.filter(gap => gap.type === filters.type);
    }

    return gaps.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  }

  async getLearningAnalytics() {
    const analytics = {
      totalInsights: this.insights.size,
      totalGaps: this.knowledgeGaps.size,
      insightsByCategory: {},
      insightsByType: {},
      gapsByPriority: {},
      recentActivities: this.activities.slice(-10),
      learningTrends: this.calculateLearningTrends(),
    };

    // Calculate insight distributions
    for (const insight of this.insights.values()) {
      analytics.insightsByCategory[insight.category] = (analytics.insightsByCategory[insight.category] || 0) + 1;
      analytics.insightsByType[insight.type] = (analytics.insightsByType[insight.type] || 0) + 1;
    }

    // Calculate gap distributions
    for (const gap of this.knowledgeGaps.values()) {
      analytics.gapsByPriority[gap.priority] = (analytics.gapsByPriority[gap.priority] || 0) + 1;
    }

    return analytics;
  }

  calculateLearningTrends() {
    const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentActivities = this.activities.filter(activity =>
      new Date(activity.timestamp).getTime() > last30Days,
    );

    const dailyInsights = {};
    for (const activity of recentActivities) {
      const date = new Date(activity.timestamp).toISOString().split('T')[0];
      dailyInsights[date] = (dailyInsights[date] || 0) + activity.insightsExtracted;
    }

    return {
      dailyInsights,
      totalRecentInsights: recentActivities.reduce((sum, activity) => sum + activity.insightsExtracted, 0),
      averageInsightsPerDay: Object.keys(dailyInsights).length > 0
        ? Object.values(dailyInsights).reduce((sum, count) => sum + count, 0) / Object.keys(dailyInsights).length
        : 0,
    };
  }

  async generateLearningReport() {
    const analytics = await this.getLearningAnalytics();
    const topInsights = await this.getInsights({ minConfidence: 0.8 });
    const highPriorityGaps = await this.getKnowledgeGaps({ priority: 'high' });
    const recommendations = await this.generateRecommendations();

    return {
      summary: analytics,
      topInsights: topInsights.slice(0, 5),
      highPriorityGaps: highPriorityGaps.slice(0, 5),
      recommendations: recommendations.slice(0, 5),
      generatedAt: new Date().toISOString(),
    };
  }

  // Save and cleanup
  async saveAndCleanup() {
    this.saveLearningData();

    // Cleanup old insights
    const cutoffDate = Date.now() - (this.options.learningRetentionDays * 24 * 60 * 60 * 1000);

    for (const [id, insight] of this.insights) {
      if (new Date(insight.extractedAt).getTime() < cutoffDate) {
        this.insights.delete(id);
      }
    }

    console.log('💾 Learning data saved and cleanup completed');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const vaultPath = args.find(arg => !arg.startsWith('--')) || './Obsidian-Kit-Dev';

  const options = {
    insightConfidence: parseFloat(args.find(arg => arg.startsWith('--confidence='))?.split('=')[1]) || 0.7,
    knowledgeGapThreshold: parseFloat(args.find(arg => arg.startsWith('--gap-threshold='))?.split('=')[1]) || 0.5,
    generateReport: args.includes('--report'),
    getRecommendations: args.includes('--recommendations'),
    showAnalytics: args.includes('--analytics'),
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🎓 Learning Capture System');
    console.log('\nUsage:');
    console.log('  node learning-capture-system.js [vault-path] [options]');
    console.log('\nOptions:');
    console.log('  --confidence=<number>     Minimum insight confidence (default: 0.7)');
    console.log('  --gap-threshold=<number>  Knowledge gap threshold (default: 0.5)');
    console.log('  --report                  Generate learning report');
    console.log('  --recommendations         Get learning recommendations');
    console.log('  --analytics               Show learning analytics');
    console.log('  --help, -h                Show this help message');
    return;
  }

  try {
    const learningSystem = new LearningCaptureSystem(vaultPath, options);

    // Run the full learning capture process
    await learningSystem.identifyKnowledgeGaps();
    await learningSystem.organizeLearning();

    if (options.showAnalytics) {
      const analytics = await learningSystem.getLearningAnalytics();
      console.log('\n📊 Learning Analytics:');
      console.log(`   Total Insights: ${analytics.totalInsights}`);
      console.log(`   Total Knowledge Gaps: ${analytics.totalGaps}`);
      console.log(`   Recent Activities: ${analytics.recentActivities.length}`);
      console.log('\n📈 Learning Trends (Last 30 Days):');
      console.log(`   Total Recent Insights: ${analytics.learningTrends.totalRecentInsights}`);
      console.log(`   Average Insights Per Day: ${analytics.learningTrends.averageInsightsPerDay.toFixed(2)}`);
    }

    if (options.getRecommendations) {
      const recommendations = await learningSystem.generateRecommendations();
      console.log('\n💡 Learning Recommendations:');
      for (const rec of recommendations.slice(0, 5)) {
        console.log(`   • ${rec.title}`);
        console.log(`     ${rec.content.substring(0, 100)}...`);
        console.log(`     Relevance: ${rec.relevance.toFixed(2)} | Tags: ${rec.tags.join(', ')}`);
        console.log();
      }
    }

    if (options.generateReport) {
      const report = await learningSystem.generateLearningReport();
      const reportPath = path.join(process.cwd(), 'learning-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Learning report generated: ${reportPath}`);
    }

    await learningSystem.saveAndCleanup();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = LearningCaptureSystem;
