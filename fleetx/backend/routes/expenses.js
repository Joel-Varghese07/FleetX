const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const { vehicle_id, from, to } = req.query;
  let query = `SELECT e.*, v.name as vehicle_name, u.name as driver_name 
               FROM expenses e 
               LEFT JOIN vehicles v ON e.vehicle_id = v.id 
               LEFT JOIN users u ON e.driver_id = u.id WHERE 1=1`;
  const params = [];
  if (vehicle_id) { query += ' AND e.vehicle_id = ?'; params.push(vehicle_id); }
  if (from) { query += ' AND e.date >= ?'; params.push(from); }
  if (to) { query += ' AND e.date <= ?'; params.push(to); }
  if (req.user.role === 'driver') { query += ' AND e.driver_id = ?'; params.push(req.user.id); }
  query += ' ORDER BY e.date DESC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', auth, (req, res) => {
  const { vehicle_id, type, amount, description, date, odometer } = req.body;
  const stmt = db.prepare('INSERT INTO expenses (vehicle_id, driver_id, type, amount, description, date, odometer) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(vehicle_id, req.user.id, type, amount, description, date, odometer);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;