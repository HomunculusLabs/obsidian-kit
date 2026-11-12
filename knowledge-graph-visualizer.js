#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

class KnowledgeGraphVisualizer {
  constructor(graphPath, port = 3001) {
    this.graphPath = graphPath;
    this.port = port;
    this.graph = this.loadGraph();
    this.server = null;
  }

  loadGraph() {
    if (!fs.existsSync(this.graphPath)) {
      throw new Error(`Knowledge graph file not found: ${this.graphPath}`);
    }

    const content = fs.readFileSync(this.graphPath, 'utf8');
    return JSON.parse(content);
  }

  // Generate HTML for D3.js visualization
  generateVisualizationHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Graph Visualizer</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        
        .controls {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .control-group label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9em;
        }
        
        select, input, button {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
        }
        
        button {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        button:hover {
            background: #0056b3;
        }
        
        .stats {
            padding: 15px 20px;
            background: #e9ecef;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
        }
        
        .stat {
            display: flex;
            flex-direction: column;
        }
        
        .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #007bff;
        }
        
        .stat-label {
            font-size: 0.9em;
            color: #6c757d;
        }
        
        #graph {
            width: 100%;
            height: 600px;
            border: 1px solid #dee2e6;
        }
        
        .tooltip {
            position: absolute;
            padding: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 6px;
            pointer-events: none;
            font-size: 12px;
            max-width: 300px;
            z-index: 1000;
        }
        
        .node {
            cursor: pointer;
        }
        
        .node:hover {
            stroke: #ff6b6b;
            stroke-width: 3px;
        }
        
        .link {
            fill: none;
            stroke-opacity: 0.6;
        }
        
        .node-label {
            font-size: 10px;
            pointer-events: none;
            user-select: none;
        }
        
        .legend {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }
        
        .legend h3 {
            margin-top: 0;
            color: #495057;
        }
        
        .legend-items {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 Knowledge Graph Visualizer</h1>
            <p>Interactive visualization of your knowledge connections</p>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <label for="nodeType">Filter by Type:</label>
                <select id="nodeType">
                    <option value="">All Types</option>
                </select>
            </div>
            
            <div class="control-group">
                <label for="search">Search:</label>
                <input type="text" id="search" placeholder="Search nodes...">
            </div>
            
            <div class="control-group">
                <label for="layout">Layout:</label>
                <select id="layout">
                    <option value="force">Force Directed</option>
                    <option value="circular">Circular</option>
                    <option value="hierarchical">Hierarchical</option>
                </select>
            </div>
            
            <button onclick="resetZoom()">Reset Zoom</button>
            <button onclick="exportImage()">Export Image</button>
            <button onclick="toggleLabels()">Toggle Labels</button>
        </div>
        
        <div class="stats">
            <div class="stat">
                <span class="stat-value" id="nodeCount">0</span>
                <span class="stat-label">Nodes</span>
            </div>
            <div class="stat">
                <span class="stat-value" id="edgeCount">0</span>
                <span class="stat-label">Edges</span>
            </div>
            <div class="stat">
                <span class="stat-value" id="typeCount">0</span>
                <span class="stat-label">Types</span>
            </div>
            <div class="stat">
                <span class="stat-value" id="density">0</span>
                <span class="stat-label">Density</span>
            </div>
        </div>
        
        <svg id="graph"></svg>
        <div class="tooltip" style="display: none;"></div>
        
        <div class="legend">
            <h3>Node Types</h3>
            <div class="legend-items" id="legendItems"></div>
        </div>
    </div>

    <script>
        // Graph data
        const graphData = ${JSON.stringify(this.graph, null, 2)};
        
        // Color scheme for different node types
        const colorScheme = {
            'project': '#ff6b6b',
            'task': '#4ecdc4',
            'specification': '#45b7d1',
            'agent': '#96ceb4',
            'technology': '#feca57',
            'concept': '#ff9ff3',
            'default': '#95afc0'
        };
        
        // Initialize visualization
        const svg = d3.select('#graph');
        const width = 1400;
        const height = 600;
        
        svg.attr('viewBox', [0, 0, width, height]);
        
        const g = svg.append('g');
        
        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        
        svg.call(zoom);
        
        // Tooltip
        const tooltip = d3.select('.tooltip');
        
        // Initialize simulation
        let simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.edges).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));
        
        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(graphData.edges)
            .enter().append('line')
            .attr('class', 'link')
            .attr('stroke', '#999')
            .attr('stroke-width', d => Math.sqrt(d.weight || 1));
        
        // Create nodes
        const node = g.append('g')
            .selectAll('circle')
            .data(graphData.nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', d => Math.sqrt((d.connections || 1) * 5) + 5)
            .attr('fill', d => colorScheme[d.type] || colorScheme.default)
            .call(drag(simulation))
            .on('mouseover', showTooltip)
            .on('mouseout', hideTooltip)
            .on('click', focusNode);
        
        // Create labels
        const labels = g.append('g')
            .selectAll('text')
            .data(graphData.nodes)
            .enter().append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', -15)
            .text(d => d.name || d.id)
            .style('display', 'none');
        
        // Update positions on tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
        
        // Drag behavior
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            
            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }
        
        // Tooltip functions
        function showTooltip(event, d) {
            const connections = graphData.edges.filter(e => 
                e.source.id === d.id || e.target.id === d.id
            ).length;
            
            tooltip
                .style('display', 'block')
                .html(\`
                    <strong>\${d.name || d.id}</strong><br/>
                    Type: \${d.type}<br/>
                    Connections: \${connections}<br/>
                    \${d.description ? \`Description: \${d.description}\` : ''}
                \`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        }
        
        function hideTooltip() {
            tooltip.style('display', 'none');
        }
        
        // Focus on node
        function focusNode(event, d) {
            const connectedNodes = new Set();
            connectedNodes.add(d.id);
            
            graphData.edges.forEach(edge => {
                if (edge.source.id === d.id) connectedNodes.add(edge.target.id);
                if (edge.target.id === d.id) connectedNodes.add(edge.source.id);
            });
            
            node.style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.3);
            link.style('opacity', e => 
                connectedNodes.has(e.source.id) && connectedNodes.has(e.target.id) ? 1 : 0.1
            );
        }
        
        // Control functions
        function resetZoom() {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
            );
        }
        
        function toggleLabels() {
            const currentDisplay = labels.style('display');
            labels.style('display', currentDisplay === 'none' ? 'block' : 'none');
        }
        
        function exportImage() {
            // This would require additional implementation
            alert('Export functionality would require server-side rendering');
        }
        
        // Update statistics
        function updateStats() {
            document.getElementById('nodeCount').textContent = graphData.nodes.length;
            document.getElementById('edgeCount').textContent = graphData.edges.length;
            
            const types = new Set(graphData.nodes.map(n => n.type));
            document.getElementById('typeCount').textContent = types.size;
            
            const maxPossibleEdges = (graphData.nodes.length * (graphData.nodes.length - 1)) / 2;
            const density = maxPossibleEdges > 0 ? 
                (graphData.edges.length / maxPossibleEdges).toFixed(3) : 0;
            document.getElementById('density').textContent = density;
        }
        
        // Populate filters and legend
        function populateControls() {
            const types = [...new Set(graphData.nodes.map(n => n.type))];
            const nodeTypeSelect = document.getElementById('nodeType');
            
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                nodeTypeSelect.appendChild(option);
            });
            
            // Create legend
            const legendItems = document.getElementById('legendItems');
            types.forEach(type => {
                const item = document.createElement('div');
                item.className = 'legend-item';
                item.innerHTML = \`
                    <div class="legend-color" style="background: \${colorScheme[type] || colorScheme.default}"></div>
                    <span>\${type}</span>
                \`;
                legendItems.appendChild(item);
            });
        }
        
        // Filter functionality
        document.getElementById('nodeType').addEventListener('change', filterGraph);
        document.getElementById('search').addEventListener('input', filterGraph);
        
        function filterGraph() {
            const typeFilter = document.getElementById('nodeType').value;
            const searchFilter = document.getElementById('search').value.toLowerCase();
            
            const filteredNodes = graphData.nodes.filter(node => {
                const typeMatch = !typeFilter || node.type === typeFilter;
                const searchMatch = !searchFilter || 
                    (node.name && node.name.toLowerCase().includes(searchFilter)) ||
                    node.id.toLowerCase().includes(searchFilter);
                return typeMatch && searchMatch;
            });
            
            const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
            const filteredEdges = graphData.edges.filter(edge =>
                filteredNodeIds.has(edge.source.id) && filteredNodeIds.has(edge.target.id)
            );
            
            // Update visualization
            node.data(filteredNodes);
            link.data(filteredEdges);
            
            // Restart simulation with filtered data
            simulation.nodes(filteredNodes);
            simulation.force('link').links(filteredEdges);
            simulation.alpha(1).restart();
        }
        
        // Layout changes
        document.getElementById('layout').addEventListener('change', (event) => {
            const layout = event.target.value;
            
            switch(layout) {
                case 'circular':
                    const angleStep = (2 * Math.PI) / graphData.nodes.length;
                    graphData.nodes.forEach((node, i) => {
                        node.fx = width / 2 + Math.cos(i * angleStep) * 200;
                        node.fy = height / 2 + Math.sin(i * angleStep) * 200;
                    });
                    break;
                    
                case 'hierarchical':
                    // Simple hierarchical layout based on node types
                    const typeGroups = {};
                    graphData.nodes.forEach(node => {
                        if (!typeGroups[node.type]) typeGroups[node.type] = [];
                        typeGroups[node.type].push(node);
                    });
                    
                    const typeNames = Object.keys(typeGroups);
                    const levelHeight = height / (typeNames.length + 1);
                    
                    typeNames.forEach((type, level) => {
                        const nodesInType = typeGroups[type];
                        const nodeWidth = width / (nodesInType.length + 1);
                        
                        nodesInType.forEach((node, i) => {
                            node.fx = nodeWidth * (i + 1);
                            node.fy = levelHeight * (level + 1);
                        });
                    });
                    break;
                    
                default:
                    // Force directed - free the positions
                    graphData.nodes.forEach(node => {
                        node.fx = null;
                        node.fy = null;
                    });
            }
            
            simulation.alpha(1).restart();
        });
        
        // Initialize
        updateStats();
        populateControls();
    </script>
</body>
</html>`;
  }

  // Start the visualization server
  start() {
    this.server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname;

      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        if (path === '/' || path === '/visualize') {
          // Serve the visualization HTML
          const html = this.generateVisualizationHTML();
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
        } else if (path === '/api/graph-data') {
          // Serve raw graph data as JSON
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(this.graph, null, 2));
        } else if (path === '/api/stats') {
          // Serve graph statistics
          const stats = this.calculateStats();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(stats, null, 2));
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
        }
      } catch (error) {
        console.error('Visualization server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
      }
    });

    this.server.listen(this.port, () => {
      console.log(`🎨 Knowledge Graph Visualizer running on http://localhost:${this.port}`);
      console.log(`📊 Graph loaded: ${this.graph.nodes.length} nodes, ${this.graph.edges.length} edges`);
      console.log(`🌐 Open your browser to http://localhost:${this.port} to explore your knowledge graph`);
    });
  }

  // Calculate graph statistics
  calculateStats() {
    const stats = {
      nodes: this.graph.nodes.length,
      edges: this.graph.edges.length,
      nodeTypes: {},
      edgeTypes: {},
      density: 0,
      averageDegree: 0,
      connectedComponents: 0,
    };

    // Count node types
    this.graph.nodes.forEach(node => {
      stats.nodeTypes[node.type] = (stats.nodeTypes[node.type] || 0) + 1;
    });

    // Count edge types
    this.graph.edges.forEach(edge => {
      stats.edgeTypes[edge.type] = (stats.edgeTypes[edge.type] || 0) + 1;
    });

    // Calculate density
    const maxPossibleEdges = (stats.nodes * (stats.nodes - 1)) / 2;
    stats.density = maxPossibleEdges > 0 ? stats.edges / maxPossibleEdges : 0;

    // Calculate average degree
    const degrees = {};
    this.graph.nodes.forEach(node => {
      degrees[node.id] = 0;
    });

    this.graph.edges.forEach(edge => {
      degrees[edge.source] = (degrees[edge.source] || 0) + 1;
      degrees[edge.target] = (degrees[edge.target] || 0) + 1;
    });

    const totalDegree = Object.values(degrees).reduce((sum, degree) => sum + degree, 0);
    stats.averageDegree = stats.nodes > 0 ? totalDegree / stats.nodes : 0;

    // Find connected components (simplified)
    stats.connectedComponents = this.findConnectedComponents();

    return stats;
  }

  // Find connected components in the graph
  findConnectedComponents() {
    const visited = new Set();
    const components = [];

    const dfs = (nodeId, component) => {
      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      component.push(nodeId);

      this.graph.edges.forEach(edge => {
        if (edge.source === nodeId && !visited.has(edge.target)) {
          dfs(edge.target, component);
        } else if (edge.target === nodeId && !visited.has(edge.source)) {
          dfs(edge.source, component);
        }
      });
    };

    this.graph.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const component = [];
        dfs(node.id, component);
        components.push(component);
      }
    });

    return components.length;
  }

  // Stop the visualization server
  stop() {
    if (this.server) {
      this.server.close();
      console.log('Knowledge Graph Visualizer stopped');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const graphPath = './knowledge-graph.json';
  const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3001;

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🎨 Knowledge Graph Visualizer');
    console.log('\nUsage:');
    console.log('  node knowledge-graph-visualizer.js [options]');
    console.log('\nOptions:');
    console.log('  --port=<number>    Port to run the server on (default: 3001)');
    console.log('  --help, -h         Show this help message');
    console.log('\nExample:');
    console.log('  node knowledge-graph-visualizer.js --port=8080');
    console.log('\nFeatures:');
    console.log('  • Interactive D3.js visualization');
    console.log('  • Force-directed, circular, and hierarchical layouts');
    console.log('  • Node filtering and search');
    console.log('  • Zoom, pan, and drag interactions');
    console.log('  • Real-time statistics and analytics');
    return;
  }

  try {
    const visualizer = new KnowledgeGraphVisualizer(graphPath, port);
    visualizer.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down visualizer...');
      visualizer.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start visualizer:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = KnowledgeGraphVisualizer;
