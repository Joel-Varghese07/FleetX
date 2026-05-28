import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DriverDashboard from './pages/DriverDashboard'
import Vehicles from './pages/Vehicles'
import Expenses from './pages/Expenses'
import Maintenance from './pages/Maintenance'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fleetx_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData, token) => {
    localStorage.setItem('fleetx_user', JSON.stringify(userData))
    localStorage.setItem('fleetx_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('fleetx_user')
    localStorage.removeItem('fleetx_token')
    setUser(null)
  }

  if (!user) return <Login onLogin={login} />

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={user.role === 'admin' ? <AdminDashboard /> : <DriverDashboard user={user} />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/expenses" element={<Expenses user={user} />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/revenue" element={<Revenue user={user} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
