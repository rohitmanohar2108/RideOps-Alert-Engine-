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
    <div className="rules-container">
      <h2 className="rules-title">Rule Engine</h2>
      <form onSubmit={submit} className="rules-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Condition (JS)"
          value={form.condition}
          onChange={e => setForm({ ...form, condition: e.target.value })}
        />
        <input
          placeholder="Action (JS)"
          value={form.action}
          onChange={e => setForm({ ...form, action: e.target.value })}
        />
        <button>Add Rule</button>
      </form>
      <table className="rules-table">
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
              <td>{r.name}</td>
              <td>{r.condition}</td>
              <td>{r.action}</td>
              <td>
                <button
                  className="action-button"
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
