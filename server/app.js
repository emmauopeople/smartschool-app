// app.js
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const pool = require('./config/db'); // your DB pool

// Test DB connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ DB Connection Failed:', err);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'smartschool_secret', // Change to env variable in production
  resave: false,
  saveUninitialized: false,
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (e.g., CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static(path.join(__dirname, 'assets')));

// Mount routes
const contentRoutes = require('./routes/content');
const authRoutes = require('./routes/auth/auth');
const dashboardRoutes = require('./routes/dashboard');

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/', dashboardRoutes); // Catch-all for dashboard routes

// Default fallback route
app.get('/', (req, res) => {
  res.redirect('/auth/login'); // Or homepage if needed
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 SmartSchool server running on http://localhost:${PORT}`);
});
