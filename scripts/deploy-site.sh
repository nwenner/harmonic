#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy-site.sh
# Reads S3_BUCKET and CF_DISTRIBUTION_ID from environment, or falls back to
# fetching them from the live CloudFormation stack.

# Load .env from repo root if present
ROOT_DIR="$(dirname "$0")/.."
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a && source "$ROOT_DIR/.env" && set +a
fi

STACK_NAME="${STACK_NAME:-HarmonicStack}"
REGION="${AWS_REGION:-us-east-2}"
PROFILE="${AWS_PROFILE:-wenroe}"

# ─── Resolve S3 bucket + CloudFront distribution ID ───────────────────────────
if [[ -z "${S3_BUCKET:-}" || -z "${CF_DISTRIBUTION_ID:-}" ]]; then
  echo "▶ Fetching stack outputs..."
  OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" \
    --query "Stacks[0].Outputs" \
    --output json)

  S3_BUCKET="${S3_BUCKET:-$(echo "$OUTPUTS" | python3 -c "
import sys, json
outputs = {o['OutputKey']: o['OutputValue'] for o in json.load(sys.stdin)}
# Bucket name is account-scoped; derive it from the known pattern
import re
# Find it from the SiteBucket resource directly isn't in outputs,
# so we stored it as a CFN output key SiteBucketName
print(outputs.get('SiteBucketName', ''))
")}"

  CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-$(echo "$OUTPUTS" | python3 -c "
import sys, json
outputs = {o['OutputKey']: o['OutputValue'] for o in json.load(sys.stdin)}
print(outputs['CloudFrontDistributionId'])
")}"
fi

if [[ -z "$S3_BUCKET" || -z "$CF_DISTRIBUTION_ID" ]]; then
  echo "Error: set S3_BUCKET and CF_DISTRIBUTION_ID env vars, or add SiteBucketName to stack outputs."
  exit 1
fi

DIST_DIR="$(dirname "$0")/../frontend/dist"

# ─── Build ─────────────────────────────────────────────────────────────────────
echo "▶ Building frontend..."
(cd "$(dirname "$0")/../frontend" && npm run build)

# ─── Sync to S3 ────────────────────────────────────────────────────────────────
echo "▶ Syncing assets to s3://$S3_BUCKET ..."

# Hashed assets (JS/CSS/fonts) — long cache, immutable
aws s3 sync "$DIST_DIR" "s3://$S3_BUCKET" \
  --profile "$PROFILE" \
  --region "$REGION" \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

# index.html — never cache
aws s3 cp "$DIST_DIR/index.html" "s3://$S3_BUCKET/index.html" \
  --profile "$PROFILE" \
  --region "$REGION" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# ─── Invalidate CloudFront ─────────────────────────────────────────────────────
echo "▶ Invalidating CloudFront ($CF_DISTRIBUTION_ID)..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$PROFILE" \
  --query "Invalidation.Id" \
  --output text)

echo "✓ Done. Invalidation: $INVALIDATION_ID"
echo "  Site: https://harmonic.nickwenner.com"
