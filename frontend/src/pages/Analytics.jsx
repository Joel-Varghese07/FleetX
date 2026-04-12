import { useEffect, useState } from 'react'
import api from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#38bdf8', '#22c55e', '#fb923c', '#a78bfa', '#ef4444', '#fbbf24']

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [perVehicle, setPerVehicle] = useState([])

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data))
    api.get('/analytics/vehicles').then(r => setPerVehicle(r.data))
    api.get('/vehicles').then(r => setVehicles(r.data))
  }, [])

  if (!summary) return <p style={{ color: '#94a3b8' }}>Loading analytics...</p>

  const pieData = summary.byType.map(b => ({ name: b.type, value: b.total }))

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Analytics & ROI</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}`, color: '#22c55e' },
          { label: 'Total Cost', value: `₹${summary.totalCost.toLocaleString()}`, color: '#ef4444' },
          { label: 'Net Profit', value: `₹${summary.profit.toLocaleString()}`, color: summary.profit >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'Fleet ROI', value: `${summary.roi}%`, color: '#38bdf8' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.25rem', color: '#94a3b8', fontSize: '0.75rem' }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#94a3b8' }}>Expense distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#94a3b8' }}>Profit per vehicle</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perVehicle}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Bar dataKey="profit" name="Profit (₹)" radius={[4, 4, 0, 0]}>
                {perVehicle.map((entry, i) => <Cell key={i} fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #334155' }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Vehicle-wise breakdown</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Vehicle', 'Revenue', 'Expenses', 'Maintenance', 'Total Cost', 'Profit'].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {perVehicle.map(v => (
              <tr key={v.id} style={{ borderTop: '1px solid #334155' }}>
                <td style={td}>{v.name}</td>
                <td style={{ ...td, color: '#22c55e' }}>₹{Number(v.revenue).toLocaleString()}</td>
                <td style={{ ...td, color: '#ef4444' }}>₹{Number(v.expenses).toLocaleString()}</td>
                <td style={{ ...td, color: '#fb923c' }}>₹{Number(v.maintenance).toLocaleString()}</td>
                <td style={td}>₹{Number(v.totalCost).toLocaleString()}</td>
                <td style={{ ...td, color: v.profit >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>₹{Number(v.profit).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {perVehicle.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Add vehicles and log data to see analytics.</p>}
      </div>
    </div>
  )
}

const td = { padding: '0.6rem 0.75rem', color: '#f1f5f9' }