import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Components
const CentralNode = ({ data }) => (
  <div className="custom-node node-central">
    <div className="node-title">Original Content</div>
    <div className="node-desc" style={{ color: 'white', marginTop: '10px' }}>{data.label}</div>
    <div style={{ fontSize: '0.8rem', marginTop: '10px', color: 'var(--accent-color)' }}>
      {data.scores.virality_score}% Viral Potential
    </div>
  </div>
);

const PersonaNode = ({ data }) => (
  <div className={`custom-node node-persona-${data.sentiment}`}>
    <div className="node-title">{data.persona}</div>
    <div className="node-desc">{data.action.toUpperCase()}</div>
  </div>
);

const TrendNode = ({ data }) => (
  <div className="custom-node node-trend">
    <div className="node-title">Viral Trend Insight</div>
    <div className="node-desc">{data.label}</div>
  </div>
);

const nodeTypes = {
  central: CentralNode,
  persona: PersonaNode,
  trend: TrendNode,
};

const SimulationGraph = ({ results, content }) => {
  const { nodes, edges } = useMemo(() => {
    const initialNodes = [];
    const initialEdges = [];

    // Central Node
    initialNodes.push({
      id: 'center',
      type: 'central',
      position: { x: 400, y: 300 },
      data: { label: content.substring(0, 50) + (content.length > 50 ? '...' : ''), scores: results.scores },
    });

    // Persona Nodes
    const radius = 280;
    const numPersonas = results.persona_reactions.length;
    results.persona_reactions.forEach((reaction, index) => {
      // Calculate position in an orbit (lower half)
      const angle = (Math.PI / (numPersonas + 1)) * (index + 1);
      initialNodes.push({
        id: `persona-${index}`,
        type: 'persona',
        position: {
          x: 400 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * (radius * 0.8),
        },
        data: reaction,
      });

      initialEdges.push({
        id: `edge-center-persona-${index}`,
        source: 'center',
        target: `persona-${index}`,
        animated: true,
        style: { stroke: reaction.sentiment === 'positive' ? 'var(--success)' : reaction.sentiment === 'negative' ? 'var(--danger)' : 'var(--text-secondary)' },
      });
    });

    // Trend Nodes
    const trends = [...(results.mcp_trend_insights.similar_viral_patterns || []), ...(results.mcp_trend_insights.engagement_observations || [])].slice(0, 3);
    const numTrends = trends.length;
    trends.forEach((trend, index) => {
      // Upper half orbit
      const angle = Math.PI + (Math.PI / (numTrends + 1)) * (index + 1);
      initialNodes.push({
        id: `trend-${index}`,
        type: 'trend',
        position: {
          x: 400 + Math.cos(angle) * radius * 1.2,
          y: 300 + Math.sin(angle) * (radius * 0.6),
        },
        data: { label: trend.substring(0, 40) + '...' },
      });

      initialEdges.push({
        id: `edge-trend-center-${index}`,
        source: `trend-${index}`,
        target: 'center',
        animated: true,
        style: { stroke: '#0ea5e9' }, // Light blue
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [results, content]);

  return (
    <div style={{ width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--panel-border)', background: 'var(--bg-color)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        minZoom={0.5}
      >
        <Background color="#ffffff" variant="dots" gap={20} size={1} opacity={0.05} />
        <Controls showInteractive={false} style={{ display: 'none' }} />
      </ReactFlow>
    </div>
  );
};

export default SimulationGraph;
