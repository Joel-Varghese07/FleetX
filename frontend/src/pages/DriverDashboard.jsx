import { useEffect, useState } from 'react'
import api from '../api'

export default function DriverDashboard({ user }) {
  const [expenses, setExpenses] = useState([])
  const [revenue, setRevenue] = useState([])

  useEffect(() => {
    Promise.all([api.get('/expenses'), api.get('/revenue')])
      .then(([e, r]) => { setExpenses(e.data.slice(0, 8)); setRevenue(r.data.slice(0, 8)) })
  }, [])

  const totalExp = expenses.reduce((s, e) => s + e.amount, 0)
  const totalRev = revenue.reduce((s, r) => s + r.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Hello, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Your activity overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { label: 'My expenses (recent)', value: `₹${totalExp.toLocaleString('en-IN')}`, color: 'var(--red)', sub: `${expenses.length} entries` },
          { label: 'My revenue (recent)', value: `₹${totalRev.toLocaleString('en-IN')}`, color: 'var(--green)', sub: `${revenue.length} trips` },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', borderTop: `2px solid ${c.color}` }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: c.color, fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>{c.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.4rem' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent expenses</p>
        </div>
        {expenses.length === 0
          ? <p style={{ padding: '2rem', color: 'var(--text3)', textAlign: 'center', fontSize: '0.85rem' }}>No expenses logged yet. Go to Expenses to add one.</p>
          : expenses.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              onMouseEnter={el => el.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={el => el.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text3)', minWidth: '80px' }}>{e.date}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{e.vehicle_name}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: 'rgba(0,212,255,0.08)', color: 'var(--accent)' }}>{e.type}</span>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--red)' }}>₹{Number(e.amount).toLocaleString()}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
