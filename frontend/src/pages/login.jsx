import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'driver' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
        onLogin(data.user, data.token)
      } else {
        await api.post('/auth/register', form)
        setMode('login')
        setError('Account created — sign in now.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex',
      background: '#080c10', overflow: 'hidden', position: 'relative'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', position: 'relative'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#080c10" strokeWidth="2.5"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', color: 'var(--text)' }}>FleetX</span>
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Fleet ops,<br />
            <span style={{ color: 'var(--accent)' }}>fully visible.</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '360px' }}>
            Track costs, revenue, maintenance and ROI across your entire fleet — in one place.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '⚡', label: 'Real-time expense tracking' },
              { icon: '📊', label: 'ROI & profit analytics' },
              { icon: '🔧', label: 'Preventive maintenance alerts' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', borderLeft: '1px solid var(--border)'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            {mode === 'login' ? 'Sign in to your FleetX account' : 'Set up your FleetX account'}
          </p>

          {error && (
            <div style={{
              background: error.includes('created') ? 'rgba(0,230,118,0.08)' : 'rgba(255,71,87,0.08)',
              border: `1px solid ${error.includes('created') ? 'rgba(0,230,118,0.2)' : 'rgba(255,71,87,0.2)'}`,
              color: error.includes('created') ? 'var(--green)' : 'var(--red)',
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', marginBottom: '1.25rem'
            }}>{error}</div>
          )}

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {mode === 'register' && (
              <>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input placeholder="Joel Thomas" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem', padding: '0.875rem',
              background: loading ? 'var(--bg4)' : 'var(--accent)',
              color: loading ? 'var(--text2)' : '#080c10',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.01em',
              fontFamily: 'var(--font)'
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text2)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
              {mode === 'login' ? 'Register' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }
const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem' }
