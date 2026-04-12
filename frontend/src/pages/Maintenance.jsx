import { useEffect, useState } from 'react'
import api from '../api'

const TYPES = ['Oil Change', 'Tyre Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Battery', 'AC Service', 'General Checkup', 'Other']

export default function Maintenance() {
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', type: 'Oil Change', description: '', cost: '', date: new Date().toISOString().split('T')[0], next_due_date: '', next_due_odometer: '' })
  const [show, setShow] = useState(false)

  const load = () => { api.get('/maintenance').then(r => setRecords(r.data)); api.get('/vehicles').then(r => setVehicles(r.data)) }
  useEffect(load, [])

  const submit = async e => { e.preventDefault(); await api.post('/maintenance', form); setShow(false); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Maintenance</h1>
        <button onClick={() => setShow(!show)} style={btnStyle('#fb923c')}>+ Add Record</button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Cost (₹)" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} style={inp} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inp} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
          <input type="date" placeholder="Next due date" value={form.next_due_date} onChange={e => setForm({ ...form, next_due_date: e.target.value })} style={inp} />
          <input type="number" placeholder="Next due odometer (km)" value={form.next_due_odometer} onChange={e => setForm({ ...form, next_due_odometer: e.target.value })} style={inp} />
          <button type="submit" style={{ ...btnStyle('#22c55e'), gridColumn: '1/-1' }}>Save Record</button>
        </form>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Date', 'Vehicle', 'Type', 'Cost', 'Next Due', 'Description'].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderTop: '1px solid #334155' }}>
                <td style={td}>{r.date}</td>
                <td style={td}>{r.vehicle_name}</td>
                <td style={td}><span style={{ background: '#2d1b00', color: '#fb923c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{r.type}</span></td>
                <td style={{ ...td, color: '#fb923c', fontWeight: 600 }}>₹{Number(r.cost).toLocaleString()}</td>
                <td style={{ ...td, color: r.next_due_date ? '#fbbf24' : '#64748b' }}>{r.next_due_date || '—'}</td>
                <td style={{ ...td, color: '#94a3b8' }}>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No maintenance records yet.</p>}
      </div>
    </div>
  )
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' }
const td = { padding: '0.6rem 0.75rem', color: '#f1f5f9' }
const btnStyle = bg => ({ background: bg, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' })