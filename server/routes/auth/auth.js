const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

// POST: handle login form submission
router.post('/login', authController.loginUser);
