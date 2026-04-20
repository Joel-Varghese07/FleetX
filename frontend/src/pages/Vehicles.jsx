import { useEffect, useState } from 'react'
import api from '../api'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ name: '', registration: '', type: 'Truck', purchase_cost: '', purchase_date: '', fuel_type: 'diesel' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    api.get('/vehicles')
      .then(r => { setVehicles(r.data); setLoading(false) })
      .catch(e => { setError(e.response?.data?.error || 'Failed to load'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const submit = async e => {
    e.preventDefault()
    try {
      await api.post('/vehicles', form)
      setShow(false)
      setForm({ name: '', registration: '', type: 'Truck', purchase_cost: '', purchase_date: '', fuel_type: 'diesel' })
      load()
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add vehicle')
    }
  }

  const del = async id => {
    if (!window.confirm('Delete this vehicle?')) return
    await api.delete(`/vehicles/${id}`)
    load()
  }

  const typeColors = { Truck: 'var(--accent)', Van: 'var(--purple)', Bus: 'var(--amber)', Car: 'var(--green)', Bike: 'var(--red)', Other: 'var(--text2)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Vehicles</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in fleet</p>
        </div>
        <button onClick={() => setShow(!show)} style={{
          padding: '0.6rem 1.25rem', background: show ? 'var(--bg3)' : 'var(--accent)',
          color: show ? 'var(--text2)' : '#080c10', border: 'none',
          borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem',
          fontFamily: 'var(--font)'
        }}>
          {show ? 'Cancel' : '+ Add vehicle'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)', color: 'var(--red)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>{error}</div>}

      {show && (
        <form onSubmit={submit} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>New vehicle details</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={lbl}>Vehicle name</label>
              <input placeholder="Truck 01" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Registration</label>
              <input placeholder="KL-07-AB-1234" value={form.registration} onChange={e => setForm({ ...form, registration: e.target.value })} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                {['Truck', 'Van', 'Bus', 'Car', 'Bike', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Fuel type</label>
              <select value={form.fuel_type} onChange={e => setForm({ ...form, fuel_type: e.target.value })} style={inp}>
                {['diesel', 'petrol', 'electric', 'cng'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Purchase cost (₹)</label>
              <input type="number" placeholder="0" value={form.purchase_cost} onChange={e => setForm({ ...form, purchase_cost: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>Purchase date</label>
              <input type="date" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} style={inp} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '1.25rem', padding: '0.7rem 2rem', background: 'var(--green)', color: '#080c10', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font)' }}>
            Save vehicle
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--text3)' }}>Loading...</p>
      ) : vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text3)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }}><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No vehicles yet</p>
          <p style={{ fontSize: '0.85rem' }}>Add your first vehicle to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {vehicles.map(v => (
            <div key={v.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: typeColors[v.type] || 'var(--text2)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{v.name}</h3>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>{v.registration}</span>
                </div>
                <button onClick={() => del(v.id)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
                >✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {[
                  { label: 'Type', value: v.type },
                  { label: 'Fuel', value: v.fuel_type },
                  { label: 'Purchase', value: `₹${Number(v.purchase_cost).toLocaleString()}` },
                  { label: 'Odometer', value: `${v.odometer} km` },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{item.label}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--mono)' }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.status === 'active' ? 'var(--green)' : 'var(--text3)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const lbl = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }
const inp = { width: '100%', padding: '0.65rem 0.875rem', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font)' }
