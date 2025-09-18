# Release Process

This repository uses [Changesets](https://github.com/changesets/changesets) for automated package versioning and publishing.

## How It Works

### 1. Creating Changes
When you make changes that should trigger a release:

```bash
# Add a changeset describing your changes
pnpm changeset

# Follow the prompts to:
# - Select which packages are affected
# - Choose the type of change (patch, minor, major)
# - Write a description of the change
```

This creates a markdown file in `.changeset/` describing the change.

### 2. Automated Release Process

When changesets are pushed to `main`:

1. **Release PR Creation**: The GitHub Action automatically creates a "Version Packages" PR
2. **Review Process**: The PR shows exactly what will be released and requires review
3. **Publishing**: When the PR is merged, packages are automatically published to NPM
4. **GitHub Releases**: Release notes are automatically created with changelogs

### 3. Manual Testing

You can test releases locally:

```bash
# See what would be published (dry run)
pnpm publish:dry-run

# Build and publish locally (requires NPM_TOKEN)
pnpm publish
```

## Setup Requirements


## Changeset Types

- **patch**: Bug fixes, documentation updates, internal changes
- **minor**: New features, non-breaking changes
- **major**: Breaking changes, API changes

## Example Workflow

```bash
# 1. Make your changes
git checkout -b feature/new-auth-method
# ... make changes ...

# 2. Add changeset
pnpm changeset
# Select: @nylas/connect → minor → "Add new OAuth flow support"

# 3. Commit and push
git add .changeset/
git commit -m "feat: add new OAuth flow support"
git push origin feature/new-auth-method

# 4. Create PR and merge to main
# 5. Release PR is automatically created
# 6. Review and merge release PR
# 7. Packages are published automatically!
```

## Troubleshooting

### Release PR Not Created
- Check that changesets exist in `.changeset/` (not just config files)
- Verify the GitHub Action ran successfully
- Ensure you have the required permissions

### Publishing Fails
- Verify `NPM_TOKEN` secret is set correctly
- Check NPM token has publish permissions for `@nylas` scope
- Ensure package versions don't already exist on NPM

### Manual Recovery
If automation fails, you can manually release:

```bash
# Update versions
pnpm version

# Build and publish
pnpm publish

# Create git tags
git push --follow-tags
```
