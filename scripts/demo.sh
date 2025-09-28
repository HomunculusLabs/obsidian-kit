#!/bin/bash

# Obsidian Kit Demo Script
# This script demonstrates the full workflow of Obsidian Kit

set -e

DEMO_DIR="$HOME/obsidian-kit-demo"
PROJECT_NAME="demo-project"

echo "🧠 Obsidian Kit Demo"
echo "=================="
echo

# Clean up any existing demo
if [ -d "$DEMO_DIR" ]; then
    echo "🧹 Cleaning up previous demo..."
    rm -rf "$DEMO_DIR"
fi

# Create demo directory
mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

echo "📁 Created demo directory: $DEMO_DIR"
echo

# Test CLI help
echo "📋 Testing CLI help command..."
obsidian-kit help
echo

# Initialize project
echo "🚀 Initializing demo project: $PROJECT_NAME"
obsidian-kit init "$PROJECT_NAME" --force
echo

# Navigate to project
cd "$PROJECT_NAME"

echo "📊 Checking initial vault status..."
obsidian-kit status
echo

# Show vault structure
echo "📂 Vault structure created:"
find . -type f -name "*.md" -o -name "*.json" -o -name "*.base" | head -20 | sort
echo

echo "✅ Demo completed successfully!"
echo
echo "🎯 Next Steps:"
echo "1. Open the vault in Obsidian: open '$DEMO_DIR/$PROJECT_NAME'"
echo "2. Install Obsidian Local REST API plugin"
echo "3. Configure MCP: obsidian-kit add-mcp --vault-name $PROJECT_NAME"
echo "4. Check status: obsidian-kit status"
echo
echo "🧹 Cleanup: rm -rf '$DEMO_DIR'"