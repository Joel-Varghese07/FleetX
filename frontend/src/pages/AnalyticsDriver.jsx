// Analytics.jsx
import { useEffect, useState } from 'react'
import api from '../api'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'

const COLORS = ['var(--accent)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)', '#ff6b6b']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
      <p style={{ color: 'var(--text2)', marginBottom: '0.4rem' }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color || 'var(--accent)', fontWeight: 600, fontFamily: 'var(--mono)' }}>₹{Number(p.value).toLocaleString()}</p>)}
    </div>
  )
}

export function Analytics() {
  const [summary, setSummary] = useState(null)
  const [perVehicle, setPerVehicle] = useState([])

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data))
    api.get('/analytics/vehicles').then(r => setPerVehicle(r.data))
  }, [])

  if (!summary) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: 'var(--text3)' }}>Loading analytics...</p>
    </div>
  )

  const months = {}
  summary.monthly.forEach(m => { months[m.month] = { month: m.month.slice(5), expenses: m.expenses, revenue: 0 } })
  summary.monthlyRev.forEach(m => {
    if (months[m.month]) months[m.month].revenue = m.revenue
    else months[m.month] = { month: m.month.slice(5), expenses: 0, revenue: m.revenue }
  })
  const chartData = Object.values(months).sort((a, b) => a.month.localeCompare(b.month))
  const pieData = summary.byType.map(b => ({ name: b.type, value: b.total }))
  const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Analytics</h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Fleet financial performance</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Revenue', value: fmt(summary.totalRevenue), color: 'var(--green)' },
          { label: 'Total Cost', value: fmt(summary.totalCost), color: 'var(--red)' },
          { label: 'Net Profit', value: fmt(summary.profit), color: summary.profit >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Fleet ROI', value: `${summary.roi}%`, color: 'var(--accent)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', borderTop: `2px solid ${c.color}` }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: c.color, fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Monthly trends</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gRev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e676" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4757" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fill: '#556677', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#556677', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#00e676" strokeWidth={2} fill="url(#gRev2)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#ff4757" strokeWidth={2} fill="url(#gExp2)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Expense split</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text3)', textAlign: 'center', paddingTop: '4rem', fontSize: '0.85rem' }}>No data yet</p>}
        </div>
      </div>

      {/* Vehicle table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vehicle breakdown</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
          {['Vehicle', 'Revenue', 'Expenses', 'Maintenance', 'Total cost', 'Profit'].map(h => (
            <div key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {perVehicle.length === 0
          ? <p style={{ padding: '2rem', color: 'var(--text3)', textAlign: 'center' }}>Add vehicles and log data to see analytics.</p>
          : perVehicle.map((v, i) => (
            <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
            >
              <div style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{v.name}</div>
              <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--green)' }}>₹{Number(v.revenue).toLocaleString()}</div>
              <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--red)' }}>₹{Number(v.expenses).toLocaleString()}</div>
              <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--amber)' }}>₹{Number(v.maintenance).toLocaleString()}</div>
              <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--text2)' }}>₹{Number(v.totalCost).toLocaleString()}</div>
              <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: '0.88rem', fontWeight: 700, color: v.profit >= 0 ? 'var(--green)' : 'var(--red)' }}>₹{Number(v.profit).toLocaleString()}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

// DriverDashboard.jsx

export function DriverDashboard({ user }) {
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
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
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
