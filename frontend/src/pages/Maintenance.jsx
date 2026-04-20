import { useEffect, useState } from 'react'
import api from '../api'

const M_TYPES = ['Oil Change', 'Tyre Rotation', 'Brake Service', 'Engine Service', 'Transmission', 'Battery', 'AC Service', 'General Checkup', 'Other']

export default function Maintenance() {
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', type: 'Oil Change', description: '', cost: '', date: new Date().toISOString().split('T')[0], next_due_date: '', next_due_odometer: '' })
  const [show, setShow] = useState(false)

  const load = () => {
    Promise.all([api.get('/maintenance'), api.get('/vehicles')])
      .then(([m, v]) => { setRecords(m.data); setVehicles(v.data) })
  }
  useEffect(load, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/maintenance', form)
    setShow(false)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Maintenance</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{records.length} records</p>
        </div>
        <button onClick={() => setShow(!show)} style={{ padding: '0.6rem 1.25rem', background: show ? 'var(--bg3)' : 'var(--amber)', color: show ? 'var(--text2)' : '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font)' }}>
          {show ? 'Cancel' : '+ Add record'}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>New maintenance record</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={lbl}>Vehicle</label>
              <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Service type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                {M_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Cost (₹)</label>
              <input type="number" placeholder="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>Service date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Next due date</label>
              <input type="date" value={form.next_due_date} onChange={e => setForm({ ...form, next_due_date: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>Next due odometer (km)</label>
              <input type="number" placeholder="Optional" value={form.next_due_odometer} onChange={e => setForm({ ...form, next_due_odometer: e.target.value })} style={inp} />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <label style={lbl}>Description</label>
              <input placeholder="Details about the service" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '1.25rem', padding: '0.7rem 2rem', background: 'var(--green)', color: '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font)' }}>
            Save record
          </button>
        </form>
      )}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 140px 140px 100px 1fr 120px', borderBottom: '1px solid var(--border)' }}>
          {['Date', 'Vehicle', 'Service', 'Cost', 'Description', 'Next due'].map(h => (
            <div key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {records.length === 0
          ? <p style={{ padding: '3rem', color: 'var(--text3)', textAlign: 'center' }}>No maintenance records yet.</p>
          : (
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
              {records.map((r, i) => (
                <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '100px 140px 140px 100px 1fr 120px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                >
                  <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text3)' }}>{r.date}</div>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500 }}>{r.vehicle_name}</div>
                  <div style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,179,0,0.1)', color: 'var(--amber)' }}>{r.type}</span>
                  </div>
                  <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--amber)' }}>₹{Number(r.cost).toLocaleString()}</div>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text3)' }}>{r.description || '—'}</div>
                  <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: r.next_due_date ? 'var(--accent)' : 'var(--text3)' }}>{r.next_due_date || '—'}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }
const inp = { width: '100%', padding: '0.65rem 0.875rem', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font)' }
