#!/bin/bash
set -e
set -o pipefail

# ============================================================================
# OpenTelemetry.io Documentation Sync Script
# ============================================================================
#
# This script synchronizes OpenTelemetry Collector component documentation
# from the ecosystem-registry to opentelemetry.io.
#
# Required environment variables:
#   GH_TOKEN            - GitHub token for pushing and creating PRs
#   BRANCH_OWNER        - GitHub owner where branches are pushed (e.g., "open-telemetry")
#   PR_BASE_OWNER       - GitHub owner of the base repo for PRs (e.g., "open-telemetry")
#   GITHUB_REPOSITORY   - Current repository (e.g., "open-telemetry/opentelemetry-ecosystem-explorer")
#
# Optional environment variables:
#   OTEL_DOCS_REPO_PATH - Path to opentelemetry.io checkout (default: "opentelemetry.io")
# ============================================================================

# Validate required environment variables
if [ -z "$GH_TOKEN" ]; then
  echo "Error: GH_TOKEN environment variable is required"
  exit 1
fi

echo "Verifying gh CLI authentication..."
if gh auth status >/dev/null 2>&1; then
  echo "✓ gh CLI is authenticated"
else
  echo "✗ gh CLI authentication failed"
fi

# Debug: Check token permissions
echo ""
echo "Checking token access to repositories..."
echo "Can access ${GITHUB_REPOSITORY}: $(gh repo view "${GITHUB_REPOSITORY}" --json name -q '.name' 2>&1 > /dev/null && echo "✓" || echo "✗")"
echo "Can access ${BRANCH_OWNER}/opentelemetry.io: $(gh repo view "${BRANCH_OWNER}/opentelemetry.io" --json name -q '.name' 2>&1 > /dev/null && echo "✓" || echo "✗")"
echo ""

if [ -z "$BRANCH_OWNER" ]; then
  echo "Error: BRANCH_OWNER environment variable is required"
  exit 1
fi

if [ -z "$PR_BASE_OWNER" ]; then
  echo "Error: PR_BASE_OWNER environment variable is required"
  exit 1
fi

if [ -z "$GITHUB_REPOSITORY" ]; then
  echo "Error: GITHUB_REPOSITORY environment variable is required"
  exit 1
fi

OTEL_DOCS_REPO_PATH="${OTEL_DOCS_REPO_PATH:-opentelemetry.io}"

echo "Starting OpenTelemetry.io documentation sync"
echo ""

echo "Installing Python dependencies..."
uv sync

echo "Installing Node.js dependencies..."
cd "$OTEL_DOCS_REPO_PATH" || { echo "Error: Failed to change to directory $OTEL_DOCS_REPO_PATH"; exit 1; }
npm install --omit=optional
cd .. || { echo "Error: Failed to change to parent directory"; exit 1; }

echo "Generating documentation..."
export OTEL_DOCS_REPO_PATH
uv run documentation-sync

echo "Formatting documentation..."
cd "$OTEL_DOCS_REPO_PATH" || { echo "Error: Failed to change to directory $OTEL_DOCS_REPO_PATH"; exit 1; }
npm run check:links || echo "Warning: Link check failed"
npm run fix:format
cd .. || { echo "Error: Failed to change to parent directory"; exit 1; }

# Get version info
VERSION=$(ls -1 ecosystem-registry/collector/core | grep -v -i 'SNAPSHOT' | sort -V | tail -n 1)
if [ -z "$VERSION" ]; then
  echo "Error: No collector versions found in ecosystem-registry/collector/core"
  exit 1
fi
echo "Version: $VERSION"
echo ""

if [ -f "metadata-issues.md" ]; then
  echo "Reporting metadata quality issues for version ${VERSION}..."

  ISSUE_TITLE="Collector ${VERSION} Metadata Quality Issues"

  ISSUE_NUMBER=$(gh issue list \
    --repo "$GITHUB_REPOSITORY" \
    --state open \
    --json number,title \
    --jq ".[] | select(.title == \"${ISSUE_TITLE}\") | .number | select(. != null)" | head -n 1)

  if [ -n "$ISSUE_NUMBER" ]; then
    echo "Found existing issue #${ISSUE_NUMBER} for version ${VERSION}, updating..."
    UPDATED_BODY="## Metadata Quality Report for Collector ${VERSION}

$(cat metadata-issues.md)

---
_Last updated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')_"

    gh issue edit "$ISSUE_NUMBER" \
      --repo "$GITHUB_REPOSITORY" \
      --body "$UPDATED_BODY" \
      --add-label "metadata-quality" || true
  else
    echo "No existing issue found for version ${VERSION}, creating new issue..."
    gh issue create \
      --repo "$GITHUB_REPOSITORY" \
      --title "$ISSUE_TITLE" \
      --label "metadata-quality" \
      --body "$(cat metadata-issues.md)" || {
        echo "Failed to create issue with label, trying without label..."
        gh issue create \
          --repo "$GITHUB_REPOSITORY" \
          --title "$ISSUE_TITLE" \
          --body "$(cat metadata-issues.md)"
      }
  fi
