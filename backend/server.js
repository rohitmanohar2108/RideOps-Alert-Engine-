require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// simple health check
app.get('/api/health', (req, res) => {
  res.json({status: 'ok'});
});

// TODO: import routes

// connect to Mongo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rideops';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
