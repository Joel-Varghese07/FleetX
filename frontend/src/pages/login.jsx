import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'driver' })
  const [error, setError] = useState('')

  const handle = async e => {
    e.preventDefault(); setError('')
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
        onLogin(data.user, data.token)
      } else {
        await api.post('/auth/register', form)
        setMode('login'); setError('Account created! Please log in.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', width: '360px', color: '#f1f5f9' }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.8rem', fontWeight: 700, color: '#38bdf8' }}>FleetX</h1>
        <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>Fleet Management System</p>
        {error && <p style={{ background: '#1e3a5f', color: '#7dd3fc', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && <>
            <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inp} />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inp}>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </>}
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inp} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={inp} />
          <button type="submit" style={btn}>{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have one? "}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: '#38bdf8', cursor: 'pointer' }}>
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

const inp = { padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.9rem' }
const btn = { padding: '0.7rem', borderRadius: '8px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }