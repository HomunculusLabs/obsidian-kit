#!/bin/bash

echo "🔍 Semantic Search Demo - Obsidian Kit"
echo "======================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

echo "📚 Starting Semantic Search System..."
echo ""

# Start Knowledge Graph API (port 3000)
echo "🧠 Starting Knowledge Graph API on port 3000..."
node knowledge-graph-api.js &
KG_PID=$!
sleep 2

# Start Semantic Search API (port 3001)
echo "🔍 Starting Semantic Search API on port 3001..."
node semantic-search-api.js Obsidian-Kit-Dev --port 3001 &
SEARCH_PID=$!
sleep 3

echo ""
echo "✅ Semantic Search System is running!"
echo ""
echo "🌐 Web Interface: Open semantic-search-ui.html in your browser"
echo "🔗 API Endpoints:"
echo "   - Knowledge Graph: http://localhost:3000/api"
echo "   - Semantic Search: http://localhost:3001/api"
echo ""
echo "📊 Quick Test Commands:"
echo "   curl 'http://localhost:3001/api/search?q=semantic%20search'"
echo "   curl 'http://localhost:3001/api/suggestions?q=knowl'"
echo "   curl 'http://localhost:3001/api/analytics'"
echo ""
echo "🧪 Run Test Suite:"
echo "   node test-semantic-search.js"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt signal
trap 'echo ""; echo "🛑 Stopping services..."; kill $KG_PID $SEARCH_PID 2>/dev/null; echo "✅ All services stopped"; exit 0' INT

# Keep script running
wait