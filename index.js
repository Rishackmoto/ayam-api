const express = require("express");
const cors = require("cors");
require("dotenv").config()
const { poolPromise } = require("./db");

const authRoutes = require('./routes/auth');

const jenisAyamRoutes = require('./routes/jenisayam'); 
const jenisCitiesRoutes = require('./routes/jeniscities'); 
const jenisGudangRoutes = require('./routes/jenisgudang'); 
const jenisKandangRoutes = require('./routes/jeniskandang'); 
const jenisLainnyaRoutes = require('./routes/jenislainnya'); 
const jenisObatRoutes = require('./routes/jenisobat'); 
const jenisPakanRoutes = require('./routes/jenispakan'); 
const jenisPenyakitRoutes = require('./routes/jenispenyakit'); 
const jenisSalesRoutes = require('./routes/jenissales'); 
const jenisSanitasiRoutes = require('./routes/jenissanitasi'); 
const jenisSatuanRoutes = require('./routes/jenissatuan'); 
const jenisTarifRoutes = require('./routes/jenistarif'); 
const jenisSupplierRoutes = require('./routes/jenissupplier'); 
const jenisPenggunaRoutes = require('./routes/jenispengguna'); 

const app = express();
app.use(cors());
app.use(express.json());
// // Tambahkan route test di sini
// app.get('/', (req, res) => {
//   res.send('API Running');
// });

app.use('/api', authRoutes);
app.use('/jenisayam', jenisAyamRoutes);
app.use('/jeniscities', jenisCitiesRoutes);
app.use('/jenisgudang', jenisGudangRoutes);
app.use('/jeniskandang', jenisKandangRoutes);
app.use('/jenislainnya', jenisLainnyaRoutes);
app.use('/jenispakan', jenisPakanRoutes);
app.use('/jenispenyakit', jenisPenyakitRoutes);
app.use('/jenisobat', jenisObatRoutes);
app.use('/jenissales', jenisSalesRoutes);
app.use('/jenissanitasi', jenisSanitasiRoutes);
app.use('/jenissatuan', jenisSatuanRoutes);
app.use('/jenistarif', jenisTarifRoutes);
app.use('/jenissupplier', jenisSupplierRoutes);
app.use('/jenispengguna', jenisPenggunaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

