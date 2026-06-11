import React, { useState } from 'react';
import axios from 'axios';
import { Play, Activity, TrendingUp, AlertTriangle, Users, Sparkles, Zap } from 'lucide-react';

const API_URL = import.meta.env.PROD ? '/_/backend/api/simulate' : 'http://localhost:8000/api/simulate';

const Dashboard = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

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
        <h1>Society Simulator Agent</h1>
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
          
          {/* Scores Panel */}
          <div className="glass-panel fade-in full-width">
            <h3><Activity size={20} color="var(--accent-color)" /> Prediction Scores</h3>
            <div className="scores-container">
              <div>
                <div className="score-circle score-engagement">
                  {results.scores.engagement_score}
                </div>
                <div className="score-label">Engagement</div>
              </div>
              <div>
                <div className="score-circle score-virality">
                  {results.scores.virality_score}
                </div>
                <div className="score-label">Virality</div>
              </div>
              <div>
                <div className="score-circle score-controversy">
                  {results.scores.controversy_score}
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
                  {results.persona_reactions.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{p.persona}</td>
                      <td>
                        <span className={`tag ${p.sentiment}`}>
                          {p.sentiment}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{p.action}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.reasoning}</td>
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
              {results.mcp_trend_insights.similar_viral_patterns?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              {results.mcp_trend_insights.engagement_observations?.map((item, i) => (
                <li key={`obs-${i}`}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Risk Analysis */}
          <div className="glass-panel fade-in">
            <h3><AlertTriangle size={20} color="var(--warning)" /> Risk & Safety</h3>
            {results.risk_analysis.potential_issues.length === 0 && results.risk_analysis.safety_flags.length === 0 ? (
              <p style={{ color: 'var(--success)' }}>No significant risks detected.</p>
            ) : (
              <ul>
                {results.risk_analysis.potential_issues?.map((item, i) => (
                  <li key={i} style={{ color: 'var(--warning)' }}>{item}</li>
                ))}
                {results.risk_analysis.safety_flags?.map((item, i) => (
                  <li key={`flag-${i}`} style={{ color: 'var(--danger)' }}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Suggestions */}
          <div className="glass-panel fade-in">
            <h3><Zap size={20} color="var(--accent-color)" /> Optimization Suggestions</h3>
            <ul>
              {results.suggestions?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Optimized Content */}
          <div className="glass-panel fade-in">
            <h3><Sparkles size={20} color="#8b5cf6" /> Optimized Content</h3>
            <div className="optimized-content">
              {results.optimized_content}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
