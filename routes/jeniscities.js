const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu

// GET semua jenis cities
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM cities');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:kode', async (req, res) => {
  const { city_id } = req.params;
  const { city_name } = req.body;
  
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('city_id', sql.VarChar, kode)
      .input('city_name', sql.VarChar, jenis)
      .query('UPDATE cities SET city_id = @jenis,city_name = @city_name WHERE kode = @city_id');

    res.status(200).json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:kode', async (req, res) => {
  const { city_id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('city_id', sql.VarChar, kode)
      .query('DELETE FROM cities WHERE city_id = @city_id');

    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
