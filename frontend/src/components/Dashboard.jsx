import React, { useState } from 'react';
import axios from 'axios';
import { Play, Activity, TrendingUp, AlertTriangle, Users, Sparkles, Zap, Hand } from 'lucide-react';
import SimulationGraph from './SimulationGraph';
import { useASL, ASLText } from './ASLInterpreter';

const API_URL = import.meta.env.PROD ? '/api/simulate' : 'http://localhost:8000/api/simulate';

const Dashboard = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const { aslMode, setAslMode } = useASL();

  const handleSimulate = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setError('');
    setResults(null);
    
    try {
      const response = await axios.post(API_URL, { content });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during simulation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h1 style={{ margin: 0 }}>SocietyAI</h1>
          <button 
            onClick={() => setAslMode(!aslMode)}
            className="btn-primary" 
            style={{ 
              padding: '0.5rem 1rem', 
              width: 'auto', 
              background: aslMode ? 'var(--accent-color)' : 'transparent',
              border: '1px solid var(--accent-color)',
              color: aslMode ? 'white' : 'var(--accent-color)',
              fontSize: '0.875rem'
            }}
          >
            <Hand size={16} /> ASL Mode
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Predict how society will react to your content before publishing.</p>
      </header>

      <div className="glass-panel fade-in">
        <div className="textarea-container">
          <textarea 
            placeholder="Paste your reel idea, tweet, script, or ad copy here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={handleSimulate}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <><div className="loader"></div> Simulating Society...</>
          ) : (
            <><Play size={18} /> Run Simulation</>
          )}
        </button>
        {error && <p style={{ color: 'var(--danger)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      </div>

      {results && (
        <div className="results-grid">
          
          {/* Futuristic Node Graph */}
          <div className="glass-panel fade-in full-width" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
              <Sparkles size={20} color="#0ea5e9" /> Network Propagation Map
            </h3>
            <SimulationGraph results={results} content={content} />
          </div>
          
          {/* Scores Panel */}
          <div className="glass-panel fade-in full-width">
            <h3><Activity size={20} color="var(--accent-color)" /> Prediction Scores</h3>
            <div className="scores-container">
              <div>
                <div className="score-circle score-engagement">
                  {results?.scores?.engagement_score || 0}
                </div>
                <div className="score-label">Engagement</div>
              </div>
              <div>
                <div className="score-circle score-virality">
                  {results?.scores?.virality_score || 0}
                </div>
                <div className="score-label">Virality</div>
              </div>
              <div>
                <div className="score-circle score-controversy">
                  {results?.scores?.controversy_score || 0}
                </div>
                <div className="score-label">Controversy</div>
              </div>
            </div>
          </div>

          {/* Persona Reactions */}
          <div className="glass-panel fade-in full-width">
            <h3><Users size={20} color="var(--accent-color)" /> Persona Reactions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="persona-table">
                <thead>
                  <tr>
                    <th>Persona</th>
                    <th>Sentiment</th>
                    <th>Action</th>
                    <th>Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {(results?.persona_reactions || []).map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}><ASLText>{p.persona}</ASLText></td>
                      <td>
                        <span className={`tag ${p.sentiment}`}>
                          <ASLText>{p.sentiment}</ASLText>
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}><ASLText>{p.action}</ASLText></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}><ASLText>{p.reasoning}</ASLText></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MCP Trend Insights */}
          <div className="glass-panel fade-in">
            <h3><TrendingUp size={20} color="var(--success)" /> Viral Trends (MCP)</h3>
            <ul>
              {(results?.mcp_trend_insights?.similar_viral_patterns || []).map((item, i) => (
                <li key={i}><ASLText>{item}</ASLText></li>
              ))}
              {(results?.mcp_trend_insights?.engagement_observations || []).map((item, i) => (
                <li key={`obs-${i}`}><ASLText>{item}</ASLText></li>
              ))}
            </ul>
          </div>

          {/* Risk Analysis */}
          <div className="glass-panel fade-in">
            <h3><AlertTriangle size={20} color="var(--warning)" /> Risk & Safety</h3>
            {(!results?.risk_analysis?.potential_issues?.length && !results?.risk_analysis?.safety_flags?.length) ? (
              <p style={{ color: 'var(--success)' }}>No significant risks detected.</p>
            ) : (
              <ul>
                {(results?.risk_analysis?.potential_issues || []).map((item, i) => (
                  <li key={i} style={{ color: 'var(--warning)' }}><ASLText>{item}</ASLText></li>
                ))}
                {(results?.risk_analysis?.safety_flags || []).map((item, i) => (
                  <li key={`flag-${i}`} style={{ color: 'var(--danger)' }}><ASLText>{item}</ASLText></li>
                ))}
              </ul>
            )}
          </div>

          {/* Suggestions */}
          <div className="glass-panel fade-in">
            <h3><Zap size={20} color="var(--accent-color)" /> Optimization Suggestions</h3>
            <ul>
              {(results?.suggestions || []).map((item, i) => (
                <li key={i}><ASLText>{item}</ASLText></li>
              ))}
            </ul>
          </div>

          {/* Optimized Content */}
          <div className="glass-panel fade-in">
            <h3><Sparkles size={20} color="#8b5cf6" /> Optimized Content</h3>
            <div className="optimized-content">
              <ASLText>{results.optimized_content}</ASLText>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
