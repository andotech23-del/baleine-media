#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=${PROJECT_ID:-cordia-dev}
REGION=${REGION:-us-central1}
SERVICE=${1:-backend}

if ! command -v gcloud >/dev/null; then
  echo "gcloud CLI is required" >&2
  exit 1
fi

case "$SERVICE" in
  backend)
    IMAGE="gcr.io/${PROJECT_ID}/cordia-backend"
    CONTEXT="backend"
    ;;
  scribe|billing|vision|care)
    IMAGE="gcr.io/${PROJECT_ID}/cordia-${SERVICE}-bot"
    CONTEXT="agents/cordia-${SERVICE}-bot"
    ;;
  frontend)
    IMAGE="gcr.io/${PROJECT_ID}/cordia-frontend"
    CONTEXT="frontend"
    ;;
  *)
    echo "Unknown service: $SERVICE" >&2
    exit 1
    ;;

esac

echo "Building ${SERVICE} image..."
docker build -t "$IMAGE" "$CONTEXT"

echo "Pushing ${IMAGE}"
docker push "$IMAGE"

echo "Deploying to Cloud Run"
gcloud run deploy "cordia-${SERVICE}" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --image "$IMAGE" \
  --allow-unauthenticated \
  --port 8080
