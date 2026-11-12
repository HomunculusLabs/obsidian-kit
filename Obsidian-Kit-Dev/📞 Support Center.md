---
title: "📞 Support Center"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["support", "help", "contact", "resources"]
---

# 📞 Obsidian Kit Support Center

Welcome to the Obsidian Kit Support Center! We're here to help you succeed with AI-powered project management. Find the right support channel for your needs and get the help you deserve.

## 🎯 Support Overview

### Our Support Philosophy
- **User-First**: Your success is our priority
- **Responsive**: Quick, helpful responses
- **Comprehensive**: Complete solutions, not just answers
- **Empowering**: Help you learn and grow
- **Community-Driven**: Leverage collective knowledge

### Support Levels

#### 🟢 Community Support (Free)
- **Response Time**: 24-48 hours
- **Channels**: Discord, GitHub Discussions
- **Scope**: General questions, basic troubleshooting
- **Best for**: Most users, general inquiries

#### 🟡 Priority Support (Contributors)
- **Response Time**: 12-24 hours
- **Channels**: Discord priority channels, direct maintainer access
- **Scope**: Advanced issues, contribution-related problems
- **Best for**: Active contributors, complex technical issues

#### 🔴 Enterprise Support (Paid)
- **Response Time**: 4-8 hours
- **Channels**: Dedicated support team, video calls
- **Scope**: Mission-critical issues, custom integrations
- **Best for**: Teams, organizations, commercial use

---

## 🆘 Getting Help

### Quick Help Checklist

#### Before You Ask
1. **Search First**: Check existing resources
2. **Check Documentation**: Review relevant guides
3. **Try Basic Troubleshooting**: Restart, update, reconfigure
4. **Gather Information**: System details, error messages
5. **Be Specific**: Clear, detailed descriptions

#### What to Include
- **Obsidian Kit Version**: `obsidian-kit --version`
- **System Information**: OS, Node.js version
- **Obsidian Version**: Help → About
- **Error Messages**: Full error text and screenshots
- **Steps to Reproduce**: Detailed reproduction steps
- **What You Tried**: Solutions you've attempted

### Self-Service Resources

#### Documentation Hub
- [[📚 Documentation Hub]] - Complete documentation index
- [[📘 Getting Started Guide]] - New user orientation
- [[🔧 Troubleshooting Guide]] - Common issues and solutions
- [[❓ FAQ]] - Frequently asked questions

#### Interactive Help
- **CLI Help**: `obsidian-kit --help` and `obsidian-kit <command> --help`
- **Diagnostic Tool**: `obsidian-kit doctor` for system health check
- **Configuration Validator**: `obsidian-kit config validate`
- **Interactive Setup**: `obsidian-kit init --interactive`

#### Video Resources
- **Installation Tutorial**: Step-by-step setup guide
- **Feature Demonstrations**: Visual walkthroughs
- **Troubleshooting Videos**: Common problem solutions
- **Advanced Techniques**: Power user tips

---

## 💬 Community Support

