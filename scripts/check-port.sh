#!/usr/bin/env zsh
# Check if a port is available before starting a service
# Usage: ./scripts/check-port.sh <port> <service-name>

PORT=$1
SERVICE=$2

if [[ -z "$PORT" || -z "$SERVICE" ]]; then
  echo "Usage: $0 <port> <service-name>"
  exit 1
fi

# Check if port is in use
if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "❌ Port $PORT is already in use!"
  echo "   Cannot start $SERVICE to maintain isolation."
  echo ""
  echo "   This project uses:"
  echo "   - Frontend: port 3000"
  echo "   - Backend:  port 5001"
  echo ""
  echo "   If you're running the prototype, stop it first or use separate terminals."
  echo "   To free port $PORT: lsof -ti:$PORT | xargs kill -9"
  exit 1
fi

echo "✅ Port $PORT is available for $SERVICE"
exit 0
