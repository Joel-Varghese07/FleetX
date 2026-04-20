import { useEffect, useState } from 'react'
import api from '../api'

const TYPES = ['Fuel', 'Oil', 'Toll', 'Fine', 'Driver Allowance', 'Tyre', 'Minor Repair', 'Other']
const typeColors = { Fuel: 'var(--accent)', Oil: 'var(--amber)', Toll: 'var(--purple)', Fine: 'var(--red)', 'Driver Allowance': 'var(--green)', Tyre: '#ff6b6b', 'Minor Repair': 'var(--amber)', Other: 'var(--text2)' }

export default function Expenses({ user }) {
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicle_id: '', type: 'Fuel', amount: '', description: '', date: new Date().toISOString().split('T')[0], odometer: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([api.get('/expenses'), api.get('/vehicles')])
      .then(([e, v]) => { setExpenses(e.data); setVehicles(v.data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/expenses', form)
    setShow(false)
    setForm({ ...form, amount: '', description: '', odometer: '' })
    load()
  }

  const del = async id => { await api.delete(`/expenses/${id}`); load() }
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Expenses</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {expenses.length} entries · <span style={{ color: 'var(--red)', fontFamily: 'var(--mono)' }}>₹{total.toLocaleString('en-IN')}</span> total
          </p>
        </div>
        <button onClick={() => setShow(!show)} style={{
          padding: '0.6rem 1.25rem', background: show ? 'var(--bg3)' : 'var(--red)',
          color: show ? 'var(--text2)' : '#fff', border: 'none',
          borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font)'
        }}>
          {show ? 'Cancel' : '+ Log expense'}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>New expense entry</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={lbl}>Vehicle</label>
              <select value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })} required style={inp}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Expense type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
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
              <label style={lbl}>Odometer (km)</label>
              <input type="number" placeholder="Optional" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input placeholder="Optional notes" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '1.25rem', padding: '0.7rem 2rem', background: 'var(--green)', color: '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font)' }}>
            Save expense
          </button>
        </form>
      )}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 140px 120px 100px 1fr 120px 40px', gap: '0', borderBottom: '1px solid var(--border)' }}>
          {['Date', 'Vehicle', 'Type', 'Amount', 'Description', 'Driver', ''].map(h => (
            <div key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <p style={{ padding: '2rem', color: 'var(--text3)', textAlign: 'center' }}>Loading...</p>
        ) : expenses.length === 0 ? (
          <p style={{ padding: '3rem', color: 'var(--text3)', textAlign: 'center', fontSize: '0.9rem' }}>No expenses logged yet.</p>
        ) : (
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 420px)' }}>
            {expenses.map((e, i) => (
              <div key={e.id} style={{
                display: 'grid', gridTemplateColumns: '100px 140px 120px 100px 1fr 120px 40px',
                borderBottom: '1px solid var(--border)', alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                transition: 'background 0.1s'
              }}
                onMouseEnter={el => el.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={el => el.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text3)' }}>{e.date}</div>
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.vehicle_name}</div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: `${typeColors[e.type] || 'var(--text2)'}15`, color: typeColors[e.type] || 'var(--text2)', whiteSpace: 'nowrap' }}>{e.type}</span>
                </div>
                <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--red)' }}>₹{Number(e.amount).toLocaleString()}</div>
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description || '—'}</div>
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text2)' }}>{e.driver_name}</div>
                <div style={{ padding: '0.75rem 0.5rem' }}>
                  {user.role === 'admin' && (
                    <button onClick={() => del(e.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '0.9rem', padding: '2px', width: '24px', height: '24px', borderRadius: '4px' }}
                      onMouseEnter={el => el.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={el => el.currentTarget.style.color = 'var(--text3)'}
                    >✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }
const inp = { width: '100%', padding: '0.65rem 0.875rem', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font)' }
