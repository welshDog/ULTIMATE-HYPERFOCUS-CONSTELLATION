#!/usr/bin/env bash
# scan-new-projects.sh
# Script to automatically discover and import new projects into Beads

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Set up logging
log() {
    echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] $*"
}

log "Starting project auto-discovery..."

# Check if bd CLI is available
if ! command -v bd &> /dev/null; then
    log "ERROR: 'bd' command not found. Please ensure Beads CLI is installed and in your PATH." >&2
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    log "ERROR: 'git' command not found. Git is required for this script." >&2
    exit 1
fi

# Get the last scanned commit or initialize if it doesn't exist
LAST_COMMIT=""
if ! LAST_COMMIT=$(bd meta get last_commit 2>/dev/null); then
    log "No previous scan found. Will scan all existing projects."
    LAST_COMMIT="$(git rev-list --max-parents=0 HEAD 2>/dev/null || echo "")"
else
    log "Last scanned commit: $LAST_COMMIT"
fi

# Get list of new or modified files
log "Looking for new or modified projects..."
NEW_FILES=$(git diff --name-only "$LAST_COMMIT" HEAD -- "projects/" 2>/dev/null || true)

if [ -z "$NEW_FILES" ]; then
    log "No new or modified project directories found."
    exit 0
fi

log "Found new or modified files/directories since last scan:"
printf '  - %s\n' $NEW_FILES

# Process each new or modified file/directory
for file in $NEW_FILES; do
    # Only process directories under projects/
    if [[ -d "$file" && $file == projects/* ]]; then
        PROJECT_NAME="${file#projects/}"
        
        # Skip if the directory is empty (no files/directories except . and ..)
        if ! find "$file" -mindepth 1 -maxdepth 1 -not -name '.' -not -name '..' -print -quit 2>/dev/null | grep -q .; then
            log "Skipping empty project directory: $PROJECT_NAME"
            continue
        fi
        
        log "Discovered project directory: $PROJECT_NAME"
        
        # Check if an issue already exists for this project
        if bd issue list --tag auto-import | grep -q "Import new project $PROJECT_NAME"; then
            log "Issue already exists for project: $PROJECT_NAME"
            continue
        fi
        
        # Create a new issue
        log "Creating issue for project: $PROJECT_NAME"
        if bd issue create "Import new project $PROJECT_NAME" --tag auto-import; then
            log "Successfully created issue for project: $PROJECT_NAME"
        else
            log "WARNING: Failed to create issue for project: $PROJECT_NAME" >&2
        fi
    fi
done

# Update the last scanned commit
if bd meta set last_commit HEAD; then
    log "Successfully updated last scanned commit to: $(git rev-parse --short HEAD)"
else
    log "ERROR: Failed to update last scanned commit" >&2
    exit 1
fi

log "Project auto-discovery completed successfully."