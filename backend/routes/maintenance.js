const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const rows = db.prepare(`SELECT m.*, v.name as vehicle_name FROM maintenance m 
    LEFT JOIN vehicles v ON m.vehicle_id = v.id ORDER BY m.date DESC`).all();
  res.json(rows);
});

router.get('/upcoming', auth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const rows = db.prepare(`SELECT m.*, v.name as vehicle_name FROM maintenance m 
    LEFT JOIN vehicles v ON m.vehicle_id = v.id 
    WHERE m.next_due_date BETWEEN ? AND ? ORDER BY m.next_due_date ASC`).all(today, in30);
  res.json(rows);
});

router.post('/', auth, (req, res) => {
  const { vehicle_id, type, description, cost, date, next_due_date, next_due_odometer } = req.body;
  const stmt = db.prepare('INSERT INTO maintenance (vehicle_id, type, description, cost, date, next_due_date, next_due_odometer) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(vehicle_id, type, description, cost || 0, date, next_due_date, next_due_odometer);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

module.exports = router;