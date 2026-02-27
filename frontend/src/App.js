import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import io from 'socket.io-client';
import Rules from './Rules';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([
    { _id: '1', type: 'Driver Incident', priority: 'high', message: 'Driver collision detected at Sector 5', status: 'escalated', createdAt: new Date() },
    { _id: '2', type: 'Payment Issue', priority: 'medium', message: 'Payment failed for ride ID #4521', status: 'new', createdAt: new Date(Date.now() - 60000) },
    { _id: '3', type: 'System Error', priority: 'low', message: 'Cache timeout on API gateway', status: 'resolved', createdAt: new Date(Date.now() - 120000) },
  ]);
  const [filters, setFilters] = useState({ type: '', priority: '' });
  const [newAlert, setNewAlert] = useState({ type: '', message: '', priority: 'medium' });
  const [message, setMessage] = useState('');

  const fetchAlerts = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.priority) params.priority = filters.priority;
      const res = await axios.get('/api/alerts', { params });
      if (res.data.length > 0) setAlerts(res.data);
    } catch (err) {
      console.warn('Backend unavailable - using demo data');
    }
  };

  useEffect(() => {
    fetchAlerts();
    try {
      const socket = io();
      socket.on('newAlert', (alert) => {
        setAlerts(prev => [alert, ...prev]);
      });
      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.warn('Socket unavailable - offline mode');
    }
  }, [filters]);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.type || !newAlert.message) {
      setMessage('⚠️ Type and message are required!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const res = await axios.post('/api/alerts', newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setNewAlert({ type: '', message: '', priority: 'medium' });
      setMessage('✅ Alert created and sent to backend!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('💾 Offline mode - Alert saved locally');
      const localAlert = {
        _id: Date.now().toString(),
        ...newAlert,
        status: 'new',
        createdAt: new Date(),
      };
      setAlerts(prev => [localAlert, ...prev]);
      setNewAlert({ type: '', message: '', priority: 'medium' });
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const data = {
    labels: alerts.slice(0, 10).map(a => new Date(a.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Alert Priority Score',
        data: alerts.slice(0, 10).map(a => a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const filtered = alerts.filter(a => {
    if (filters.type && !a.type.toLowerCase().includes(filters.type.toLowerCase())) return false;
    if (filters.priority && a.priority !== filters.priority) return false;
    return true;
  });

  return (
    <Router>
      <div className="app-container">
        <nav className="header-nav">
          <Link to="/" className="nav-link"><strong>📊 Dashboard</strong></Link>
          <Link to="/rules" className="nav-link"><strong>⚙️ Rules Engine</strong></Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="dashboard-title">🚗 RideOps Alert Management System</h1>
                
                <div style={{ 
                  background: '#dbeafe', 
                  border: '2px solid #3b82f6', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '2rem',
                  fontSize: '0.95rem'
                }}>
                  <h3 style={{ marginTop: 0, color: '#1e40af' }}>ℹ️ How to Use This Dashboard</h3>
                  <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li><strong>"Alert Type":</strong> Enter the type of incident (e.g., "Driver Incident", "Payment Issue", "System Error")</li>
                    <li><strong>"Message":</strong> Describe what happened (e.g., "Collision detected", "Payment timeout")</li>
                    <li><strong>"Priority":</strong> Select urgency level:
                      <ul style={{ margin: '0.5rem 0' }}>
                        <li>🟢 <strong>Low:</strong> Non-critical issues (cache errors, warnings)</li>
                        <li>🟡 <strong>Medium:</strong> Important but manageable (payment, connection issues)</li>
                        <li>🔴 <strong>High:</strong> Critical incidents (collisions, safety concerns)</li>
                      </ul>
                    </li>
                    <li>Click <strong>"📤 Create Alert"</strong> to add it to the system</li>
                    <li>Use <strong>Search</strong> and <strong>Filter</strong> to find specific alerts</li>
                    <li>Go to <strong>"Rules Engine"</strong> tab to set up automatic alert escalation</li>
                  </ol>
                </div>

                {message && (
                  <div style={{ 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    borderRadius: '0.375rem',
                    background: message.includes('✅') ? '#dcfce7' : '#fef3c7',
                    border: `1px solid ${message.includes('✅') ? '#86efac' : '#fcd34d'}`,
                    color: message.includes('✅') ? '#166534' : '#92400e',
                    fontWeight: 'bold'
                  }}>{message}</div>
                )}

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>📝 Create New Alert</h3>
                  <form onSubmit={handleCreateAlert} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Alert Type *</label>
                      <input
                        type="text"
                        placeholder="e.g., Driver Incident"
                        value={newAlert.type}
                        onChange={e => setNewAlert({ ...newAlert, type: e.target.value })}
                        style={{ 
                          width: '100%', 
                          border: '1px solid #d1d5db', 
                          padding: '0.5rem', 
                          borderRadius: '0.375rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Message *</label>
                      <input
                        type="text"
                        placeholder="e.g., Collision detected at Sector 5"
                        value={newAlert.message}
                        onChange={e => setNewAlert({ ...newAlert, message: e.target.value })}
                        style={{ 
                          width: '100%', 
                          border: '1px solid #d1d5db', 
                          padding: '0.5rem', 
                          borderRadius: '0.375rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>Priority</label>
                      <select
                        value={newAlert.priority}
                        onChange={e => setNewAlert({ ...newAlert, priority: e.target.value })}
                        style={{ border: '1px solid #d1d5db', padding: '0.5rem', borderRadius: '0.375rem' }}
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '0.375rem', 
                        cursor: 'pointer', 
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.target.style.background = '#2563eb'}
                      onMouseOut={e => e.target.style.background = '#3b82f6'}
                    >
                      📤 Create Alert
                    </button>
                  </form>
                </div>

                <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>📈 Alert Trends</h2>
                <div className="chart-container">
                  <Line data={data} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>🔍 Search & Filter Alerts</h2>
                <div className="filter-container">
                  <input
                    className="filter-input"
                    placeholder="Search type (e.g., Driver...)"
                    value={filters.type}
                    onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                  />
                  <select
                    className="filter-select"
                    value={filters.priority}
                    onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="">All Priorities</option>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <button
                    className="filter-button"
                    onClick={() => setFilters({ type: '', priority: '' })}
                  >
                    ✕ Clear Filters
                  </button>
                </div>

                <h2 style={{ marginBottom: '1rem' }}>📋 All Alerts ({filtered.length})</h2>
                <table className="alerts-table">
                  <thead>
                    <tr>
                      <th>Alert Type</th>
                      <th>Priority</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No alerts found. Create one above! ↑</td></tr>
                    ) : (
                      filtered.map(a => (
                        <tr key={a._id}>
                          <td style={{ fontWeight: '500' }}>{a.type}</td>
                          <td style={{ 
                            fontWeight: 'bold', 
                            color: a.priority === 'high' ? '#dc2626' : a.priority === 'medium' ? '#d97706' : '#10b981',
                            fontSize: '0.9rem'
                          }}>
                            {a.priority === 'high' ? '🔴 HIGH' : a.priority === 'medium' ? '🟡 MEDIUM' : '🟢 LOW'}
                          </td>
                          <td>{a.message}</td>
                          <td style={{ 
                            fontWeight: '600', 
                            color: a.status === 'resolved' ? '#10b981' : a.status === 'escalated' ? '#dc2626' : '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            {a.status === 'resolved' ? '✅ RESOLVED' : a.status === 'escalated' ? '⚠️ ESCALATED' : '🆕 NEW'}
                          </td>
                          <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {new Date(a.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            }
          />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

