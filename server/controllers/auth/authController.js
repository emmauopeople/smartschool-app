const bcrypt = require('bcrypt');
const pool = require('../../db'); // or adjust path as needed

const getIp = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress;

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO loginlog (user_id, username, status, ip_address, timestamp)
        VALUES (NULL, ?, 'fail', ?, NOW())
      `, [username, getIp(req)]);

      return res.status(401).send('Invalid credentials');
    }

    const user = rows[0];

    if (user.status !== 'active') {
      await pool.query(`
        INSERT INTO loginlog (user_id, username, role, status, ip_address, timestamp)
        VALUES (?, ?, ?, 'inactive', ?, NOW())
      `, [user.id, user.username, user.role, getIp(req)]);

      return res.status(403).send('Account inactive');
    }

    if (user.is_locked) {
      await pool.query(`
        INSERT INTO loginlog (user_id, username, role, status, ip_address, timestamp)
        VALUES (?, ?, ?, 'locked', ?, NOW())
      `, [user.id, user.username, user.role, getIp(req)]);

      return res.status(403).send('Account locked');
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      await pool.query(`
        INSERT INTO loginlog (user_id, username, role, status, ip_address, timestamp)
        VALUES (?, ?, ?, 'fail', ?, NOW())
      `, [user.id, user.username, user.role, getIp(req)]);

      return res.status(401).send('Invalid credentials');
    }

    // ✅ SUCCESS: Set session and log
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.username = user.username;

    await pool.query(`
      INSERT INTO loginlog (user_id, username, role, status, ip_address, timestamp)
      VALUES (?, ?, ?, 'success', ?, NOW())
    `, [user.id, user.username, user.role, getIp(req)]);

    // Redirect based on role
    if (user.role === 'top-admin') {
      res.redirect('/top-admin/dashboard');
    } else if (user.role === 'mid-admin') {
      res.redirect('/mid-admin/dashboard');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
