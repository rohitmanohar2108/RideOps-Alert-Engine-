import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('/api/alerts');
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">RideOps Alert Dashboard</h1>
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
          {alerts.map(a => (
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
