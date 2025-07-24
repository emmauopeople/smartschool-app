const express = require('express');
const router = express.Router();
const { requireRole, isAuthenticated } = require('../middleware/roleCheck');

router.get('/top-admin/dashboard', isAuthenticated, requireRole(['top-admin']), (req, res) => {
  res.render('dashboards/top-admin', {
    panel: 'users',
    session: req.session
  });
});

router.get('/top-admin/users', isAuthenticated, requireRole(['top-admin']), (req, res) => {
  res.render('dashboards/top-admin', {
    panel: 'users',
    session: req.session
  });
});

router.get('/top-admin/content', isAuthenticated, requireRole(['top-admin']), (req, res) => {
  res.render('dashboards/top-admin', {
    panel: 'content',
    session: req.session
  });
});
