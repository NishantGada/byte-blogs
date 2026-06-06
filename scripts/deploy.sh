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

# On successful deploy, prune unwanted auto-generated aliases AND
# project-level domain entries. Vercel re-creates short-form names
# (e.g. project-eta.vercel.app or a doubled-scope artifact like
# project-scope-scope.vercel.app) on every deploy, and they appear in
# both the deployment alias list and the project domain list. We remove
# them from both so the dashboard "primary" URL stays as the clean
# project-scope.vercel.app form.
#
# Patterns removed:
#   *-{greek letter}.vercel.app       (alpha, beta, ..., omega)
#   *-{anything}-{same anything}.vercel.app   (double-scope artifact)
if [ "$EXIT_CODE" -eq 0 ] && [ "$PROJECT_ID" != "unknown" ]; then
  VERCEL_AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"
  if [ -f "$VERCEL_AUTH" ]; then
    TOKEN=$(node -e "try { console.log(JSON.parse(require('fs').readFileSync('$VERCEL_AUTH','utf8')).token) } catch (e) {}" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
      echo ""
      echo "Pruning auto-generated deployment aliases..."
      curl -s "https://api.vercel.com/v4/aliases?projectId=$PROJECT_ID&limit=20" \
        -H "Authorization: Bearer $TOKEN" \
        | node -e "
          let d='';
          process.stdin.on('data', c=>d+=c).on('end', ()=>{
            const j = JSON.parse(d);
            const greek = /-(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\.vercel\.app$/;
            const doubled = /-([a-z0-9]+)-\1\.vercel\.app$/;
            (j.aliases || []).forEach(a => {
              if (greek.test(a.alias) || doubled.test(a.alias)) {
                console.log(a.uid + '\t' + a.alias);
              }
            });
          });
        " | while IFS=$'\t' read -r uid alias; do
          if [ -n "$uid" ] && [ -n "$alias" ]; then
            result=$(curl -s -X DELETE "https://api.vercel.com/v2/aliases/$uid" -H "Authorization: Bearer $TOKEN")
            if echo "$result" | grep -q '"status":"SUCCESS"'; then
              echo "  removed alias: $alias"
            else
              echo "  failed to remove alias $alias: $result"
            fi
          fi
        done

      echo "Pruning auto-generated project-level domains..."
      curl -s "https://api.vercel.com/v9/projects/$PROJECT_ID/domains" \
        -H "Authorization: Bearer $TOKEN" \
        | node -e "
          let d='';
          process.stdin.on('data', c=>d+=c).on('end', ()=>{
            const j = JSON.parse(d);
            const greek = /-(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\.vercel\.app$/;
            const doubled = /-([a-z0-9]+)-\1\.vercel\.app$/;
            (j.domains || []).forEach(domain => {
              if (greek.test(domain.name) || doubled.test(domain.name)) {
                console.log(domain.name);
              }
            });
          });
        " | while IFS= read -r domain; do
          if [ -n "$domain" ]; then
            result=$(curl -s -X DELETE "https://api.vercel.com/v9/projects/$PROJECT_ID/domains/$domain" -H "Authorization: Bearer $TOKEN")
            if [ "$result" = "{}" ] || echo "$result" | grep -q '"uid"'; then
              echo "  removed domain: $domain"
            else
              echo "  failed to remove domain $domain: $result"
            fi
          fi
        done
    fi
  fi
fi

echo ""
echo "Done. Log appended to $LOG_FILE"
exit "$EXIT_CODE"
