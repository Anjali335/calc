const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const companyRoutes = require('./routes/companyRoutes');
const clientRoutes = require('./routes/clientRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/company', companyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});