import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ name: '', condition: '', action: '' });

  const fetchRules = async () => {
    try {
      const res = await axios.get('/api/rules');
      setRules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rules', form);
      setForm({ name: '', condition: '', action: '' });
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (rule) => {
    try {
      await axios.put(`/api/rules/${rule._id}`, { active: !rule.active });
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Rule Engine</h2>
      <form onSubmit={submit} className="mb-4 space-y-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1 w-full"
        />
        <input
          placeholder="Condition (JS)"
          value={form.condition}
          onChange={e => setForm({ ...form, condition: e.target.value })}
          className="border px-2 py-1 w-full"
        />
        <input
          placeholder="Action (JS)"
          value={form.action}
          onChange={e => setForm({ ...form, action: e.target.value })}
          className="border px-2 py-1 w-full"
        />
        <button className="bg-green-500 text-white px-4 py-1">Add Rule</button>
      </form>
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Action</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => (
            <tr key={r._id}>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{r.condition}</td>
              <td className="border px-2 py-1">{r.action}</td>
              <td className="border px-2 py-1">
                <button
                  className="text-blue-500"
                  onClick={() => toggleActive(r)}
                >
                  {r.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
