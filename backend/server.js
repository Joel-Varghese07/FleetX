const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/revenue', require('./routes/revenue'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FleetX server running on port ${PORT}`));