---
title: "🔧 Troubleshooting Guide"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["troubleshooting", "support", "issues", "solutions"]
---

# 🔧 Obsidian Kit Troubleshooting Guide

Comprehensive troubleshooting guide for common issues and their solutions.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Configuration Problems](#configuration-problems)
3. [Task Management Issues](#task-management-issues)
4. [AI Agent Problems](#ai-agent-problems)
5. [MCP Server Issues](#mcp-server-issues)
6. [Obsidian Integration](#obsidian-integration)
7. [Performance Issues](#performance-issues)
8. [Network & Connectivity](#network--connectivity)
9. [Debugging Tools](#debugging-tools)
10. [Getting Help](#getting-help)

---

## 🚀 Installation Issues

### Command Not Found

**Symptoms:**
```bash
obsidian-kit: command not found
```

**Solutions:**

1. **Check Installation:**
```bash
which obsidian-kit
npm list -g obsidian-kit
```

2. **Reinstall if Missing:**
```bash
npm install -g obsidian-kit
```

3. **Check PATH:**
```bash
echo $PATH | grep -o "[^:]*npm[^:]*"
```

4. **Restart Terminal:**
```bash
# For bash
source ~/.bashrc

# For zsh
source ~/.zshrc

# For fish
source ~/.config/fish/config.fish
```

5. **Manual PATH Addition:**
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Permission Errors

**Symptoms:**
```bash
EACCES: permission denied
```

**Solutions:**

1. **Fix npm Permissions:**
```bash
# Option 1: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node

# Option 2: Change npm directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

2. **Use Node Version Manager:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js
nvm install 18
nvm use 18
```

### Node.js Version Issues

**Symptoms:**
```bash
Node.js version too old
Requires Node.js 16 or higher
```

**Solutions:**

1. **Check Current Version:**
```bash
node --version
npm --version
```

2. **Update Node.js:**
```bash
# Using nvm
nvm install --lts
nvm use --lts

# Using n
npm install -g n
n lts
```

3. **Verify Version:**
```bash
node --version  # Should be v16.x.x or higher
```

---

## ⚙️ Configuration Problems

### Invalid Configuration Files

**Symptoms:**
```bash
Error: Invalid configuration
Configuration validation failed
```

**Solutions:**

1. **Validate Configuration:**
```bash
obsidian-kit config validate
```

2. **Check Configuration Files:**
```bash
# Check main config
cat obsidian-kit.config.json

# Check MCP config
cat mcp-config.json

# Check agent configs
ls -la agents/
```

3. **Reset to Default:**
```bash
obsidian-kit config reset
```

4. **Common Configuration Issues:**

**Invalid JSON:**
```json
// ❌ Wrong
{
  "project": "My Project"
  "version": "1.0"
}

// ✅ Correct
{
  "project": "My Project",
  "version": "1.0"
}
```

**Missing Required Fields:**
```json
// ❌ Missing required fields
{
  "project": {}
}

// ✅ With required fields
{
  "project": {
    "name": "My Project",
    "version": "1.0",
    "description": "Project description"
  }
}
```

### Plugin Configuration Issues

**Symptoms:**
- Obsidian plugins not working
- Dataview queries failing
- MCP server not connecting

**Solutions:**

1. **Check Required Plugins:**
```bash
obsidian-kit status --verbose
```

2. **Install Missing Plugins:**
- Open Obsidian
- Go to Settings → Community Plugins
- Browse and install: Local REST API, Dataview, Templater, Tasks

3. **Configure Local REST API:**
- Generate API key
- Set port to 27123
- Enable "Allow CORS"

4. **Configure Dataview:**
- Enable JavaScript Queries
- Set automatic query refresh

---

## 📋 Task Management Issues

### Tasks Not Showing in Dataview

**Symptoms:**
- Empty task tables
- Dataview queries returning no results
- Tasks not appearing in dashboard

**Solutions:**

1. **Check Tasks.base Location:**
```bash
ls -la "4 - Projects/Tasks.base"
```

2. **Verify Task Frontmatter:**
```yaml
---
title: "Task Title"
status: "todo"
priority: "medium"
project: "Project Name"
created_date: "2025-10-02"
time_estimate: 3600
tags:
  - task
---
```

3. **Test Dataview Query:**
```dataview
TABLE 
  status as "Status",
  priority as "Priority"
FROM "4 - Projects"
WHERE status != "completed"
LIMIT 5
```

4. **Refresh Dataview:**
- Open Dataview settings
- Click "Refresh Index"
- Restart Obsidian

5. **Check Query Syntax:**
```dataview
# ❌ Wrong syntax
FROM "4 - Projects" WHERE status = "todo"

# ✅ Correct syntax
FROM "4 - Projects" WHERE status = "todo"
```

### Task Validation Failures

**Symptoms:**
```bash
Task validation failed
Validation errors found
```

**Solutions:**

1. **Run Validation with Details:**
```bash
obsidian-kit validate task-file.md --verbose
```

2. **Common Validation Errors:**

**Missing Required Fields:**
```yaml
# ❌ Missing required fields
---
title: "Task"
status: "todo"
---

# ✅ Complete frontmatter
---
title: "Task"
status: "todo"
priority: "medium"
project: "Project Name"
created_date: "2025-10-02"
time_estimate: 3600
tags:
  - task
---
```

**Invalid Status Values:**
```yaml
# ❌ Invalid status
status: "pending"

# ✅ Valid statuses
status: "todo"  # or "in-progress", "review", "completed"
```

**Invalid Priority Values:**
```yaml
# ❌ Invalid priority
priority: "urgent"

# ✅ Valid priorities
priority: "critical"  # or "high", "medium", "low"
```

3. **Fix Validation Issues:**
```bash
# Auto-fix common issues
obsidian-kit validate --all --auto-fix

# Manual fix with guidance
obsidian-kit validate task-file.md --interactive
```

---

## 🤖 AI Agent Problems

### Agent Not Responding

**Symptoms:**
- AI agents not responding to commands
- Timeout errors
- Empty responses

**Solutions:**

1. **Check Agent Configuration:**
```bash
obsidian-kit agent list --verbose
```

2. **Verify MCP Server:**
```bash
obsidian-kit status --verbose
```

3. **Test Agent Connection:**
```bash
obsidian-kit agent test claude-code
```

4. **Check Universal Context:**
```bash
cat agents/universal-context.md
```

5. **Restart Services:**
```bash
# Restart Claude Desktop
# Restart Obsidian
# Restart MCP server
obsidian-kit mcp restart
```

### Poor AI Responses

**Symptoms:**
- Irrelevant responses
- Generic answers
- Lack of context awareness

**Solutions:**

1. **Update Universal Context:**
```markdown
# agents/universal-context.md

## Project Overview
- **Name**: Your Project Name
- **Description**: Clear project description
- **Goals**: Specific project goals
- **Current Status**: Current project status

## Team Structure
- **Roles**: Team member roles
- **Responsibilities**: Clear responsibilities
- **Communication**: Communication channels

## Current Priorities
- **Active Tasks**: Current active tasks
- **Deadlines**: Upcoming deadlines
- **Blockers**: Current blockers
```

2. **Improve Prompt Quality:**
```bash
# ❌ Vague prompt
/help

# ✅ Specific prompt
/help with task breakdown for user authentication
```

3. **Use Appropriate Commands:**
```bash
# For status information
/status

# For task management
/tasks

# For research
/research "specific topic"

# For planning
/plan "specific objective"
```

4. **Provide Context:**
```bash
# Include relevant context
/research "microservices architecture" context: "e-commerce project"
```

### Agent Configuration Errors

**Symptoms:**
```bash
Agent configuration failed
Invalid agent settings
```

**Solutions:**

1. **Check Agent Files:**
```bash
ls -la agents/
cat agents/claude-code.md
```

2. **Validate Agent Configuration:**
```bash
obsidian-kit agent validate claude-code
```

3. **Reset Agent Configuration:**
```bash
obsidian-kit agent reset claude-code
obsidian-kit agent add claude-code
```

---

## 🔌 MCP Server Issues

### MCP Server Not Connecting

**Symptoms:**
```bash
MCP server connection failed
Unable to connect to Obsidian API
```

**Solutions:**

1. **Check Obsidian API:**
- Open Obsidian
- Go to Settings → Community Plugins → Local REST API
- Verify API is enabled
- Check port (should be 27123)

2. **Verify API Key:**
```bash
cat mcp-config.json | grep OBSIDIAN_API_KEY
```

3. **Test API Connection:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:27123/
```

4. **Restart MCP Server:**
```bash
obsidian-kit mcp restart
```

5. **Reconfigure MCP:**
```bash
obsidian-kit add-mcp \
  --api-key NEW_API_KEY \
  --vault-name VAULT_NAME \
  --port 27123
```

### API Key Issues

**Symptoms:**
```bash
Invalid API key
Authentication failed
```

**Solutions:**

1. **Generate New API Key:**
- Open Obsidian
- Go to Settings → Community Plugins → Local REST API
- Click "Generate API Key"
- Copy the new key

2. **Update Configuration:**
```bash
obsidian-kit add-mcp --api-key NEW_API_KEY
```

3. **Verify Key Format:**
```json
{
  "mcpServers": {
    "obsidian": {
      "env": {
        "OBSIDIAN_API_KEY": "your-actual-api-key-here"
      }
    }
  }
}
```

### Port Conflicts

**Symptoms:**
```bash
Port 27123 already in use
Address already in use
```

**Solutions:**

1. **Check Port Usage:**
```bash
lsof -i :27123
netstat -tulpn | grep 27123
```

2. **Kill Conflicting Process:**
```bash
kill -9 PID
```

3. **Use Different Port:**
```bash
obsidian-kit add-mcp --port 27124
```

4. **Update Obsidian Settings:**
- Go to Local REST API settings
- Change port to match configuration

---

## 🔍 Obsidian Integration Issues

### Plugin Not Working

**Symptoms:**
- Dataview queries not executing
- Templates not loading
- Tasks not recognized

**Solutions:**

1. **Check Plugin Status:**
- Open Obsidian
- Go to Settings → Community Plugins
- Verify plugins are enabled

2. **Update Plugins:**
- Check for plugin updates
- Install latest versions

3. **Check Plugin Settings:**
```bash
# Dataview settings
- Enable JavaScript Queries
- Set automatic query refresh

# Templater settings
- Set template folder to "3 - Templates"
- Enable trigger on new file creation

# Tasks settings
- Configure task formats
- Enable auto-completion
```

4. **Reload Obsidian:**
- Close and reopen Obsidian
- Disable and re-enable plugins

### File Not Found Errors

**Symptoms:**
```bash
File not found: Tasks.base
Template not found
```

**Solutions:**

1. **Check File Structure:**
```bash
find . -name "Tasks.base"
find . -name "*.md" | grep -E "(template|Task)"
```

2. **Create Missing Files:**
```bash
# Create Tasks.base
obsidian-kit init --force

# Create templates
obsidian-kit template create task
obsidian-kit template create project
```

3. **Check File Paths:**
```bash
# Verify vault structure
tree "4 - Projects/"
tree "3 - Templates/"
```

---

## ⚡ Performance Issues

### Slow Vault Performance

**Symptoms:**
- Obsidian running slowly
- Long loading times
- Lag when switching files

**Solutions:**

1. **Check Vault Size:**
```bash
du -sh .
find . -name "*.md" | wc -l
```

2. **Optimize Dataview Queries:**
```dataview
# ❌ Inefficient query
FROM "" WHERE contains(content, "search term")

# ✅ Efficient query
FROM "4 - Projects" WHERE status = "todo"
```

3. **Limit Query Results:**
```dataview
TABLE status, priority
FROM "4 - Projects"
WHERE status != "completed"
LIMIT 50
```

4. **Disable Unused Features:**
- Disable unnecessary plugins
- Turn off automatic indexing
- Limit file watching

5. **Optimize File Structure:**
- Archive old projects
- Clean up unused files
- Organize into smaller vaults

### Memory Issues

**Symptoms:**
- High memory usage
- Obsidian crashes
- System slowdown

**Solutions:**

1. **Check Memory Usage:**
```bash
# macOS
Activity Monitor

# Linux
htop
ps aux | grep obsidian

# Windows
Task Manager
```

2. **Reduce Memory Usage:**
- Close unused panes
- Limit open tabs
- Disable graph view for large vaults

3. **Increase Memory Limit:**
```bash
# Obsidian settings
# Increase memory allocation if available
```

---

## 🌐 Network & Connectivity Issues

### Internet Connection Problems

**Symptoms:**
- Can't install packages
- AI agents not working
- Update failures

**Solutions:**

1. **Check Connection:**
```bash
ping google.com
curl -I https://api.anthropic.com
```

2. **Check Proxy Settings:**
```bash
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

3. **Configure Proxy:**
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

4. **Use Alternative Registry:**
```bash
npm config set registry https://registry.npmjs.org/
```

### API Rate Limiting

**Symptoms:**
```bash
Rate limit exceeded
Too many requests
```

**Solutions:**

1. **Check Rate Limits:**
- Review API provider limits
- Monitor usage statistics

2. **Implement Backoff:**
```bash
# Wait before retrying
sleep 60
obsidian-kit agent sync
```

3. **Reduce Request Frequency:**
- Batch requests
- Cache responses
- Use efficient queries

---

## 🛠️ Debugging Tools

### Debug Mode

**Enable Debug Logging:**
```bash
# Environment variable
DEBUG=obsidian-kit:* obsidian-kit command

# CLI option
obsidian-kit --debug command

# Specific modules
DEBUG=obsidian-kit:cli,obsidian-kit:agents obsidian-kit status
```

### Log Files

**Log Locations:**
```bash
# Main log
~/.obsidian-kit/logs/obsidian-kit.log

# Error log
~/.obsidian-kit/logs/error.log

# Debug log
~/.obsidian-kit/logs/debug.log
```

**View Logs:**
```bash
# View recent logs
tail -f ~/.obsidian-kit/logs/obsidian-kit.log

# Search logs
grep "error" ~/.obsidian-kit/logs/obsidian-kit.log

# Filter by date
grep "2025-10-02" ~/.obsidian-kit/logs/obsidian-kit.log
```

### Diagnostic Commands

**System Diagnostics:**
```bash
# Full system check
obsidian-kit doctor

# Check configuration
obsidian-kit config check

# Test all integrations
obsidian-kit test-all

# Validate all data
obsidian-kit validate --all
```

**Component Tests:**
```bash
# Test MCP server
obsidian-kit mcp test

# Test agents
obsidian-kit agent test --all

# Test task system
obsidian-kit tasks test

# Test workflows
obsidian-kit workflow test
```

### Performance Monitoring

**Monitor Performance:**
```bash
# Enable performance monitoring
obsidian-kit monitor start

# View performance metrics
obsidian-kit monitor status

# Generate performance report
obsidian-kit monitor report
```

---

## 🆘 Getting Help

### Self-Service Resources

1. **Documentation:**
   - [[📚 Documentation Hub]] - Complete documentation index
   - [[📘 Getting Started Guide]] - New user guide
   - [[🔌 API Reference]] - Technical documentation

2. **Diagnostic Tools:**
   ```bash
   # Run full diagnostics
   obsidian-kit doctor
   
   # Generate support bundle
   obsidian-kit support-bundle
   ```

3. **Common Solutions:**
   - Check [[❓ FAQ]] for common questions
   - Review [[🎯 Best Practices]] for guidance
   - Browse [[📚 Tutorial Collection]] for examples

### Community Support

1. **GitHub Discussions:**
   - [Ask questions](https://github.com/t3rpz/obsidian-kit/discussions)
   - [Share experiences](https://github.com/t3rpz/obsidian-kit/discussions/categories/experiences)
   - [Feature requests](https://github.com/t3rpz/obsidian-kit/discussions/categories/ideas)

2. **Community Discord:**
   - [Join Discord](https://discord.gg/obsidian-kit)
   - Real-time chat support
   - Community knowledge base

3. **Reddit Community:**
   - [r/ObsidianKit](https://reddit.com/r/obsidiankit)
   - User discussions and tips

### Reporting Issues

**Before Reporting:**
1. Check existing issues
2. Run diagnostics: `obsidian-kit doctor`
3. Gather system information
4. Reproduce the issue

**Issue Report Template:**
```markdown
## Issue Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## System Information
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., v18.17.0]
- Obsidian Kit: [e.g., v1.0.0]
- Obsidian: [e.g., v1.5.3]

## Error Messages
Include any error messages

## Additional Context
Any other relevant information
```

**Report Issues:**
- [GitHub Issues](https://github.com/t3rpz/obsidian-kit/issues)
- Include diagnostic output
- Provide screenshots if applicable
- Share configuration files (remove sensitive data)

### Professional Support

**Enterprise Support:**
- Priority issue resolution
- Dedicated support channel
- Custom integration assistance
- Training and onboarding

**Contact:**
- Email: support@obsidian-kit.com
- Support Portal: [support.obsidian-kit.com](https://support.obsidian-kit.com)

---

## 📊 Troubleshooting Checklist

### Quick Diagnosis

**Installation Issues:**
- [ ] Node.js version 16+ installed
- [ ] Obsidian Kit CLI available
- [ ] PATH configured correctly
- [ ] Permissions set properly

**Configuration Issues:**
- [ ] Configuration files valid JSON
- [ ] Required fields present
- [ ] API keys configured
- [ ] Plugins installed and enabled

**Task Management Issues:**
- [ ] Tasks.base file exists
- [ ] Task frontmatter correct
- [ ] Dataview queries working
- [ ] Validation passing

**AI Agent Issues:**
- [ ] MCP server running
- [ ] Agents configured
- [ ] Universal context updated
- [ ] Commands working

**Performance Issues:**
- [ ] Vault size reasonable
- [ ] Queries optimized
- [ ] Memory usage normal
- [ ] Network connectivity good

### Step-by-Step Resolution

1. **Identify the Problem Area**
   - Installation, Configuration, Tasks, AI, Performance

2. **Run Basic Diagnostics**
   ```bash
   obsidian-kit doctor
   obsidian-kit status --verbose
   ```

3. **Check Logs for Errors**
   ```bash
   tail -f ~/.obsidian-kit/logs/obsidian-kit.log
   ```

4. **Try Common Solutions**
   - Restart services
   - Reconfigure components
   - Update software

5. **Seek Help if Needed**
   - Check documentation
   - Ask community
   - Report issue

---

## 🎯 Prevention Tips

### Regular Maintenance

1. **Keep Software Updated:**
   ```bash
   npm update -g obsidian-kit
   ```

2. **Regular Health Checks:**
   ```bash
   obsidian-kit status
   obsidian-kit validate --all
   ```

3. **Backup Configuration:**
   ```bash
   cp -r ~/.obsidian-kit ~/.obsidian-kit.backup
   ```

4. **Monitor Performance:**
   ```bash
   obsidian-kit monitor start
   ```

### Best Practices

1. **Follow Setup Guide:** Use [[📘 Getting Started Guide]] for proper setup
2. **Validate Configuration:** Run `obsidian-kit config validate` regularly
3. **Monitor Logs:** Check logs for early warning signs
4. **Stay Updated:** Keep software and plugins current
5. **Document Issues:** Track recurring problems for pattern analysis

---

*This troubleshooting guide is continuously updated. Last modified: 2025-10-02*

**Still need help?** Join our [community discussions](https://github.com/t3rpz/obsidian-kit/discussions) or [open an issue](https://github.com/t3rpz/obsidian-kit/issues).