const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // sesuaikan dengan file koneksi kamu 

// GET semua jenis ayam
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { jns, tgl } = req.body;

    const stokAyamResult = await pool.request()
      .input('tgl', sql.DateTime, tgl)
      .query(`
      SELECT  
        ISNULL((SELECT SUM(afkir) FROM transaksi_ayam_end WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JAY' AND jns2 = '11' AND tgl <= @tgl), 0) AS sisa_afkir,
        ISNULL((SELECT SUM(sakit) FROM transaksi_ayam_end WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JAY' AND jns2 = '12' AND tgl <= @tgl), 0) AS sisa_sakit,
        ISNULL((SELECT SUM(mati) FROM transaksi_ayam_end WHERE tgl <= @tgl), 0) -
        ISNULL((SELECT SUM(jmlh) FROM transaksi_jual WHERE flag = 'JAY' AND jns2 = '13' AND tgl <= @tgl), 0) AS sisa_mati
    `);

    const hasiljualayam = await pool.request()
      .input('jns', sql.VarChar, jns)
      .input('tgl', sql.DateTime, tgl)
      .query(`
        SELECT jns2, SUM(jmlh) AS total_jual
        FROM transaksi_jual
        WHERE flag = 'JAY' 
        AND (@jns IS NULL OR @jns = '' OR jns2 = @jns)
        AND tgl <= @tgl
        GROUP BY jns2
      `);

    const pembelianayam = await pool.request()
      .input('tgl', sql.DateTime, tgl)
      .query(`
        SELECT jns, SUM(jmlh) AS totalbeliayam
        FROM transaksi
        WHERE flag = 'PAY' 
        AND tgl <= @tgl
        GROUP BY jns
      `); 

    res.json({
      stokAyamResult: stokAyamResult.recordset[0],
      hasiljualayam: hasiljualayam.recordset,
      pembelianayam: pembelianayam.recordset
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
