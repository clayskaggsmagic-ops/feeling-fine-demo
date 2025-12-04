import React, { useMemo, useState, useEffect } from 'react';
import { CORNERSTONE_CATEGORIES } from '../../data/models';
import { getReportAnalysis } from '../../services/GeminiService';
import { WEBSITE_GUIDE } from '../../data/websiteGuide';

const WeeklyReport = ({ user }) => {
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Hello! I'm your Wellness Assistant. I've analyzed your data and I'm here to help. Ask me about your trends or how to use the website!" }
  ]);
  const [selectedChart, setSelectedChart] = useState('total'); // 'total' or categoryId
  const [trackingData, setTrackingData] = useState({});

  // Load and populate data
  useEffect(() => {
    const loadData = () => {
      const saved = JSON.parse(localStorage.getItem('feelingFineTracking') || '{}');

      // If we have very little data (e.g. first load), populate mock history
      if (Object.keys(saved).length < 5) {
        const newData = { ...saved };
        const today = new Date();

        // Generate 30 days of history (excluding today so we don't overwrite user actions)
        for (let i = 1; i <= 30; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateKey = d.toISOString().split('T')[0];

          if (!newData[dateKey]) { // Only fill if missing
            const score = Math.floor(Math.random() * 6) + 5;
            const completedActs = {};

            CORNERSTONE_CATEGORIES.forEach(cat => {
              if (Math.random() > 0.3) {
                const count = Math.floor(Math.random() * 3) + 1;
                const acts = [];
                for (let j = 0; j < count; j++) acts.push(`${cat.id}_${j}`);
                completedActs[cat.id] = acts;
              }
            });
            newData[dateKey] = { feelingScore: score, completedActs };
          }
        }

        localStorage.setItem('feelingFineTracking', JSON.stringify(newData));
        setTrackingData(newData);
      } else {
        setTrackingData(saved);
      }
    };

    loadData();

    // Listen for storage events (in case data changes in another tab or component)
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    const last30Days = [];
    let totalActsLast7 = 0;
    let totalActsPrev7 = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayData = trackingData[dateKey] || {}; // Use state data

      const dayStats = {
        day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalActs: 0,
        categoryActs: {}
      };

      CORNERSTONE_CATEGORIES.forEach(cat => {
        const count = (dayData.completedActs?.[cat.id] || []).length;
        dayStats.categoryActs[cat.id] = count;
        dayStats.totalActs += count;
      });

      last30Days.push(dayStats);

      // Trend calc
      if (i < 7) totalActsLast7 += dayStats.totalActs;
      else if (i < 14) totalActsPrev7 += dayStats.totalActs;
    }

    const trend = totalActsLast7 >= totalActsPrev7 ? 'up' : 'down';
    const totalActs = last30Days.reduce((acc, day) => acc + day.totalActs, 0);

    return { dailyStats: last30Days, totalActs, trend };
  }, [trackingData]); // Re-calc when data changes

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Convert chat history to Gemini format
      const apiHistory = chatHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await getReportAnalysis(
        userMsg.text,
        { trend: stats.trend, totalActs: stats.totalActs },
        WEBSITE_GUIDE,
        apiHistory,
        user?.name || 'friend'
      );

      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Determine chart data based on selection
  const chartData = stats.dailyStats.map(day => ({
    label: day.day,
    value: selectedChart === 'total' ? day.totalActs : day.categoryActs[selectedChart]
  }));

  const maxVal = Math.max(...chartData.map(d => d.value), 5); // Minimum scale of 5

  return (
    <div className="animate-fade-in">
      <h3 className="mb-2">Monthly Wellness Report</h3>

      {/* Main Chart Card */}
      <div className="card mb-2" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {selectedChart === 'total' ? 'Total Small Acts' : CORNERSTONE_CATEGORIES.find(c => c.id === selectedChart)?.name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-brand-primary)' }}>
                {chartData.reduce((a, b) => a + b.value, 0)}
              </span>
              <span style={{
                color: stats.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)',
                fontWeight: '600',
                background: stats.trend === 'up' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.9rem'
              }}>
                {stats.trend === 'up' ? '↗ Trending Up' : '↘ Trending Down'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Last 30 Days</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '1.5rem' }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div
                title={`${d.label}: ${d.value}`}
                style={{
                  width: '100%',
                  height: `${(d.value / maxVal) * 100}%`,
                  background: selectedChart === 'total' ? 'var(--color-brand-primary)' : 'var(--color-brand-secondary)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  minHeight: d.value > 0 ? '4px' : '0'
                }}
              />
            </div>
          ))}
        </div>

        {/* Category Toggle Bar */}
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '1rem'
        }}>
          <button
            onClick={() => setSelectedChart('total')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedChart === 'total' ? 'var(--color-brand-primary)' : 'transparent',
              background: selectedChart === 'total' ? 'rgba(44, 122, 123, 0.1)' : 'transparent',
              color: selectedChart === 'total' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem'
            }}
          >
            Total
          </button>
          {CORNERSTONE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedChart(cat.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedChart === cat.id ? 'var(--color-brand-primary)' : 'transparent',
                background: selectedChart === cat.id ? 'rgba(44, 122, 123, 0.1)' : 'transparent',
                color: selectedChart === cat.id ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
        <h4 className="mb-1">Wellness Assistant 🤖</h4>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{
              marginBottom: '0.5rem',
              textAlign: msg.role === 'user' ? 'right' : 'left'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--color-brand-primary)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                maxWidth: '80%'
              }}>
                {msg.text}
              </span>
            </div>
          ))}
          {isTyping && (
            <div style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                background: 'white',
                color: '#718096',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                fontSize: '0.8rem',
                fontStyle: 'italic'
              }}>
                Thinking...
              </span>
            </div>
          )}
        </div>
        <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask for advice..."
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e0' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default WeeklyReport;
