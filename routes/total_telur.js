// routes/report.js (atau sesuai strukturmu)
const express = require('express');
const router = express.Router();
const db = require('../db'); // koneksi SQL Server

router.get('/total-telur', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        SUM(besar) AS besar,
        SUM(sedang) AS sedang,
        SUM(kecil) AS kecil,
        SUM(retak) AS retak,
        SUM(sekali) AS sekali
      FROM transaksi_telur
      WHERE tgl <= GETDATE()
    `);

    res.json(result.recordset[0]); // kirim hasil dalam JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil laporan telur' });
  }
});

module.exports = router;
