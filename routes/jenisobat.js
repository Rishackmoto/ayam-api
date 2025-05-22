const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu

// GET semua jenis obat
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM jenisobat');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:kode', async (req, res) => {
  const { kode } = req.params;
  const { jenis } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('kode', sql.VarChar, kode)
      .input('jenis', sql.VarChar, jenis)
      .query('UPDATE jenisobat SET jenis = @jenis WHERE kode = @kode');

    res.status(200).json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:kode', async (req, res) => {
  const { kode } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('kode', sql.VarChar, kode)
      .query('DELETE FROM jenisobat WHERE kode = @kode');

    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
