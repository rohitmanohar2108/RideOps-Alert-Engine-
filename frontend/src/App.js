import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ type: '', priority: '' });

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const fetchAlerts = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.priority) params.priority = filters.priority;
      const res = await axios.get('/api/alerts', { params });
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    }
  };

  const data = {
    labels: alerts.map(a => new Date(a.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Alerts over time',
        data: alerts.map(a => a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const filtered = alerts.filter(a => {
    if (filters.type && !a.type.includes(filters.type)) return false;
    if (filters.priority && a.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">RideOps Alert Dashboard</h1>
      <div className="mb-4 flex space-x-2">
        <input
          className="border px-2 py-1"
          placeholder="Type"
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        />
        <select
          className="border px-2 py-1"
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-1"
          onClick={() => setFilters({ type: '', priority: '' })}
        >
          Clear
        </button>
      </div>
      <div className="mb-8">
        <Line data={data} />
      </div>

      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Message</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a._id}>
              <td className="border px-4 py-2">{a.type}</td>
              <td className="border px-4 py-2">{a.priority}</td>
              <td className="border px-4 py-2">{a.message}</td>
              <td className="border px-4 py-2">{a.status}</td>
              <td className="border px-4 py-2">{new Date(a.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
