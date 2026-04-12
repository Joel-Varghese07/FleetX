import { useEffect, useState } from 'react'
import api from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [upcoming, setUpcoming] = useState([])

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data))
    api.get('/maintenance/upcoming').then(r => setUpcoming(r.data))
  }, [])

  if (!summary) return <p style={{ color: '#94a3b8' }}>Loading...</p>

  const cards = [
    { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}`, color: '#22c55e' },
    { label: 'Total Expenses', value: `₹${summary.totalCost.toLocaleString()}`, color: '#ef4444' },
    { label: 'Net Profit', value: `₹${summary.profit.toLocaleString()}`, color: summary.profit >= 0 ? '#22c55e' : '#ef4444' },
    { label: 'ROI', value: `${summary.roi}%`, color: '#38bdf8' },
    { label: 'Investment', value: `₹${summary.totalInvestment.toLocaleString()}`, color: '#a78bfa' },
    { label: 'Maintenance Cost', value: `₹${summary.totalMaintenance.toLocaleString()}`, color: '#fb923c' },
  ]

  // Merge monthly data
  const months = {}
  summary.monthly.forEach(m => { months[m.month] = { month: m.month, expenses: m.expenses, revenue: 0 } })
  summary.monthlyRev.forEach(m => { if (months[m.month]) months[m.month].revenue = m.revenue; else months[m.month] = { month: m.month, expenses: 0, revenue: m.revenue } })
  const chartData = Object.values(months).sort((a, b) => a.month.localeCompare(b.month))

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', borderLeft: `4px solid ${c.color}` }}>
            <p style={{ margin: '0 0 0.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#94a3b8' }}>Revenue vs Expenses (Monthly)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#94a3b8' }}>Expense Breakdown by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary.byType}>
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Bar dataKey="total" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#fb923c' }}>⚠ Upcoming Maintenance (Next 30 Days)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: '#64748b' }}>
                {['Vehicle', 'Type', 'Due Date', 'Description'].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #334155' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(m => (
                <tr key={m.id}>
                  <td style={td}>{m.vehicle_name}</td>
                  <td style={td}>{m.type}</td>
                  <td style={{ ...td, color: '#fb923c' }}>{m.next_due_date}</td>
                  <td style={td}>{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const td = { padding: '0.6rem 0.5rem', borderBottom: '1px solid #1e293b', color: '#f1f5f9' }