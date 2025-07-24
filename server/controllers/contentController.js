// controllers/contentController.js
const pool = require('../config/db'); // adjust if needed

exports.renderContentPanel = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM content WHERE is_deleted = 0 ORDER BY created_at DESC'
    );
    res.render('dashboards/top-admin', {
      panel: 'content',
      content: rows,
      session: req.session
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading content panel');
  }
};

exports.createContent = async (req, res) => {
  const { title, type, description } = req.body;
  const userId = req.session.userId;

  try {
    await pool.query(
      'INSERT INTO content (title, type, description, status, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, type, description, 'draft', userId]
    );
    res.redirect('/content/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating content');
  }
};

exports.toggleContentStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [[row]] = await pool.query('SELECT status FROM content WHERE id = ?', [id]);

    const newStatus = row.status === 'published' ? 'draft' : 'published';
    await pool.query('UPDATE content SET status = ? WHERE id = ?', [newStatus, id]);

    res.redirect('/content/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error toggling content status');
  }
};

exports.deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('UPDATE content SET is_deleted = 1 WHERE id = ?', [id]);
    res.redirect('/content/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting content');
  }
};

// Optional: Edit stub for future modal or form view
