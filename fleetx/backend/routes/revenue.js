const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const rows = db.prepare(`SELECT r.*, v.name as vehicle_name, u.name as driver_name 
    FROM revenue r LEFT JOIN vehicles v ON r.vehicle_id = v.id 
    LEFT JOIN users u ON r.driver_id = u.id ORDER BY r.date DESC`).all();
  res.json(rows);
});

router.post('/', auth, (req, res) => {
  const { vehicle_id, amount, description, date, trip_distance } = req.body;
  const stmt = db.prepare('INSERT INTO revenue (vehicle_id, driver_id, amount, description, date, trip_distance) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(vehicle_id, req.user.id, amount, description, date, trip_distance);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

module.exports = router;