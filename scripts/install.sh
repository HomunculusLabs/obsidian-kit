#!/bin/bash

# Obsidian Kit Installation Script
# This script installs Obsidian Kit globally and sets up shell integration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
INSTALL_DIR="$HOME/.obsidian-kit"

echo "🧠 Installing Obsidian Kit..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    echo "   Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✓ Node.js and npm found"

# Create installation directory
echo "📁 Setting up installation directory..."
mkdir -p "$INSTALL_DIR"

# Copy project files to installation directory
echo "📦 Copying Obsidian Kit files..."
cp -r "$PROJECT_DIR"/* "$INSTALL_DIR/"

# Install dependencies
echo "📥 Installing dependencies..."
cd "$INSTALL_DIR"
npm install --production --silent

# Make CLI executable
chmod +x "$INSTALL_DIR/cli/bin/obsidian-kit"

# Create symlink for global access
SYMLINK_DIR="/usr/local/bin"
SYMLINK_PATH="$SYMLINK_DIR/obsidian-kit"

echo "🔗 Creating global symlink..."

# Check if we can write to /usr/local/bin, otherwise use ~/bin
if [ -w "$SYMLINK_DIR" ]; then
    ln -sf "$INSTALL_DIR/cli/bin/obsidian-kit" "$SYMLINK_PATH"
    echo "   ✓ Symlink created at $SYMLINK_PATH"
else
    # Fallback to user bin directory
    USER_BIN="$HOME/bin"
    mkdir -p "$USER_BIN"
    ln -sf "$INSTALL_DIR/cli/bin/obsidian-kit" "$USER_BIN/obsidian-kit"
    echo "   ✓ Symlink created at $USER_BIN/obsidian-kit"

    # Check if user bin is in PATH
    if [[ ":$PATH:" != *":$USER_BIN:"* ]]; then
        echo "   ⚠️  $USER_BIN is not in your PATH"
        echo "   Add this to your shell profile:"
        echo "   export PATH=\"$USER_BIN:\$PATH\""
    fi
fi

# Add shell integration
echo "🐚 Setting up shell integration..."

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_TYPE="zsh"
    PROFILE_FILE="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_TYPE="bash"
    PROFILE_FILE="$HOME/.bashrc"
else
    SHELL_TYPE="unknown"
    PROFILE_FILE=""
fi

if [ -n "$PROFILE_FILE" ] && [ -f "$PROFILE_FILE" ]; then
    # Add completion source if not already present
    COMPLETION_LINE="# Obsidian Kit completion"
    if ! grep -q "$COMPLETION_LINE" "$PROFILE_FILE"; then
        echo "" >> "$PROFILE_FILE"
        echo "$COMPLETION_LINE" >> "$PROFILE_FILE"
        echo "eval \"\$(obsidian-kit completion $SHELL_TYPE)\"" >> "$PROFILE_FILE"
        echo "   ✓ Added shell completion to $PROFILE_FILE"
    else
        echo "   ✓ Shell completion already configured"
    fi
fi

echo
echo "✅ Obsidian Kit installed successfully!"
echo
echo "🚀 Quick Start:"
echo "   obsidian-kit init my-project    # Create new project vault"
echo "   obsidian-kit add-mcp            # Configure MCP server"
echo "   obsidian-kit status             # Check vault health"
echo "   obsidian-kit help               # Show all commands"
echo
echo "📚 Next Steps:"
echo "1. Restart your terminal or run: source $PROFILE_FILE"
echo "2. Create your first project: obsidian-kit init my-first-project"
echo "3. Open the vault in Obsidian"
echo "4. Install Obsidian Local REST API plugin"
echo "5. Configure MCP integration: obsidian-kit add-mcp"
echo

if [ "$SHELL_TYPE" = "unknown" ]; then
    echo "⚠️  Shell completion setup skipped (unsupported shell)"
    echo "   Manual setup may be required for tab completion"
fi