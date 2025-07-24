const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleCheck');
const usersController = require('../controllers/users');

// Panel UI
router.get('/manage', requireRole(['top-admin', 'mid-admin']), usersController.renderManagePanel);

// Actions
router.post('/register', requireRole(['top-admin', 'mid-admin']), usersController.registerUser);
router.put('/:id/edit', requireRole(['top-admin', 'mid-admin']), usersController.editUser);
router.patch('/:id/status', requireRole(['top-admin', 'mid-admin']), usersController.toggleUserStatus);
router.get('/', requireRole(['top-admin', 'mid-admin']), usersController.getAllUsers);
