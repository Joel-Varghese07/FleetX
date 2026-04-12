const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const vehicles = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
  res.json(vehicles);
});

router.post('/', auth, (req, res) => {
  const { name, registration, type, purchase_cost, purchase_date, fuel_type } = req.body;
  const stmt = db.prepare('INSERT INTO vehicles (name, registration, type, purchase_cost, purchase_date, fuel_type) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(name, registration, type, purchase_cost || 0, purchase_date, fuel_type || 'diesel');
  res.json({ id: result.lastInsertRowid, ...req.body });
});

router.put('/:id', auth, (req, res) => {
  const { name, registration, type, status, odometer } = req.body;
  db.prepare('UPDATE vehicles SET name=?, registration=?, type=?, status=?, odometer=? WHERE id=?')
    .run(name, registration, type, status, odometer, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM vehicles WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;