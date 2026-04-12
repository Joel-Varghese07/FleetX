import { useEffect, useState } from 'react'
import api from '../api'

export default function DriverDashboard({ user }) {
  const [expenses, setExpenses] = useState([])
  const [revenue, setRevenue] = useState([])

  useEffect(() => {
    api.get('/expenses').then(r => setExpenses(r.data.slice(0, 5)))
    api.get('/revenue').then(r => setRevenue(r.data.slice(0, 5)))
  }, [])

  const totalExp = expenses.reduce((s, e) => s + e.amount, 0)
  const totalRev = revenue.reduce((s, r) => s + r.amount, 0)

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Welcome, {user.name}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'My Expenses (recent)', value: `₹${totalExp.toLocaleString()}`, color: '#ef4444' },
          { label: 'My Revenue (recent)', value: `₹${totalRev.toLocaleString()}`, color: '#22c55e' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', borderLeft: `4px solid ${c.color}` }}>
            <p style={{ margin: '0 0 0.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#94a3b8' }}>Recent Expenses</h3>
        {expenses.length === 0 ? <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No expenses logged yet. Use the Expenses page to add one.</p> :
          expenses.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>{e.date} — {e.type}</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>₹{e.amount}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}