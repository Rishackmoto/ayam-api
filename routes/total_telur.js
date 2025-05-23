const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu

// GET semua total telur
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
        SUM(besar) AS besar,
        SUM(sedang) AS sedang,
        SUM(kecil) AS kecil,
        SUM(retak) AS retak,
        SUM(sekali) AS sekali
        FROM transaksi_telur
        WHERE tgl <= GETDATE()
        `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
