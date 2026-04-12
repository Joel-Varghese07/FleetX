import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', roles: ['admin', 'driver'] },
  { path: '/expenses', label: 'Expenses', roles: ['admin', 'driver'] },
  { path: '/revenue', label: 'Revenue', roles: ['admin', 'driver'] },
  { path: '/vehicles', label: 'Vehicles', roles: ['admin'] },
  { path: '/maintenance', label: 'Maintenance', roles: ['admin'] },
  { path: '/analytics', label: 'Analytics', roles: ['admin'] },
]

export default function Layout({ children, user, onLogout }) {
  const loc = useLocation()
  const items = navItems.filter(n => n.roles.includes(user.role))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      <aside style={{ width: '220px', background: '#1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#38bdf8', margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700 }}>FleetX</h2>
        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 2rem' }}>{user.role.toUpperCase()}</p>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {items.map(n => (
            <Link key={n.path} to={n.path} style={{
              padding: '0.6rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
              color: loc.pathname === n.path ? '#38bdf8' : '#94a3b8',
              background: loc.pathname === n.path ? '#0c1f35' : 'transparent',
              fontWeight: loc.pathname === n.path ? 600 : 400, fontSize: '0.9rem'
            }}>{n.label}</Link>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#64748b' }}>{user.name}</p>
          <button onClick={onLogout} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
    </div>
  )
}