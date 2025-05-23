const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu

// GET semua total telur
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
     SELECT  
  -- Telur Besar
  ISNULL((SELECT SUM(besar) FROM transaksi_telur WHERE tgl <= GETDATE()), 0) -
  ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '11'), 0) AS sisa_besar,

  -- Telur Sedang
  ISNULL((SELECT SUM(sedang) FROM transaksi_telur WHERE tgl <= GETDATE()), 0) -
  ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '12'), 0) AS sisa_sedang,

  -- Telur Kecil
  ISNULL((SELECT SUM(kecil) FROM transaksi_telur WHERE tgl <= GETDATE()), 0) -
  ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '13'), 0) AS sisa_kecil,

  -- Telur Retak
  ISNULL((SELECT SUM(retak) FROM transaksi_telur WHERE tgl <= GETDATE()), 0) -
  ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '14'), 0) AS sisa_retak,

  -- Telur Sekali
  ISNULL((SELECT SUM(sekali) FROM transaksi_telur WHERE tgl <= GETDATE()), 0) -
  ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '15'), 0) AS sisa_sekali

        `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
