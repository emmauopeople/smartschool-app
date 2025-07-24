exports.renderManagePanel = async (req, res) => {
  const users = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  res.render('partials/manage-users-panel', { users });
};

exports.registerUser = async (req, res) => { /* insert new user */ };
exports.editUser = async (req, res) => { /* update fields */ };
exports.toggleUserStatus = async (req, res) => { /* flip status */ };
exports.getAllUsers = async (req, res) => { /* for AJAX reload */ };


const bcrypt = require('bcrypt');

exports.renderManagePanel = async (req, res) => {
  const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  res.render('partials/manage-users-panel', { users });
};

exports.registerUser = async (req, res) => {
  const { username, password, role, first_name, last_name, email, phone } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, "active")',
    [username, hashed, role, first_name, last_name, email, phone]);
  res.redirect('/users/manage');
};

exports.toggleUserStatus = async (req, res) => {
  const userId = req.params.id;
  await pool.query('UPDATE users SET status = IF(status = "active", "inactive", "active") WHERE id = ?', [userId]);
  res.redirect('/users/manage');
};