else
  echo "No metadata issues file found, skipping issue reporting"
fi

echo "Checking for documentation changes..."
cd "$OTEL_DOCS_REPO_PATH" || { echo "Error: Failed to change to directory $OTEL_DOCS_REPO_PATH"; exit 1; }
echo "Working directory: $(pwd)"
CHANGED_FILES=$(git diff --name-only content/en/docs/collector/components/)

if [ -z "$CHANGED_FILES" ]; then
  echo "No documentation changes detected"
  exit 0
fi

echo "Documentation changes detected:"
echo "$CHANGED_FILES"
echo ""
BRANCH_NAME="otelbot/collector-docs-${VERSION//\./-}"

echo "Branch: $BRANCH_NAME"
echo ""

echo "Creating branch and committing changes..."

# Ensure we're using the correct git config
echo "Current git config:"
git config user.name
git config user.email

git checkout main
git checkout -B "$BRANCH_NAME"
git add .

if git diff --staged --quiet; then
  echo "No changes to commit"
  exit 0
fi

git commit -m "Update Collector component tables"
echo "Changes committed"
echo ""

echo "============================================================================"
echo "PR WORKFLOW: Push branch and create PR"
echo "============================================================================"
echo ""
echo "PR Plan:"
echo "  • Push branch to:    ${BRANCH_OWNER}/opentelemetry.io"
echo "  • Create PR against: ${PR_BASE_OWNER}/opentelemetry.io"
echo ""

# Clear any existing credential helpers and configure for push
git config --local --unset-all credential.helper 2>/dev/null || true
git config --local --unset-all http.https://github.com/.extraheader 2>/dev/null || true

# Set up remote and push
git remote remove target-repo 2>/dev/null || true
git remote add target-repo "https://x-access-token:${GH_TOKEN}@github.com/${BRANCH_OWNER}/opentelemetry.io.git"

echo "Debug: Configured remote 'target-repo'"
echo "Remote 'target-repo' configured for: ${BRANCH_OWNER}/opentelemetry.io"

# Verify token is available
if [ -z "$GH_TOKEN" ]; then
  echo "ERROR: GH_TOKEN is not set!"
  exit 1
else
  echo "GH_TOKEN is set."
fi

if git push -f target-repo "$BRANCH_NAME" >/dev/null 2>&1; then
  echo "✓ Pushed branch '${BRANCH_NAME}' to ${BRANCH_OWNER}/opentelemetry.io"
else
  # Push failed - show sanitized error
  echo ""
  echo "============================================================================"
  echo "ERROR: Failed to push to ${BRANCH_OWNER}/opentelemetry.io"
  echo "============================================================================"
  echo ""
  echo "Attempting to diagnose the issue..."

  # Safe diagnostic checks that don't expose the token
  if git ls-remote target-repo HEAD >/dev/null 2>&1; then
    echo "✓ Can connect to remote repository"
    echo "✗ Push was rejected (likely a permissions issue)"
  else
    echo "✗ Cannot connect to remote repository"
    echo "  - Check if otelbot GitHub App is installed"
    echo "  - Check if the token has the correct permissions"
  fi
  echo ""
  exit 1
fi

# Determine PR head reference format
# GitHub requires different formats:
#   - Same-repo PR:  "branch-name"
#   - Cross-repo PR: "owner:branch-name"
if [ "${BRANCH_OWNER}" = "${PR_BASE_OWNER}" ]; then
  PR_HEAD="${BRANCH_NAME}"
  echo "Creating same-repo PR"
else
  PR_HEAD="${BRANCH_OWNER}:${BRANCH_NAME}"
  echo "Creating cross-repo PR"
fi

# Create or update PR
PR_BODY="## Update Collector Component Documentation

This PR updates the OpenTelemetry Collector component tables for version **${VERSION}**.

---

🤖 _This PR was automatically generated by the [ecosystem-explorer](https://github.com/${GITHUB_REPOSITORY})_"

gh pr create \
  --repo "${PR_BASE_OWNER}/opentelemetry.io" \
  --head "${PR_HEAD}" \
  --title "Update Collector component tables for ${VERSION}" \
  --body "$PR_BODY" \
  2>&1 | tee pr-output.txt || {
    if grep -q "already exists" pr-output.txt; then
      echo "PR already exists, updating..."
      PR_NUMBER="$(gh pr list \
        --repo "${PR_BASE_OWNER}/opentelemetry.io" \
        --head "${PR_HEAD}" \
        --state open \
        --json number \
        --jq '.[0].number // empty')"
      if [ -z "$PR_NUMBER" ]; then
        echo "Failed to find existing PR for head ${PR_HEAD}"
        cat pr-output.txt
        exit 1
      fi
      gh pr edit "$PR_NUMBER" \
        --repo "${PR_BASE_OWNER}/opentelemetry.io" \
        --title "Update Collector component tables for ${VERSION}" \
        --body "$PR_BODY"
    else
      echo "Failed to create PR"
      cat pr-output.txt
      exit 1
    fi
  }

echo ""
echo "Successfully created/updated PR"