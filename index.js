const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { poolPromise } = require("./db");

// 🔍 Log environment variable untuk debugging
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'Not Set');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('API_BASE_URL:', process.env.API_BASE_URL);

// 📦 Import semua route
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
const totalstoktelur = require('./routes/total_telur'); 
const totalstokayam = require('./routes/total_ayam'); 

const app = express();

// ✅ Setup CORS yang benar
const allowedOrigins = [
  "https://ayam-api.up.railway.app",
  "https://ayam-api-nine.vercel.app",
  "https://app.rishackmoto.com",
  "http://localhost:3000",
  "http://localhost:1234", // misal pakai Parcel
  "http://localhost:5173", // misal pakai Vite
  "http://localhost:4200", // misal pakai Angular
  "http://localhost:8080" 
  ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// 🔁 Redirect vercel default domain ke custom domain (opsional)
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host === 'ayam-api-nine.vercel.app') {
    return res.redirect(301, `https://app.rishackmoto.com${req.url}`);
  }
  next();
});

// 📌 Pasang semua route ke app
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
app.use('/total_telur', totalstoktelur);
app.use('/total_ayam', totalstokayam);

// 🚀 Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
