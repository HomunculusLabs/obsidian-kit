#!/bin/bash

# Obsidian Kit Uninstallation Script

set -e

INSTALL_DIR="$HOME/.obsidian-kit"
SYMLINK_PATHS=("/usr/local/bin/obsidian-kit" "$HOME/bin/obsidian-kit")

echo "🧠 Uninstalling Obsidian Kit..."
echo

# Remove symlinks
echo "🔗 Removing global symlinks..."
for symlink in "${SYMLINK_PATHS[@]}"; do
    if [ -L "$symlink" ]; then
        rm "$symlink"
        echo "   ✓ Removed $symlink"
    fi
done

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
    echo "📁 Removing installation directory..."
    rm -rf "$INSTALL_DIR"
    echo "   ✓ Removed $INSTALL_DIR"
fi

# Remove shell integration
echo "🐚 Cleaning up shell integration..."

PROFILE_FILES=("$HOME/.zshrc" "$HOME/.bashrc")
COMPLETION_LINE="# Obsidian Kit completion"

for profile in "${PROFILE_FILES[@]}"; do
    if [ -f "$profile" ]; then
        # Remove completion lines
        if grep -q "$COMPLETION_LINE" "$profile"; then
            # Create temporary file without Obsidian Kit lines
            grep -v "Obsidian Kit completion\|obsidian-kit completion" "$profile" > "${profile}.tmp"
            mv "${profile}.tmp" "$profile"
            echo "   ✓ Removed completion from $(basename "$profile")"
        fi
    fi
done

echo
echo "✅ Obsidian Kit uninstalled successfully!"
echo
echo "📝 Note: Your project vaults are preserved."
echo "   To remove a specific vault, delete its directory manually."
echo