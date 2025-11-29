#!/bin/bash

# A2A Handson Agents Test Script
# Usage: ./test-agents.sh [base-url] [provider] [api-key]

set -e

BASE_URL=${1:-"http://localhost:8080"}
PROVIDER=${2:-"openai"}
API_KEY=${3:-""}

if [ -z "$API_KEY" ]; then
  echo "Usage: ./test-agents.sh [base-url] [provider] [api-key]"
  echo "Example: ./test-agents.sh http://localhost:8080 openai sk-xxx"
  exit 1
fi

echo "Testing A2A Agents"
echo "Base URL: $BASE_URL"
echo "Provider: $PROVIDER"
echo ""

# Test Agent Card
echo "=== Testing Agent Card ==="
curl -s "$BASE_URL/.well-known/agent-card.json" | jq .
echo ""

# Test Health
echo "=== Testing Health Endpoint ==="
curl -s "$BASE_URL/health" | jq .
echo ""

# Test message/send
echo "=== Testing message/send ==="
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "X-LLM-Provider: $PROVIDER" \
  -H "X-LLM-API-Key: $API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "messageId": "test-123",
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "今日のコードレビュー、厳しい指摘をもらった"
          }
        ]
      },
      "configuration": {
        "acceptedOutputModes": ["text/plain"],
        "blocking": true
      }
    }
  }' | jq .

echo ""
echo "=== Test Complete ==="
