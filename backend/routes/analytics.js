const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/summary', auth, (req, res) => {
  const { from, to, vehicle_id } = req.query;
  let eFilter = 'WHERE 1=1', rFilter = 'WHERE 1=1', mFilter = 'WHERE 1=1';
  const eParams = [], rParams = [], mParams = [];

  if (from) { eFilter += ' AND date >= ?'; eParams.push(from); rFilter += ' AND date >= ?'; rParams.push(from); }
  if (to) { eFilter += ' AND date <= ?'; eParams.push(to); rFilter += ' AND date <= ?'; rParams.push(to); }
  if (vehicle_id) {
    eFilter += ' AND vehicle_id = ?'; eParams.push(vehicle_id);
    rFilter += ' AND vehicle_id = ?'; rParams.push(vehicle_id);
    mFilter += ' AND vehicle_id = ?'; mParams.push(vehicle_id);
  }

  const totalExpenses = db.prepare(`SELECT COALESCE(SUM(amount),0) as total FROM expenses ${eFilter}`).get(...eParams).total;
  const totalRevenue = db.prepare(`SELECT COALESCE(SUM(amount),0) as total FROM revenue ${rFilter}`).get(...rParams).total;
  const totalMaintenance = db.prepare(`SELECT COALESCE(SUM(cost),0) as total FROM maintenance ${mFilter}`).get(...mParams).total;
  const totalInvestment = db.prepare('SELECT COALESCE(SUM(purchase_cost),0) as total FROM vehicles').get().total;

  const totalCost = totalExpenses + totalMaintenance;
  const profit = totalRevenue - totalCost;
  const roi = totalInvestment > 0 ? ((profit / totalInvestment) * 100).toFixed(2) : 0;

  const byType = db.prepare(`SELECT type, SUM(amount) as total FROM expenses ${eFilter} GROUP BY type`).all(...eParams);
  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as expenses
    FROM expenses ${eFilter} GROUP BY month ORDER BY month
  `).all(...eParams);
  const monthlyRev = db.prepare(`
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as revenue
    FROM revenue ${rFilter} GROUP BY month ORDER BY month
  `).all(...rParams);

  res.json({ totalExpenses, totalRevenue, totalMaintenance, totalInvestment, totalCost, profit, roi, byType, monthly, monthlyRev });
});

router.get('/vehicles', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT v.id, v.name, v.registration,
      COALESCE((SELECT SUM(amount) FROM expenses WHERE vehicle_id=v.id),0) as expenses,
      COALESCE((SELECT SUM(amount) FROM revenue WHERE vehicle_id=v.id),0) as revenue,
      COALESCE((SELECT SUM(cost) FROM maintenance WHERE vehicle_id=v.id),0) as maintenance
    FROM vehicles v ORDER BY v.name
  `).all();
  const result = rows.map(r => ({
    ...r,
    totalCost: r.expenses + r.maintenance,
    profit: r.revenue - r.expenses - r.maintenance
  }));
  res.json(result);
});

module.exports = router;