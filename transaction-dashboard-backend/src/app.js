const express = require('express');
const cors = require("cors")
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactionsRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*"
}));
// Routes
app.use('/api/transactions', transactionRoutes);

module.exports = app;
