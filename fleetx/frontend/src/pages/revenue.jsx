import { useEffect, useState } from 'react'
import api from '../api'

export default function Revenue({ user }) {
  const [revenue, setRevenue] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], trip_distance: '' })
  const [show, setShow] = useState(false)

  const load = () => { api.get('/revenue').then(r => setRevenue(r.data)); api.get('/vehicles').then(r => setVehicles(r.data)) }
  useEffect(load, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/revenue', form)
    setShow(false); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Revenue</h1>
        <button onClick={() => setShow(!show)} style={btnStyle('#22c55e')}>+ Log Revenue</button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.registration})</option>)}
          </select>
          <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={inp} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inp} />
          <input type="number" placeholder="Trip distance (km)" value={form.trip_distance} onChange={e => setForm({ ...form, trip_distance: e.target.value })} style={inp} />
          <input placeholder="Description / Trip details" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, gridColumn: '1/-1' }} />
          <button type="submit" style={{ ...btnStyle('#22c55e'), gridColumn: '1/-1' }}>Save Revenue</button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Date', 'Vehicle', 'Amount', 'Distance (km)', 'Description', 'Driver'].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {revenue.map(r => (
              <tr key={r.id} style={{ borderTop: '1px solid #334155' }}>
                <td style={td}>{r.date}</td>
                <td style={td}>{r.vehicle_name}</td>
                <td style={{ ...td, color: '#22c55e', fontWeight: 600 }}>₹{Number(r.amount).toLocaleString()}</td>
                <td style={td}>{r.trip_distance || '—'}</td>
                <td style={{ ...td, color: '#94a3b8' }}>{r.description}</td>
                <td style={td}>{r.driver_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {revenue.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No revenue logged yet.</p>}
      </div>
    </div>
  )
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' }
const td = { padding: '0.6rem 0.75rem', color: '#f1f5f9' }
const btnStyle = bg => ({ background: bg, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' })