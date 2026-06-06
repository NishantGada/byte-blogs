#!/usr/bin/env bash
#
# Deploy wrapper around `vercel --prod`.
# Captures timestamp, exit code, deploy URL, and on failure the tail of
# output, then appends a structured entry to DEPLOY_LOG.md at the repo
# root.
#
# Usage:
#   Run from inside a Vercel-linked project directory (e.g. backend/ or
#   frontend/), where a .vercel/project.json file exists:
#
#     ../scripts/deploy.sh
#
#   The script auto-detects which project it is deploying based on the
#   current working directory name.
#

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="$REPO_ROOT/DEPLOY_LOG.md"
PROJECT_DIR_NAME="$(basename "$PWD")"

if [ ! -d ".vercel" ]; then
  echo "Error: no .vercel directory found in $PWD."
  echo "Run this script from a Vercel-linked project directory."
  exit 1
fi

# Pull project id from the local link file (best-effort, falls back to unknown)
PROJECT_ID=$(node -e "try { console.log(JSON.parse(require('fs').readFileSync('.vercel/project.json','utf8')).projectId) } catch (e) { console.log('unknown') }" 2>/dev/null)

START_TIME=$(date "+%Y-%m-%d %H:%M:%S %Z")
START_EPOCH=$(date +%s)
TMP_OUT=$(mktemp)

echo ""
echo "Deploying $PROJECT_DIR_NAME to Vercel production..."
echo "(log will be appended to $LOG_FILE)"
echo ""

# Run the deploy; tee to both terminal and temp file so we can parse the URL
set +e
npx vercel --prod 2>&1 | tee "$TMP_OUT"
EXIT_CODE=${PIPESTATUS[0]}
set -e

END_TIME=$(date "+%Y-%m-%d %H:%M:%S %Z")
END_EPOCH=$(date +%s)
DURATION=$((END_EPOCH - START_EPOCH))

# Extract the production URL from the output (last vercel.app domain seen)
URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' "$TMP_OUT" | tail -1)

# Append an entry to the log
{
  echo ""
  echo "---"
  echo ""
  if [ "$EXIT_CODE" -eq 0 ]; then
    echo "## $START_TIME — Deploy from $PROJECT_DIR_NAME (success)"
  else
    echo "## $START_TIME — Deploy from $PROJECT_DIR_NAME (FAILED, exit $EXIT_CODE)"
  fi
  echo ""
  echo "- Started: $START_TIME"
  echo "- Finished: $END_TIME"
  echo "- Duration: ${DURATION}s"
  echo "- Exit code: $EXIT_CODE"
  echo "- Project id: $PROJECT_ID"
  echo "- Production URL: ${URL:-not captured}"
  echo ""
  if [ "$EXIT_CODE" -ne 0 ]; then
    echo "### Tail of deploy output"
    echo ""
    echo '```'
    tail -20 "$TMP_OUT"
    echo '```'
    echo ""
    echo "### What went wrong and how it was fixed"
    echo ""
    echo "_Fill this in manually after diagnosing._"
    echo ""
  fi
} >> "$LOG_FILE"

rm -f "$TMP_OUT"

echo ""
echo "Done. Log appended to $LOG_FILE"
exit $EXIT_CODE
