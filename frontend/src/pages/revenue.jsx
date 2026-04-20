import { useEffect, useState } from 'react'
import api from '../api'

export default function Revenue() {
  const [revenue, setRevenue] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], trip_distance: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([api.get('/revenue'), api.get('/vehicles')])
      .then(([r, v]) => { setRevenue(r.data); setVehicles(v.data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/revenue', form)
    setShow(false)
    setForm({ ...form, amount: '', description: '', trip_distance: '' })
    load()
  }

  const total = revenue.reduce((s, r) => s + r.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Revenue</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {revenue.length} entries · <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)' }}>₹{total.toLocaleString('en-IN')}</span> total
          </p>
        </div>
        <button onClick={() => setShow(!show)} style={{ padding: '0.6rem 1.25rem', background: show ? 'var(--bg3)' : 'var(--green)', color: show ? 'var(--text2)' : '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font)' }}>
          {show ? 'Cancel' : '+ Log revenue'}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>New revenue entry</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={lbl}>Vehicle</label>
              <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Amount (₹)</label>
              <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Trip distance (km)</label>
              <input type="number" placeholder="Optional" value={form.trip_distance} onChange={e => setForm({ ...form, trip_distance: e.target.value })} style={inp} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={lbl}>Description / Trip details</label>
              <input placeholder="e.g. Chennai to Bangalore freight" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '1.25rem', padding: '0.7rem 2rem', background: 'var(--green)', color: '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font)' }}>
            Save revenue
          </button>
        </form>
      )}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 140px 110px 100px 1fr 120px', borderBottom: '1px solid var(--border)' }}>
          {['Date', 'Vehicle', 'Amount', 'Distance', 'Description', 'Driver'].map(h => (
            <div key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {loading
          ? <p style={{ padding: '2rem', color: 'var(--text3)', textAlign: 'center' }}>Loading...</p>
          : revenue.length === 0
            ? <p style={{ padding: '3rem', color: 'var(--text3)', textAlign: 'center' }}>No revenue logged yet.</p>
            : (
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 420px)' }}>
                {revenue.map((r, i) => (
                  <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '100px 140px 110px 100px 1fr 120px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text3)' }}>{r.date}</div>
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500 }}>{r.vehicle_name}</div>
                    <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--green)' }}>₹{Number(r.amount).toLocaleString()}</div>
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{r.trip_distance ? `${r.trip_distance} km` : '—'}</div>
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description || '—'}</div>
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text2)' }}>{r.driver_name}</div>
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
