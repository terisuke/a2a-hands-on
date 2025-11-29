#!/bin/bash

# A2A Handson Agents Deploy Script
# Usage: ./deploy-agents.sh [project-id] [region]

set -e

PROJECT_ID=${1:-"your-gcp-project"}
REGION=${2:-"asia-northeast1"}

echo "Deploying A2A Handson Agents to GCP Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Deploy Python Agents
echo "=== Deploying Python Agents ==="

# Encourager Agent
echo "Building and deploying Encourager Agent..."
cd agents/python
gcloud builds submit --tag gcr.io/$PROJECT_ID/a2a-agent-encourager \
  --project $PROJECT_ID \
  --dockerfile Dockerfile.encourager

gcloud run deploy a2a-agent-encourager \
  --image gcr.io/$PROJECT_ID/a2a-agent-encourager \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Rephraser Agent
echo "Building and deploying Rephraser Agent..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/a2a-agent-rephraser \
  --project $PROJECT_ID \
  --dockerfile Dockerfile.rephraser

gcloud run deploy a2a-agent-rephraser \
  --image gcr.io/$PROJECT_ID/a2a-agent-rephraser \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

cd ../..

# Deploy TypeScript Agents
echo "=== Deploying TypeScript Agents ==="

# Namer Agent
echo "Building and deploying Namer Agent..."
cd agents/typescript
gcloud builds submit --tag gcr.io/$PROJECT_ID/a2a-agent-namer \
  --project $PROJECT_ID \
  --dockerfile Dockerfile.namer

gcloud run deploy a2a-agent-namer \
  --image gcr.io/$PROJECT_ID/a2a-agent-namer \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Commit Agent
echo "Building and deploying Commit Message Agent..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/a2a-agent-commit \
  --project $PROJECT_ID \
  --dockerfile Dockerfile.commit

gcloud run deploy a2a-agent-commit \
  --image gcr.io/$PROJECT_ID/a2a-agent-commit \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

cd ../..

echo ""
echo "=== Deployment Complete ==="
echo "Get your service URLs:"
gcloud run services list --project $PROJECT_ID --region $REGION
