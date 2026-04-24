#!/usr/bin/env bash
set -euo pipefail

# Bundle plugin templates and config files into the package for npm distribution
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(cd "$PKG_DIR/../.." && pwd)"
TEMPLATES_DIR="$PKG_DIR/templates"

echo "Bundling templates..."

# Clean
rm -rf "$TEMPLATES_DIR"
mkdir -p "$TEMPLATES_DIR/plugins"

# Copy all plugins (skills, shared resources, hooks)
for domain in "$REPO_ROOT"/plugins/*/; do
  domain_name=$(basename "$domain")
  if [ -d "$domain/skills" ]; then
    cp -r "$domain" "$TEMPLATES_DIR/plugins/$domain_name"
    # Remove .claude-plugin directory (not needed for distribution)
    rm -rf "$TEMPLATES_DIR/plugins/$domain_name/.claude-plugin"
    echo "  ✓ $domain_name"
  fi
done

# Copy multi-tool config files
cp "$REPO_ROOT/AGENTS.md" "$TEMPLATES_DIR/AGENTS.md"
cp "$REPO_ROOT/.cursorrules" "$TEMPLATES_DIR/.cursorrules"

echo "Done. Templates bundled to $TEMPLATES_DIR"
