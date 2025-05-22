const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post('/api/login', async (req, res) => {
  try {
    const { userid, pass } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('userid', sql.VarChar, userid)
      .input('pass', sql.VarChar, pass)
      .query(`SELECT * FROM muser WHERE userid = @userid AND pass = @pass`);

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.json({ success: false, message: 'Username atau password salah' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
