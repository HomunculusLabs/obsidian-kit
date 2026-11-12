const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
class AutomatedTaskGenerationEngine {
    constructor(vaultPath) {
        this.vaultPath = vaultPath;
        this.specsPath = path.join(vaultPath, '.specify');
        this.projectsPath = path.join(vaultPath, '4 - Projects');
        this.taskPatterns = new Map();
        this.generatedTasks = [];
        this.duplicateThreshold = 0.8; // Similarity threshold for duplicate detection
    }
    async initialize() {
        console.log(chalk.blue('🤖 Initializing Automated Task Generation Engine...'));
        await this.loadExistingTasks();
        await this.loadTaskPatterns();
        console.log(chalk.green('✅ Engine initialized successfully'));
    }
    async loadExistingTasks() {
        try {
            const taskFiles = await this.findTaskFiles(this.projectsPath);
            for (const filePath of taskFiles) {
                const content = await fs.readFile(filePath, 'utf8');
                const task = this.parseTaskFile(content, filePath);
                if (task) {
                    this.taskPatterns.set(task.title.toLowerCase(), task);
                }
            }
            console.log(chalk.green(`✅ Loaded ${taskFiles.length} existing tasks`));
        }
        catch (error) {
            console.log(chalk.yellow(`⚠️  Could not load existing tasks: ${error.message}`));
        }
    }
    async loadTaskPatterns() {
        // Load common task patterns from historical data
        this.commonPatterns = {
            specification: [
                { pattern: /implement|create|build|develop/i, type: 'implementation', priority: 'high' },
                { pattern: /test|verify|validate/i, type: 'testing', priority: 'medium' },
                { pattern: /document|write|update/i, type: 'documentation', priority: 'low' },
                { pattern: /research|investigate|analyze/i, type: 'research', priority: 'medium' },
                { pattern: /refactor|optimize|improve/i, type: 'optimization', priority: 'medium' },
                { pattern: /deploy|release|publish/i, type: 'deployment', priority: 'high' },
                { pattern: /fix|bug|issue/i, type: 'bugfix', priority: 'high' },
                { pattern: /review|audit|check/i, type: 'review', priority: 'medium' }
            ],
            recurring: [
                { title: 'Weekly project review', frequency: 'weekly', estimate: 60 },
                { title: 'Update documentation', frequency: 'weekly', estimate: 45 },
                { title: 'Code quality check', frequency: 'weekly', estimate: 30 },
                { title: 'Dependency security audit', frequency: 'monthly', estimate: 120 },
                { title: 'Performance monitoring', frequency: 'weekly', estimate: 45 },
                { title: 'Backup verification', frequency: 'weekly', estimate: 15 }
            ]
        };
    }
    async findTaskFiles(dir) {
        const files = [];
        async function traverse(currentDir) {
            const items = await fs.readdir(currentDir);
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory() && item.includes('Tasks')) {
                    const subItems = await fs.readdir(fullPath);
                    for (const subItem of subItems) {
                        if (subItem.endsWith('.md')) {
                            files.push(path.join(fullPath, subItem));
                        }
                    }
                }
                else if (stat.isDirectory()) {
                    await traverse(fullPath);
                }
            }
        }
        await traverse(dir);
        return files;
    }
    parseTaskFile(content, filePath) {
        try {
            const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontMatterMatch)
                return null;
            const frontMatter = yaml.parse(frontMatterMatch[1]);
            const titleMatch = content.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : frontMatter.title || 'Unknown';
            return {
                title: frontMatter.title || title,
                status: frontMatter.status || 'todo',
                priority: frontMatter.priority || 'medium',
                time_estimate: frontMatter.time_estimate || 0,
                time_spent: frontMatter.time_spent || 0,
                project: frontMatter.project || '',
                tags: frontMatter.tags || [],
                subtasks: frontMatter.subtasks || [],
                dependencies: frontMatter.dependencies || [],
                created_date: frontMatter.created_date,
                completed_date: frontMatter.completed_date,
                description: this.extractDescription(content),
                filePath: filePath
            };
        }
        catch (error) {
            return null;
        }
    }
    extractDescription(content) {
        const lines = content.split('\n');
        const descriptionStart = lines.findIndex(line => line.startsWith('# '));
        if (descriptionStart === -1)
            return '';
        let description = '';
        for (let i = descriptionStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('##') || line.startsWith('---'))
                break;
            description += line + '\n';
        }
        return description.trim();
    }
    async generateFromSpecifications() {
        console.log(chalk.blue('📋 Generating tasks from specifications...'));
        if (!await fs.pathExists(this.specsPath)) {
            console.log(chalk.yellow('⚠️  No .specify directory found'));
            return [];
        }
        const generatedTasks = [];
        // Process requirements.md
        const requirementsPath = path.join(this.specsPath, 'specs', 'requirements.md');
        if (await fs.pathExists(requirementsPath)) {
            const content = await fs.readFile(requirementsPath, 'utf8');
            const tasks = this.extractTasksFromRequirements(content);
            generatedTasks.push(...tasks);
        }
        // Process architecture.md
        const architecturePath = path.join(this.specsPath, 'specs', 'architecture.md');
        if (await fs.pathExists(architecturePath)) {
            const content = await fs.readFile(architecturePath, 'utf8');
            const tasks = this.extractTasksFromArchitecture(content);
            generatedTasks.push(...tasks);
        }
        // Process workflow documents
        const workflowsPath = path.join(this.specsPath, 'workflows');
        if (await fs.pathExists(workflowsPath)) {
            const workflowFiles = await fs.readdir(workflowsPath);
            for (const file of workflowFiles) {
                if (file.endsWith('.md')) {
                    const content = await fs.readFile(path.join(workflowsPath, file), 'utf8');
                    const tasks = this.extractTasksFromWorkflow(content);
                    generatedTasks.push(...tasks);
                }
            }
        }
        console.log(chalk.green(`✅ Generated ${generatedTasks.length} tasks from specifications`));
        return generatedTasks;
    }
    extractTasksFromRequirements(content) {
        const tasks = [];
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Extract from checkbox items
            if (line.startsWith('- [ ]')) {
                const taskText = line.replace('- [ ]', '').trim();
                if (taskText.length > 10) { // Filter out very short items
                    const task = this.createTaskFromText(taskText, 'requirements');
                    if (task)
                        tasks.push(task);
                }
            }
            // Extract from user stories
            if (line.match(/^\d+\.\s+As a/)) {
                const task = this.createTaskFromUserStory(line);
                if (task)
                    tasks.push(task);
            }
        }
        return tasks;
    }
    extractTasksFromArchitecture(content) {
        const tasks = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            // Look for implementation points in architecture
            if (trimmed.includes('implement') || trimmed.includes('create') || trimmed.includes('build')) {
                const task = this.createTaskFromText(trimmed, 'architecture');
                if (task)
                    tasks.push(task);
            }
        }
        return tasks;
    }
    extractTasksFromWorkflow(content) {
        const tasks = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            // Extract action items from workflows
            if (trimmed.startsWith('- [ ]') || trimmed.includes('TODO:') || trimmed.includes('ACTION:')) {
                const taskText = trimmed.replace(/^-\s*\[\s*\]\s*/, '').replace(/TODO:\s*/, '').replace(/ACTION:\s*/, '').trim();
                if (taskText.length > 10) {
                    const task = this.createTaskFromText(taskText, 'workflow');
                    if (task)
                        tasks.push(task);
                }
            }
        }
        return tasks;
    }
    createTaskFromUserStory(userStory) {
        const match = userStory.match(/^\d+\.\s+As a\s+([^,]+),\s+I want\s+([^,]+)\s+so that\s+(.+)$/);
        if (!match)
            return null;
        const [, userType, goal, benefit] = match;
        return {
            title: `Implement ${goal} for ${userType}`,
            description: `User Story: As a ${userType}, I want ${goal} so that ${benefit}`,
            type: 'implementation',
            priority: 'medium',
            estimated_time: this.estimateTimeFromText(goal),
            source: 'user-story',
            tags: ['user-story', 'implementation', 'ai-generated']
        };
    }
    createTaskFromText(text, source) {
        // Determine task type and priority based on patterns
        let type = 'implementation';
        let priority = 'medium';
        for (const pattern of this.commonPatterns.specification) {
            if (pattern.pattern.test(text)) {
                type = pattern.type;
                priority = pattern.priority;
                break;
            }
        }
        // Clean up the title
        let title = text
            .replace(/^[^a-zA-Z]*/, '') // Remove leading non-letters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        // Limit title length
        if (title.length > 100) {
            title = title.substring(0, 97) + '...';
        }
        return {
            title: this.capitalizeFirst(title),
            description: `Automatically generated from ${source}: ${text}`,
            type,
            priority,
            estimated_time: this.estimateTimeFromText(text),
            source,
            tags: ['ai-generated', type, source]
        };
    }
    async generateFromCodeChanges() {
        console.log(chalk.blue('💻 Generating tasks from code changes...'));
        const tasks = [];
        try {
            // Get recent commits
            const gitLog = execSync('git log --oneline -10', { encoding: 'utf8', cwd: this.vaultPath });
            const commits = gitLog.split('\n').filter(line => line.trim());
            for (const commit of commits) {
                const commitTasks = this.extractTasksFromCommit(commit);
                tasks.push(...commitTasks);
            }
            // Check for uncommitted changes
            try {
                const gitStatus = execSync('git status --porcelain', { encoding: 'utf8', cwd: this.vaultPath });
                if (gitStatus.trim()) {
                    const uncommittedTasks = this.extractTasksFromUncommittedChanges(gitStatus);
                    tasks.push(...uncommittedTasks);
                }
            }
            catch (error) {
                // Git status might fail if not in a git repo
            }
        }
        catch (error) {
            console.log(chalk.yellow('⚠️  Could not analyze git history'));
        }
        console.log(chalk.green(`✅ Generated ${tasks.length} tasks from code changes`));
        return tasks;
    }
    extractTasksFromCommit(commit) {
        const tasks = [];
        const [hash, ...messageParts] = commit.split(' ');
        const message = messageParts.join(' ');
        // Look for patterns in commit messages
        if (message.toLowerCase().includes('fix') || message.toLowerCase().includes('bug')) {
            tasks.push({
                title: `Verify fix: ${message}`,
                description: `Test and verify the fix implemented in commit ${hash}`,
                type: 'testing',
                priority: 'high',
                estimated_time: 30,
                source: 'commit',
                tags: ['ai-generated', 'testing', 'verification']
            });
        }
        if (message.toLowerCase().includes('add') || message.toLowerCase().includes('implement')) {
            tasks.push({
                title: `Document new feature: ${message}`,
                description: `Create documentation for the new feature added in commit ${hash}`,
                type: 'documentation',
                priority: 'medium',
                estimated_time: 45,
                source: 'commit',
                tags: ['ai-generated', 'documentation']
            });
        }
        return tasks;
    }
    extractTasksFromUncommittedChanges(gitStatus) {
        const tasks = [];
        const lines = gitStatus.split('\n');
        for (const line of lines) {
            const [, filePath] = line.split(/\s+/);
            if (filePath && filePath.endsWith('.js')) {
                tasks.push({
                    title: `Complete and commit: ${filePath}`,
                    description: `Finish work on ${filePath} and create a proper commit`,
                    type: 'implementation',
                    priority: 'medium',
                    estimated_time: 60,
                    source: 'uncommitted',
                    tags: ['ai-generated', 'cleanup']
                });
            }
        }
        return tasks;
    }
    async generateRecurringTasks() {
        console.log(chalk.blue('🔄 Generating recurring tasks...'));
        const tasks = [];
        const today = new Date();
        for (const pattern of this.commonPatterns.recurring) {
            if (this.shouldGenerateRecurringTask(pattern, today)) {
                const task = {
                    title: pattern.title,
                    description: `Recurring ${pattern.frequency} maintenance task`,
                    type: 'maintenance',
                    priority: 'medium',
                    estimated_time: pattern.estimate,
                    source: 'recurring',
                    tags: ['ai-generated', 'maintenance', 'recurring'],
                    recurring: {
                        frequency: pattern.frequency,
                        lastGenerated: today.toISOString().split('T')[0]
                    }
                };
                tasks.push(task);
            }
        }
        console.log(chalk.green(`✅ Generated ${tasks.length} recurring tasks`));
        return tasks;
    }
    shouldGenerateRecurringTask(pattern, today) {
        // Simple logic - in real implementation, this would check last generation date
        const dayOfWeek = today.getDay();
        switch (pattern.frequency) {
            case 'weekly':
                return dayOfWeek === 1; // Monday
            case 'monthly':
                return today.getDate() === 1; // First of month
            default:
                return false;
        }
    }
    async generateMaintenanceTasks() {
        console.log(chalk.blue('🔧 Generating maintenance tasks...'));
        const tasks = [];
        // Check for common maintenance needs
        const maintenanceChecks = [
            {
                title: 'Review and update project dependencies',
                description: 'Check for outdated dependencies and update where necessary',
                condition: () => true, // Always generate
                priority: 'medium',
                estimated_time: 90
            },
            {
                title: 'Clean up temporary files and logs',
                description: 'Remove unnecessary temporary files and old log files',
                condition: () => true,
                priority: 'low',
                estimated_time: 30
            },
            {
                title: 'Review and optimize task organization',
                description: 'Review current task structure and reorganize if needed',
                condition: () => true,
                priority: 'low',
                estimated_time: 60
            }
        ];
        for (const check of maintenanceChecks) {
            if (check.condition()) {
                tasks.push({
                    title: check.title,
                    description: check.description,
                    type: 'maintenance',
                    priority: check.priority,
                    estimated_time: check.estimated_time,
                    source: 'maintenance',
                    tags: ['ai-generated', 'maintenance', 'optimization']
                });
            }
        }
        console.log(chalk.green(`✅ Generated ${tasks.length} maintenance tasks`));
        return tasks;
    }
    estimateTimeFromText(text) {
        // Simple time estimation based on text patterns
        let baseTime = 60; // 1 hour default
        if (text.toLowerCase().includes('quick') || text.toLowerCase().includes('simple')) {
            baseTime = 30;
        }
        else if (text.toLowerCase().includes('complex') || text.toLowerCase().includes('large')) {
            baseTime = 180;
        }
        else if (text.toLowerCase().includes('research') || text.toLowerCase().includes('investigate')) {
            baseTime = 120;
        }
        return baseTime;
    }
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    calculateSimilarity(task1, task2) {
        // Simple similarity calculation based on title
        const title1 = task1.title.toLowerCase();
        const title2 = task2.title.toLowerCase();
        const words1 = title1.split(' ');
        const words2 = title2.split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        const totalWords = new Set([...words1, ...words2]).size;
        return commonWords.length / totalWords;
    }
    filterDuplicates(tasks) {
        const filtered = [];
        for (const newTask of tasks) {
            let isDuplicate = false;
            for (const existingTask of this.taskPatterns.values()) {
                const similarity = this.calculateSimilarity(newTask, existingTask);
                if (similarity > this.duplicateThreshold) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                filtered.push(newTask);
            }
        }
        return filtered;
    }
    async generateAllTasks() {
        console.log(chalk.blue('🚀 Starting comprehensive task generation...'));
        const allTasks = [];
        // Generate from different sources
        const specTasks = await this.generateFromSpecifications();
        const codeTasks = await this.generateFromCodeChanges();
        const recurringTasks = await this.generateRecurringTasks();
        const maintenanceTasks = await this.generateMaintenanceTasks();
        allTasks.push(...specTasks, ...codeTasks, ...recurringTasks, ...maintenanceTasks);
        // Filter duplicates
        const uniqueTasks = this.filterDuplicates(allTasks);
        // Prioritize and score tasks
        const scoredTasks = this.scoreAndPrioritizeTasks(uniqueTasks);
        console.log(chalk.green(`✅ Generated ${scoredTasks.length} unique tasks`));
        return scoredTasks;
    }
    scoreAndPrioritizeTasks(tasks) {
        return tasks.map(task => {
            let score = 0;
            // Base score by priority
            if (task.priority === 'high')
                score += 30;
            else if (task.priority === 'medium')
                score += 20;
            else
                score += 10;
            // Score by type
            const typeScores = {
                'implementation': 25,
                'bugfix': 30,
                'testing': 20,
                'documentation': 10,
                'research': 15,
                'maintenance': 5,
                'optimization': 15
            };
            score += typeScores[task.type] || 10;
            // Score by source
            const sourceScores = {
                'requirements': 25,
                'user-story': 20,
                'commit': 15,
                'uncommitted': 30,
                'recurring': 10,
                'maintenance': 5
            };
            score += sourceScores[task.source] || 10;
            return {
                ...task,
                score,
                urgency: this.calculateUrgency(task)
            };
        }).sort((a, b) => b.score - a.score);
    }
    calculateUrgency(task) {
        if (task.priority === 'high')
            return 'high';
        if (task.source === 'uncommitted')
            return 'high';
        if (task.type === 'bugfix')
            return 'high';
        if (task.priority === 'medium')
            return 'medium';
        return 'low';
    }
    async createTaskFiles(tasks, projectPath = null) {
        const createdFiles = [];
        // Default to Task-Management-Intelligence project if not specified
        if (!projectPath) {
            projectPath = path.join(this.projectsPath, 'Task-Management-Intelligence');
        }
        const tasksDir = path.join(projectPath, 'Tasks');
        await fs.ensureDir(tasksDir);
        for (const task of tasks) {
            const fileName = this.sanitizeFileName(task.title) + '.md';
            const filePath = path.join(tasksDir, fileName);
            // Check if file already exists
            if (await fs.pathExists(filePath)) {
                console.log(chalk.yellow(`⚠️  Task file already exists: ${fileName}`));
                continue;
            }
            const taskContent = this.generateTaskFileContent(task);
            await fs.writeFile(filePath, taskContent, 'utf8');
            createdFiles.push(filePath);
            this.taskPatterns.set(task.title.toLowerCase(), task);
        }
        return createdFiles;
    }
    sanitizeFileName(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }
    generateTaskFileContent(task) {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date(Date.now() + (task.estimated_time * 60 * 1000 * 2)).toISOString().split('T')[0];
        let content = `---
title: "${task.title}"
status: "todo"
priority: "${task.priority}"
project: "[[Task-Management-Intelligence]]"
assignee: "AI Agent"
due_date: "${dueDate}"
created_date: "${today}"
completed_date: ""
time_estimate: ${task.estimated_time}
time_spent: 0
dependencies: []
subtasks: []
tags: ${JSON.stringify(task.tags)}
score: ${task.score || 0}
urgency: "${task.urgency || 'medium'}"
`;
        if (task.recurring) {
            content += `recurring:
  frequency: "${task.recurring.frequency}"
  last_generated: "${task.recurring.lastGenerated}"
`;
        }
        content += `---

# ${task.title}

## 🎯 Objective
${task.description}

## 📋 Acceptance Criteria
- [ ] Complete ${task.title.toLowerCase()}
- [ ] Verify all requirements are met
- [ ] Test functionality thoroughly
- [ ] Update documentation if needed

## 🔗 Dependencies
No dependencies

## 📝 Notes
This task was automatically generated by the Automated Task Generation system.
- Source: ${task.source}
- Type: ${task.type}
- Score: ${task.score || 0}
- Urgency: ${task.urgency || 'medium'}

Generated on: ${today}
Estimated time: ${Math.round(task.estimated_time / 60 * 10) / 10} hours
`;
        return content;
    }
}
async function automatedTaskGenerationCommand(options = {}) {
    try {
        const vaultPath = process.cwd();
        if (!await fs.pathExists(path.join(vaultPath, '4 - Projects'))) {
            console.log(chalk.red('❌ Not in an Obsidian Kit vault. Make sure you\'re in a project directory.'));
            return;
        }
        const engine = new AutomatedTaskGenerationEngine(vaultPath);
        await engine.initialize();
        console.log(chalk.blue('\n🤖 Generating automated tasks...\n'));
        const tasks = await engine.generateAllTasks();
        if (tasks.length === 0) {
            console.log(chalk.yellow('⚠️  No new tasks to generate.'));
            return;
        }
        console.log(chalk.green('\n📋 Generated Tasks:'));
        tasks.forEach((task, index) => {
            console.log(`\n${index + 1}. ${chalk.cyan(task.title)}`);
            console.log(`   📝 ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}`);
            console.log(`   🏷️ ${task.type} | 🚩 ${task.priority} | ⭐ ${task.score} | 🚨 ${task.urgency}`);
            console.log(`   📅 Source: ${task.source} | ⏱️ ${Math.round(task.estimated_time / 60 * 10) / 10}h`);
        });
        if (!options.dryRun) {
            const { shouldCreate } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'shouldCreate',
                    message: `Create these ${tasks.length} task files?`,
                    default: true
                }
            ]);
            if (shouldCreate) {
                const createdFiles = await engine.createTaskFiles(tasks);
                console.log(chalk.green(`\n✅ Created ${createdFiles.length} task files:`));
                createdFiles.forEach(file => {
                    console.log(`   📄 ${path.relative(vaultPath, file)}`);
                });
                console.log(chalk.blue('\n💡 Next steps:'));
                console.log('   1. Review the generated tasks in your Obsidian vault');
                console.log('   2. Adjust priorities and estimates as needed');
                console.log('   3. Start with high-score, high-urgency tasks');
            }
        }
    }
    catch (error) {
        console.error(chalk.red('❌ Error during automated task generation:'), error.message);
    }
}
module.exports = automatedTaskGenerationCommand;
//# sourceMappingURL=automated-task-generation.js.map