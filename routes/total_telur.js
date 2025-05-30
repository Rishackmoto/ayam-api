const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu 

// GET semua jenis telur
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { jns, tgl } = req.body;

    const stokResult = await pool.request()
      .input('tgl', sql.DateTime, tgl)
      .query(`
      SELECT  
        ISNULL((SELECT SUM(besar) FROM transaksi_telur WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '11' and tgl <= @tgl), 0) AS sisa_besar,
        ISNULL((SELECT SUM(sedang) FROM transaksi_telur WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '12' and tgl <= @tgl), 0) AS sisa_sedang,
        ISNULL((SELECT SUM(kecil) FROM transaksi_telur WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '13' and tgl <= @tgl), 0) AS sisa_kecil,
        ISNULL((SELECT SUM(retak) FROM transaksi_telur WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '14' and tgl <= @tgl), 0) AS sisa_retak,
        ISNULL((SELECT SUM(sekali) FROM transaksi_telur WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JTL' AND jns = '15' and tgl <= @tgl), 0) AS sisa_sekali
    `);

    const hasiljualtelur = await pool.request()
      .input('jns', sql.VarChar, jns)
      .input('tgl', sql.DateTime, tgl)
      .query(`
        SELECT jns, SUM(jmlh) AS total_jual
        FROM transaksi_jual
        WHERE flag = 'JTL' 
        AND (@jns IS NULL OR jns = @jns)
        AND tgl <= @tgl
        GROUP BY jns
      `);

   const ambiltelur = await pool.request()
      .input('tgl', sql.DateTime, tgl)
      .query(`
      SELECT  
        ISNULL((SELECT SUM(besar) FROM transaksi_telur WHERE tgl <= @tgl), 0) AS ambilbesar,
        ISNULL((SELECT SUM(sedang) FROM transaksi_telur WHERE tgl <= @tgl), 0) AS ambilsedang,
        ISNULL((SELECT SUM(kecil) FROM transaksi_telur WHERE tgl <= @tgl), 0) AS ambilkecil,
        ISNULL((SELECT SUM(retak) FROM transaksi_telur WHERE tgl <= @tgl), 0) AS ambilretak,
        ISNULL((SELECT SUM(sekali) FROM transaksi_telur WHERE tgl <= @tgl), 0) AS ambilsekali
    `);

    res.json({
      stok_telur: stokResult.recordset[0],
      hasiljualtelur: hasiljualtelur.recordset,  
      ambiltelur: ambiltelur.recordset[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
