import { useEffect, useState } from 'react'
import api from '../api'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const StatCard = ({ label, value, sub, color, delay = 0 }) => (
  <div className={`fade-up`} style={{
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem',
    borderTop: `2px solid ${color}`, animationDelay: `${delay}s`
  }}>
    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
    <p style={{ fontSize: '1.6rem', fontWeight: 800, color, letterSpacing: '-0.02em', fontFamily: 'var(--mono)', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.4rem' }}>{sub}</p>}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
      <p style={{ color: 'var(--text2)', marginBottom: '0.4rem', fontFamily: 'var(--mono)' }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>₹{Number(p.value).toLocaleString()}</p>)}
    </div>
  )
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [upcoming, setUpcoming] = useState([])

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data))
    api.get('/maintenance/upcoming').then(r => setUpcoming(r.data))
  }, [])

  if (!summary) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Loading dashboard...</p>
      </div>
    </div>
  )

  const months = {}
  summary.monthly.forEach(m => { months[m.month] = { month: m.month.slice(5), expenses: m.expenses, revenue: 0 } })
  summary.monthlyRev.forEach(m => {
    if (months[m.month]) months[m.month].revenue = m.revenue
    else months[m.month] = { month: m.month.slice(5), expenses: 0, revenue: m.revenue }
  })
  const chartData = Object.values(months).sort((a, b) => a.month.localeCompare(b.month))

  const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="fade-up">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Fleet performance overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <StatCard label="Total Revenue" value={fmt(summary.totalRevenue)} color="var(--green)" delay={0} />
        <StatCard label="Total Cost" value={fmt(summary.totalCost)} color="var(--red)" delay={0.05} />
        <StatCard label="Net Profit" value={fmt(summary.profit)} color={summary.profit >= 0 ? 'var(--green)' : 'var(--red)'} sub={summary.profit >= 0 ? 'Profitable' : 'Running at a loss'} delay={0.1} />
        <StatCard label="Fleet ROI" value={`${summary.roi}%`} color="var(--accent)" delay={0.15} />
        <StatCard label="Investment" value={fmt(summary.totalInvestment)} color="var(--purple)" delay={0.2} />
        <StatCard label="Maintenance" value={fmt(summary.totalMaintenance)} color="var(--amber)" delay={0.25} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Revenue vs Expenses</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fill: '#556677', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#556677', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--green)" strokeWidth={2} fill="url(#gRev)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="var(--red)" strokeWidth={2} fill="url(#gExp)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>By expense type</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={summary.byType} layout="vertical">
              <XAxis type="number" tick={{ fill: '#556677', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: '#8899aa', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="var(--accent)" radius={[0, 4, 4, 0]} name="Amount" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance alerts */}
      {upcoming.length > 0 && (
        <div style={{ background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.2)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 2s infinite' }} />
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Maintenance due in 30 days</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {upcoming.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.75rem', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)', minWidth: '120px' }}>{m.vehicle_name}</span>
                <span style={{ color: 'var(--text2)', flex: 1 }}>{m.type}</span>
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{m.next_due_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
