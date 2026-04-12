import { useEffect, useState } from 'react'
import api from '../api'

const TYPES = ['Fuel', 'Oil', 'Toll', 'Fine', 'Driver Allowance', 'Tyre', 'Minor Repair', 'Other']

export default function Expenses({ user }) {
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', type: 'Fuel', amount: '', description: '', date: new Date().toISOString().split('T')[0], odometer: '' })
  const [show, setShow] = useState(false)

  const load = () => {
    api.get('/expenses').then(r => setExpenses(r.data))
    api.get('/vehicles').then(r => setVehicles(r.data))
  }

  useEffect(load, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/expenses', form)
    setShow(false); setForm({ ...form, amount: '', description: '', odometer: '' }); load()
  }

  const del = async id => { await api.delete(`/expenses/${id}`); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Expenses</h1>
        <button onClick={() => setShow(!show)} style={btnStyle('#0284c7')}>+ Log Expense</button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.registration})</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={inp} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inp} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
          <input type="number" placeholder="Odometer (km)" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} style={inp} />
          <button type="submit" style={{ ...btnStyle('#22c55e'), gridColumn: '1/-1' }}>Save Expense</button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Date', 'Vehicle', 'Type', 'Amount', 'Description', 'Driver', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} style={{ borderTop: '1px solid #334155' }}>
                <td style={td}>{e.date}</td>
                <td style={td}>{e.vehicle_name}</td>
                <td style={td}><span style={{ background: '#0c1f35', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{e.type}</span></td>
                <td style={{ ...td, color: '#ef4444', fontWeight: 600 }}>₹{Number(e.amount).toLocaleString()}</td>
                <td style={{ ...td, color: '#94a3b8' }}>{e.description}</td>
                <td style={td}>{e.driver_name}</td>
                <td style={td}>{user.role === 'admin' && <button onClick={() => del(e.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No expenses logged yet.</p>}
      </div>
    </div>
  )
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' }
const td = { padding: '0.6rem 0.75rem', color: '#f1f5f9' }
const btnStyle = bg => ({ background: bg, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' })