// routes/content.js
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { requireRole, isAuthenticated } = require('../middleware/roleCheck');

console.log(typeof contentController.renderContentPanel); // should log 'function'

// Panel view for content management
router.get('/manage', isAuthenticated, requireRole(['top-admin', 'mid-admin']), contentController.renderContentPanel);

// Handle content creation (from modal)
router.post('/create', isAuthenticated, requireRole(['top-admin', 'mid-admin']), contentController.createContent);

// Toggle published/draft status
router.post('/:id/toggle', isAuthenticated, requireRole(['top-admin', 'mid-admin']), contentController.toggleContentStatus);

// Soft delete content
router.post('/:id/delete', isAuthenticated, requireRole(['top-admin', 'mid-admin']), contentController.deleteContent);

// Optional: Load edit form (can convert to modal later)
router.get('/:id/edit', isAuthenticated, requireRole(['top-admin', 'mid-admin']), contentController.renderEditForm);

module.exports = router;
