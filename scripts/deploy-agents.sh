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
gcloud builds submit --config=cloudbuild.encourager.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-encourager \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-encourager \
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
gcloud builds submit --config=cloudbuild.rephraser.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-rephraser \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-rephraser \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Translator Agent
echo "Building and deploying Translator Agent..."
gcloud builds submit --config=cloudbuild.translator.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-translator \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-translator \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Summarizer Agent
echo "Building and deploying Summarizer Agent..."
gcloud builds submit --config=cloudbuild.summarizer.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-summarizer \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-summarizer \
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
gcloud builds submit --config=cloudbuild.namer.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-namer \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-namer \
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
gcloud builds submit --config=cloudbuild.commit.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-commit \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-commit \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Reviewer Agent
echo "Building and deploying Reviewer Agent..."
gcloud builds submit --config=cloudbuild.reviewer.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-reviewer \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-reviewer \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s \
  --project $PROJECT_ID

# Documenter Agent
echo "Building and deploying Documenter Agent..."
gcloud builds submit --config=cloudbuild.documenter.yaml \
  --project $PROJECT_ID

gcloud run deploy a2a-agent-documenter \
  --image asia-northeast1-docker.pkg.dev/$PROJECT_ID/a2a-agents/a2a-agent-documenter \
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
