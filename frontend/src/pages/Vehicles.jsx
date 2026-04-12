import { useEffect, useState } from 'react'
import api from '../api'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ name: '', registration: '', type: 'Truck', purchase_cost: '', purchase_date: '', fuel_type: 'diesel' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/vehicles')
      .then(r => { setVehicles(r.data); setLoading(false) })
      .catch(e => { setError(e.response?.data?.error || 'Failed to load vehicles'); setLoading(false) })
  }

  useEffect(load, [])

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

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading vehicles...</p>
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Vehicles</h1>
        <button onClick={() => setShow(!show)} style={btnStyle('#0284c7')}>+ Add Vehicle</button>
      </div>

      {show && (
        <form onSubmit={submit} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <input placeholder="Vehicle name (e.g. Truck 01)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inp} />
          <input placeholder="Registration (e.g. KL-07-AB-1234)" value={form.registration} onChange={e => setForm({ ...form, registration: e.target.value })} required style={inp} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
            {['Truck', 'Van', 'Bus', 'Car', 'Bike', 'Other'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={form.fuel_type} onChange={e => setForm({ ...form, fuel_type: e.target.value })} style={inp}>
            {['diesel', 'petrol', 'electric', 'cng'].map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Purchase cost (₹)" value={form.purchase_cost} onChange={e => setForm({ ...form, purchase_cost: e.target.value })} style={inp} />
          <input type="date" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} style={inp} />
          <button type="submit" style={{ ...btnStyle('#22c55e'), gridColumn: '1/-1' }}>Save Vehicle</button>
        </form>
      )}

      {vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
          <p style={{ fontSize: '1rem' }}>No vehicles added yet.</p>
          <p style={{ fontSize: '0.85rem' }}>Click "+ Add Vehicle" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {vehicles.map(v => (
            <div key={v.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '1.25rem', borderLeft: `4px solid ${v.status === 'active' ? '#22c55e' : '#64748b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{v.name}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>{v.registration}</p>
                </div>
                <button onClick={() => del(v.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Type: {v.type}</span>
                <span>Fuel: {v.fuel_type}</span>
                <span>Purchase: ₹{Number(v.purchase_cost).toLocaleString()}</span>
                <span>ODO: {v.odometer} km</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.85rem' }
const btnStyle = bg => ({ background: bg, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' })