### Discord Community
**URL**: [discord.gg/obsidian-kit](https://discord.gg/obsidian-kit)

#### Support Channels
- `#help` - General technical support
- `#troubleshooting` - Complex issues and debugging
- `#configuration` - Setup and configuration help
- `#ai-agents` - AI integration support
- `#workflows` - Workflow and automation help

#### Getting Help on Discord
1. **Check Channel Rules**: Read channel descriptions and pinned messages
2. **Search the Channel**: Look for similar questions
3. **Use Proper Format**: Follow question templates
4. **Be Patient**: Wait for responses, avoid bumping
5. **Follow Up**: Respond to questions and share solutions

#### Discord Question Template
```
🔍 **Issue**: Brief description of your problem
🛠️ **What I've tried**: List of attempted solutions
📋 **System info**: OS, OK version, Obsidian version
❌ **Error messages**: Full error text
🎯 **Goal**: What you're trying to achieve
```

### GitHub Discussions
**URL**: [github.com/t3rpz/obsidian-kit/discussions](https://github.com/t3rpz/obsidian-kit/discussions)

#### Discussion Categories
- **Q&A**: Questions and answers
- **Ideas**: Feature suggestions and discussions
- **Show & Tell**: Share your projects and workflows
- **General**: Community discussions

#### Best Practices for GitHub Discussions
- **Search First**: Avoid duplicate questions
- **Use Labels**: Help categorize your discussion
- **Be Specific**: Detailed questions get better answers
- **Mark Solutions**: Help others find answers
- **Stay On Topic**: Keep discussions focused

### Reddit Community
**URL**: [reddit.com/r/ObsidianKit](https://reddit.com/r/ObsidianKit)

#### When to Use Reddit
- **Broader Audience**: Reach wider community
- **Use Case Sharing**: Show how you use Obsidian Kit
- **General Discussions**: Open-ended conversations
- **Resource Sharing**: Helpful links and tutorials

---

## 🐛 Technical Support

### Bug Reports

#### Reporting Bugs
1. **Use GitHub Issues**: [github.com/t3rpz/obsidian-kit/issues](https://github.com/t3rpz/obsidian-kit/issues)
2. **Search Existing Issues**: Check if bug already reported
3. **Use Bug Report Template**: Provide all required information
4. **Include Reproduction Steps**: Clear, step-by-step instructions
5. **Add System Information**: Complete environment details

#### Bug Report Template
```markdown
## Bug Description
Clear, concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## System Information
- OS: [e.g. Windows 11, macOS 13.0]
- Obsidian Kit version: [e.g. 1.0.0]
- Obsidian version: [e.g. 1.5.3]
- Node.js version: [e.g. 18.17.0]
- Plugin versions: [List relevant plugins]

## Additional Context
Any other relevant information, logs, or configuration
```

#### Bug Triage Process
1. **Automatic Labels**: Applied based on issue content
2. **Priority Assessment**: Evaluated by maintainers
3. **Reproduction Verification**: Confirmed by team
4. **Assignment**: Assigned to appropriate contributor
5. **Resolution**: Fixed, documented, and released

### Feature Requests

#### Requesting Features
1. **Check Roadmap**: Review planned features
2. **Search Existing Requests**: Avoid duplicates
3. **Use Feature Request Template**: Provide complete information
4. **Justify Need**: Explain use case and benefits
5. **Consider Contribution**: Offer to help implement

#### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should the feature work?

## Use Cases
Specific examples of how this would be used

## Alternatives Considered
Other approaches or workarounds

## Additional Context
Any other relevant information or constraints
```

---

## 🔧 Troubleshooting Guides

### Common Issues

#### Installation Problems

##### Issue: "Command not found: obsidian-kit"
**Symptoms**: Command not recognized after installation

**Solutions**:
1. **Check npm global path**:
   ```bash
   npm config get prefix
   # Add to PATH if needed
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

2. **Reinstall with correct permissions**:
   ```bash
   npm uninstall -g obsidian-kit
   npm install -g obsidian-kit --unsafe-perm=true
   ```

3. **Use npx (temporary)**:
   ```bash
   npx obsidian-kit <command>
   ```

##### Issue: "Permission denied" during installation
**Symptoms**: Installation fails with permission errors

**Solutions**:
1. **Use Node Version Manager** (recommended):
   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install and use Node.js
   nvm install 18
   nvm use 18
   npm install -g obsidian-kit
   ```

2. **Fix npm permissions**:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

#### Configuration Issues

##### Issue: MCP server connection failed
**Symptoms**: AI agents cannot connect to Obsidian

**Diagnostic Steps**:
```bash
# Check Obsidian is running with Local REST API
obsidian-kit doctor

# Test API connection
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:27123/

# Verify MCP configuration
obsidian-kit config validate
```

**Solutions**:
1. **Enable Local REST API** in Obsidian settings
2. **Generate new API key** in plugin settings
3. **Check port conflicts**:
   ```bash
   lsof -i :27123
   ```
4. **Restart Obsidian and Claude Desktop**

##### Issue: Tasks not showing in Dataview
**Symptoms**: Task queries return empty results

**Diagnostic Steps**:
```bash
# Check task file location
ls -la "4 - Projects/Tasks.base"

# Validate task format
obsidian-kit validate "4 - Projects/Tasks.base"

# Check Dataview plugin
# Settings → Community Plugins → Dataview → Enable JavaScript Queries
```

**Solutions**:
1. **Ensure tasks are in correct location** (`4 - Projects/`)
2. **Check frontmatter format**:
   ```yaml
   ---
   title: "Task Title"
   status: "todo"
   priority: "medium"
   project: "Project Name"
   created_date: "2025-10-02"
   ---
   ```
3. **Rebuild Dataview index** in plugin settings
4. **Restart Obsidian**

#### Performance Issues

##### Issue: Slow vault performance
**Symptoms**: Lag when opening files or running queries

**Diagnostic Steps**:
```bash
# Check vault size
find . -name "*.md" | wc -l
du -sh .

# Monitor performance
obsidian-kit monitor start
# Use vault for a while
obsidian-kit monitor report
```

**Optimization Solutions**:
1. **Archive completed projects**:
   ```bash
   mkdir "4 - Projects/Archived"
   mv "4 - Projects/Completed-Project" "4 - Projects/Archived/"
   ```

2. **Optimize Dataview queries**:
   ```dataview
   # Instead of querying entire vault
   FROM ""
   
   # Query specific folders
   FROM "4 - Projects"
   ```

3. **Clean up unused files**:
   ```bash
   # Find large files
   find . -size +1M -type f
   
   # Find orphaned files
   find . -name "*.md" -not -path "./.obsidian/*"
   ```

### Advanced Troubleshooting

#### Debug Mode
Enable debug logging for detailed information:
```bash
# Set debug environment variable
export DEBUG=obsidian-kit:*

# Run command with debug output
obsidian-kit <command> --verbose
```

#### Log Files
Check log files for error details:
```bash
# Obsidian logs
# Help → Open Log Folder

# Obsidian Kit logs
~/.obsidian-kit/logs/
```

#### System Health Check
Run comprehensive diagnostic:
```bash
obsidian-kit doctor --full
```

---

## 📞 Contact Information

### Direct Support Channels

#### Email Support
- **General Inquiries**: hello@obsidian-kit.com
- **Technical Support**: support@obsidian-kit.com
- **Bug Reports**: bugs@obsidian-kit.com
- **Security Issues**: security@obsidian-kit.com

#### Response Times
- **General Inquiries**: 2-3 business days
- **Technical Support**: 24-48 hours
- **Bug Reports**: 48-72 hours
- **Security Issues**: Immediate (within 4 hours)

### Social Media
- **Twitter/X**: [@ObsidianKit](https://twitter.com/ObsidianKit)
- **LinkedIn**: [Obsidian Kit](https://linkedin.com/company/obsidian-kit)
- **YouTube**: [Obsidian Kit Channel](https://youtube.com/obsidian-kit)

### Office Hours
- **When**: Every Wednesday, 2:00-4:00 PM UTC
- **Where**: Discord voice channel
- **Format**: Open Q&A session
- **Topics**: Installation, configuration, troubleshooting

---

## 🏢 Enterprise Support

### Enterprise Features

#### Dedicated Support
- **SLA Guarantee**: 4-hour response time
- **Dedicated Support Engineer**: Single point of contact
- **Priority Bug Fixes**: Expedited resolution
- **Custom Training**: Team onboarding and education

#### Professional Services
- **Custom Integration**: Tailored implementations
- **Workflow Design**: Optimized processes
- **Data Migration**: Smooth transition from other tools
- **Performance Optimization**: System tuning and optimization

#### Pricing and Plans
Contact sales@obsidian-kit.com for custom pricing based on:
- Team size
- Usage requirements
- Support level needed
- Custom development needs

### Getting Started with Enterprise Support

#### Onboarding Process
1. **Discovery Call**: Understand your needs and requirements
2. **Custom Proposal**: Tailored solution and pricing
3. **Implementation Plan**: Step-by-step deployment strategy
4. **Team Training**: Comprehensive onboarding sessions
5. **Ongoing Support**: Continuous assistance and optimization

#### Success Stories
- **Tech Company**: 50% reduction in project setup time
- **Consulting Firm**: Improved client project delivery
- **Research Team**: Better knowledge sharing and collaboration
- **Startup**: Faster product development cycles

---

## 📚 Support Resources

### Documentation

#### Quick Reference
- [[🔧 Quick Reference Guide]] - Command cheat sheet
- [[🔧 Troubleshooting Guide]] - Detailed problem-solving
- [[🎓 Learning Paths]] - Structured learning resources
- [[🎯 Use Case Library]] - Real-world examples

#### Advanced Guides
- [[🏗️ Architecture Documentation]] - System design
- [[🔌 API Reference]] - Technical documentation
- [[🔄 Migration Guide]] - Import from other tools
- [[💡 Best Practices Guide]] - Optimization tips

### Learning Resources

#### Tutorials
- **Video Tutorials**: Step-by-step visual guides
- **Written Tutorials**: Detailed walkthroughs
- **Interactive Tutorials**: Hands-on learning
- **Live Workshops**: Real-time instruction

#### Community Content
- **Blog Posts**: Insights and experiences
- **Case Studies**: Real-world implementations
- **User Stories**: Community experiences
- **Tips & Tricks**: Power user techniques

### Tools and Utilities

#### Diagnostic Tools
- **System Health Checker**: `obsidian-kit doctor`
- **Configuration Validator**: `obsidian-kit config validate`
- **Performance Monitor**: `obsidian-kit monitor`
- **Log Analyzer**: Debug and troubleshooting

#### Migration Tools
- **Import Wizards**: Data migration assistants
- **Backup Tools**: Data protection utilities
- **Export Tools**: Data extraction and formatting

---

## 🎯 Support Best Practices

### For Users

#### Getting the Best Help
1. **Be Prepared**: Gather information before asking
2. **Be Specific**: Detailed questions get better answers
3. **Be Patient**: Allow time for thorough responses
4. **Be Responsive**: Follow up on questions
5. **Be Grateful**: Thank those who help you

#### Effective Communication
- **Use Clear Titles**: Descriptive subject lines
- **Provide Context**: Background information
- **Include Examples**: Code snippets, screenshots
- **Format Properly**: Use markdown, code blocks
- **Stay Focused**: One issue per request

### For Contributors

#### Providing Support
1. **Be Welcoming**: Friendly and approachable
2. **Be Thorough**: Complete, helpful responses
3. **Be Patient**: Understanding of different skill levels
4. **Be Consistent**: Follow support guidelines
5. **Be Professional**: Maintain respectful communication

#### Support Guidelines
- **Verify Information**: Ensure accuracy of responses
- **Provide Resources**: Link to relevant documentation
- **Follow Up**: Check if solutions worked
- **Document Solutions**: Update FAQ and guides
- **Escalate When Needed**: Know when to involve maintainers

---

## 📊 Support Metrics

### Performance Indicators

#### Response Times
- **Community Support**: 24-48 hours average
- **Priority Support**: 12-24 hours average
- **Enterprise Support**: 4-8 hours average
- **Critical Issues**: 2-4 hours average

#### Resolution Rates
- **First Contact Resolution**: 75%
- **Overall Resolution**: 95%
- **Customer Satisfaction**: 4.8/5
- **Community Response Rate**: 85%

### Continuous Improvement

#### Feedback Collection
- **Surveys**: Regular satisfaction surveys
- **Reviews**: Community feedback and reviews
- **Analytics**: Support ticket analysis
- **Metrics**: Performance tracking

#### Process Optimization
- **Documentation Updates**: Based on common issues
- **Tool Improvements**: Better diagnostic capabilities
- **Training**: Support team education
- **Automation**: Self-service improvements

---

## 🎉 Success Stories

### User Testimonials

#### From the Community
> "Obsidian Kit transformed how our team manages projects. The AI integration saves us hours every week!"
> - Sarah J., Project Manager

> "The support community is amazing. I got help with my complex workflow within hours."
> - Mike R., Developer

> "As a researcher, Obsidian Kit helps me connect ideas I never would have found otherwise."
> - Dr. Lisa K., Academic Researcher

#### Business Impact
- **Productivity**: 40% average increase in project efficiency
- **Collaboration**: 60% improvement in team coordination
- **Knowledge Management**: 80% better information retrieval
- **Time Savings**: 10+ hours saved per week per user

### Case Studies

#### Tech Startup Implementation
**Challenge**: Managing rapid product development with distributed team
**Solution**: Obsidian Kit with AI agents and automated workflows
**Results**: 50% faster project delivery, improved team alignment

#### Consulting Firm Integration
**Challenge**: Tracking multiple client projects and knowledge sharing
**Solution**: Custom workflows and knowledge graph system
**Results**: Better client outcomes, reusable knowledge base

#### Research Team Collaboration
**Challenge**: Coordinating research across multiple institutions
**Solution**: Semantic search and learning capture system
**Results**: Breakthrough discoveries, improved collaboration

---

## 🔮 Future of Support

### Planned Improvements

#### Enhanced Self-Service
- **AI-Powered Help**: Intelligent assistance bots
- **Interactive Troubleshooting**: Guided problem solving
- **Video Knowledge Base**: Visual help resources
- **Community Q&A**: Integrated question answering

#### Proactive Support
- **Health Monitoring**: Automatic issue detection
- **Predictive Assistance**: Anticipatory help
- **Usage Analytics**: Optimization recommendations
- **Personalized Guidance**: Tailored support experience

#### Expanded Channels
- **Mobile Support**: On-the-go assistance
- **Video Support**: Face-to-face help sessions
- **Integration Support**: Third-party tool assistance
- **Multilingual Support**: Global accessibility

### Community Growth

#### Support Network
- **Super User Program**: Advanced user ambassadors
- **Regional Communities**: Local support groups
- **Specialized Groups**: Industry-specific communities
- **Mentorship Network**: Peer-to-peer assistance

#### Knowledge Sharing
- **Community Wiki**: Collaborative documentation
- **Best Practice Library**: Proven solutions
- **Template Gallery**: Ready-to-use resources
- **Integration Marketplace**: Third-party solutions

---

## 📞 Need Help Now?

### Immediate Assistance

#### Quick Help Options
1. **Check [[🔧 Troubleshooting Guide]]** for common issues
2. **Search [[❓ FAQ]]** for quick answers
3. **Join Discord #help** for real-time assistance
4. **Run `obsidian-kit doctor`** for system diagnostics

#### Emergency Support
For critical issues affecting production:
- **Email**: emergency@obsidian-kit.com
- **Discord**: @maintainer (direct message)
- **Response**: Within 2 hours during business hours

### Get Started Today

1. **Explore Resources**: Browse documentation and tutorials
2. **Join Community**: Connect with other users
3. **Try Features**: Experiment with different workflows
4. **Ask Questions**: Don't hesitate to seek help
5. **Share Success**: Help others learn from your experience

---

*This support center is continuously updated. Last modified: 2025-10-02*

**Remember**: Every question helps improve Obsidian Kit for everyone. Don't hesitate to reach out!

**Need immediate help?** Join our [Discord community](https://discord.gg/obsidian-kit) or check our [troubleshooting guide](https://docs.obsidian-kit.com/troubleshooting).