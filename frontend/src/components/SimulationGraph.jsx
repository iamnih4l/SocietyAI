import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- CUSTOM NODES ---

const InputNode = ({ data }) => (
  <div className="custom-node node-central">
    <div className="node-title">Raw Content</div>
    <div className="node-desc" style={{ color: 'white', marginTop: '10px' }}>{data.label}</div>
    <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
  </div>
);

const DatabaseNode = ({ data }) => (
  <div className="custom-node node-database">
    <div className="node-title">MCP Trend Database</div>
    <div className="node-desc">Historical Viral Patterns</div>
    <div style={{ fontSize: '0.75rem', marginTop: '10px', color: '#fcd34d', textAlign: 'left' }}>
      {data.trends.slice(0, 2).map((t, i) => (
        <div key={i}>• {t.substring(0, 30)}...</div>
      ))}
    </div>
    <Handle type="source" position={Position.Right} style={{ background: '#f59e0b' }} />
  </div>
);

const EngineNode = ({ data }) => (
  <div className="custom-node node-engine">
    <Handle type="target" position={Position.Left} id="in" style={{ background: '#d946ef' }} />
    <div className="node-title">Master Agent Engine</div>
    <div className="node-desc">Societal Analysis Core</div>
    <div style={{ fontSize: '0.75rem', marginTop: '10px', color: '#fbcfe8', textAlign: 'left' }}>
      <div><strong>Intent:</strong> {data.analysis.intent}</div>
      <div><strong>Tone:</strong> {data.analysis.tone}</div>
      <div><strong>Audience:</strong> {data.analysis.target_audience}</div>
    </div>
    <Handle type="source" position={Position.Right} id="out" style={{ background: '#d946ef' }} />
  </div>
);

const PersonaNode = ({ data }) => (
  <div className={`custom-node node-persona-${data.sentiment}`}>
    <Handle type="target" position={Position.Left} style={{ background: data.color }} />
    <div className="node-title">{data.persona}</div>
    <div className="node-desc">{data.action.toUpperCase()}</div>
    <Handle type="source" position={Position.Right} style={{ background: data.color }} />
  </div>
);

const ScoreNode = ({ data }) => (
  <div className="custom-node node-score">
    <Handle type="target" position={Position.Left} style={{ background: '#fbbf24' }} />
    <div className="node-title">{data.label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginTop: '5px' }}>
      {data.value}
    </div>
  </div>
);

const nodeTypes = {
  input: InputNode,
  database: DatabaseNode,
  engine: EngineNode,
  persona: PersonaNode,
  score: ScoreNode,
};

// --- GRAPH COMPONENT ---

const SimulationGraph = ({ results, content }) => {
  const { nodes, edges } = useMemo(() => {
    const initialNodes = [];
    const initialEdges = [];

    // STAGE 1: INPUTS (X: 0)
    initialNodes.push({
      id: 'input',
      type: 'input',
      position: { x: 0, y: 150 },
      data: { label: content.substring(0, 50) + (content.length > 50 ? '...' : '') },
    });

    initialNodes.push({
      id: 'database',
      type: 'database',
      position: { x: 0, y: 400 },
      data: { trends: results?.mcp_trend_insights?.similar_viral_patterns || [] },
    });

    // STAGE 2: ENGINE (X: 350)
    initialNodes.push({
      id: 'engine',
      type: 'engine',
      position: { x: 350, y: 250 },
      data: { analysis: results?.content_analysis || {} },
    });

    // Connect Inputs to Engine
    initialEdges.push({
      id: 'edge-input-engine', source: 'input', target: 'engine', animated: true,
      style: { stroke: '#6366f1' }
    });
    initialEdges.push({
      id: 'edge-db-engine', source: 'database', target: 'engine', animated: true,
      style: { stroke: '#f59e0b' }
    });

    // STAGE 3: PERSONAS (X: 750)
    const personaReactions = results?.persona_reactions || [];
    const startY = 50;
    const spacingY = 120;

    personaReactions.forEach((reaction, index) => {
      const pId = `persona-${index}`;
      const color = reaction.sentiment === 'positive' ? '#10b981' : reaction.sentiment === 'negative' ? '#ef4444' : '#94a3b8';
      
      initialNodes.push({
        id: pId,
        type: 'persona',
        position: { x: 750, y: startY + (index * spacingY) },
        data: { ...reaction, color },
      });

      // Engine to Persona
      initialEdges.push({
        id: `edge-engine-${pId}`, source: 'engine', target: pId, animated: true,
        style: { stroke: '#d946ef' }
      });

      // Persona to Scores (Stage 4)
      if (reaction.action === 'share' || reaction.action === 'like') {
        initialEdges.push({
          id: `edge-${pId}-virality`, source: pId, target: 'score-virality', animated: true, style: { stroke: color, opacity: 0.5 }
        });
        initialEdges.push({
          id: `edge-${pId}-engagement`, source: pId, target: 'score-engagement', animated: true, style: { stroke: color, opacity: 0.5 }
        });
      } else if (reaction.action === 'comment') {
        initialEdges.push({
          id: `edge-${pId}-engagement`, source: pId, target: 'score-engagement', animated: true, style: { stroke: color, opacity: 0.5 }
        });
        if (reaction.sentiment === 'negative') {
          initialEdges.push({
            id: `edge-${pId}-controversy`, source: pId, target: 'score-controversy', animated: true, style: { stroke: color, opacity: 0.5 }
          });
        }
      }
    });

    // STAGE 4: SCORES (X: 1150)
    initialNodes.push({
      id: 'score-engagement', type: 'score', position: { x: 1150, y: 150 },
      data: { label: 'Engagement', value: results?.scores?.engagement_score || 0 }
    });
    initialNodes.push({
      id: 'score-virality', type: 'score', position: { x: 1150, y: 300 },
      data: { label: 'Virality', value: results?.scores?.virality_score || 0 }
    });
    initialNodes.push({
      id: 'score-controversy', type: 'score', position: { x: 1150, y: 450 },
      data: { label: 'Controversy', value: results?.scores?.controversy_score || 0 }
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
        maxZoom={1.5}
        attributionPosition="bottom-right"
      >
        <Background color="#ffffff" variant="dots" gap={20} size={1} opacity={0.05} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default SimulationGraph;
