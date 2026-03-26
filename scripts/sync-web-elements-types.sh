#!/usr/bin/env bash
#
# Syncs the auto-generated React component wrappers from the nylas/ repo
# (source of truth: @nylas/web-elements Stencil build output) into this repo.
#
# Usage:
#   ./scripts/sync-web-elements-types.sh [path-to-nylas-repo]
#
# If no path is given, defaults to ../nylas (sibling directory).
#
# This script should be run whenever @nylas/web-elements is upgraded in
# packages/react/package.json to keep the generated types in sync.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

NYLAS_REPO="${1:-$(cd "$REPO_ROOT/.." && pwd)/nylas}"
SOURCE="$NYLAS_REPO/packages/nylas-react/lib/elements/components.ts"
TARGET="$REPO_ROOT/packages/react/src/elements/components.ts"

if [ ! -f "$SOURCE" ]; then
  echo "ERROR: Source file not found: $SOURCE"
  echo ""
  echo "Make sure the nylas/ repo is cloned as a sibling and @nylas/web-elements has been built:"
  echo "  cd $NYLAS_REPO && pnpm install && pnpm nx run @nylas/web-elements:build"
  exit 1
fi

cp "$SOURCE" "$TARGET"

SOURCE_LINES=$(wc -l < "$SOURCE" | tr -d ' ')
TARGET_LINES=$(wc -l < "$TARGET" | tr -d ' ')

echo "Synced components.ts ($TARGET_LINES lines)"
echo "  From: $SOURCE"
echo "  To:   $TARGET"
