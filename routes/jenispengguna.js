const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu

// GET semua jenis pengguna
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM muser');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:kode', async (req, res) => {
  const { noref } = req.params;
  const { userid } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('noref', sql.VarChar, noref)
      .input('userid', sql.VarChar, userid)
      .query('UPDATE muser SET userid = @userid WHERE noref = @noref');

    res.status(200).json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:kode', async (req, res) => {
  const { noref } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('noref', sql.VarChar, noref)
      .query('DELETE FROM muser WHERE noref = @noref');

    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
