# 🚀 Setup Guide - Progres Tracker

Panduan lengkap step-by-step untuk setup aplikasi dari awal.

## ⚡ Quick Start (5 menit)

```bash
# 1. Install dependencies
npm run install-all

# 2. Setup Supabase (lihat section di bawah)

# 3. Copy .env
cp .env.example .env
# Edit .env dengan kredensial Supabase Anda

# 4. Run application
npm run dev
```

Buka http://localhost:3000 🎉

---

## 📝 Detailed Setup

### Step 1: Setup Supabase Database

#### 1.1 Buat Akun Supabase
1. Kunjungi https://supabase.com
2. Sign up dengan GitHub/Google/Email
3. Klik "New Project"
4. Isi detail project:
   - Name: `progres-tracker`
   - Database Password: (simpan password ini)
   - Region: pilih terdekat dengan lokasi Anda
   - Pricing Plan: Free
5. Tunggu project selesai dibuat (~2 menit)

#### 1.2 Buat Tabel Database
1. Di dashboard Supabase, buka **SQL Editor** (sidebar kiri)
2. Klik **New Query**
3. Copy-paste SQL berikut:

```sql
-- Buat tabel progress
CREATE TABLE progress (
  id BIGSERIAL PRIMARY KEY,
  tanggal DATE NOT NULL,
  catatan TEXT,
  gambar TEXT[],
  dibuat TIMESTAMPTZ DEFAULT NOW(),
  update TIMESTAMPTZ DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_progress_tanggal ON progress(tanggal);

-- Enable Row Level Security (RLS) - opsional untuk produksi
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Policy untuk allow all (karena private app)
CREATE POLICY "Allow all operations" ON progress
FOR ALL
USING (true)
WITH CHECK (true);
```

4. Klik **Run** atau tekan `Ctrl + Enter`
5. Pastikan muncul pesan "Success"

#### 1.3 Dapatkan API Credentials
1. Di dashboard, buka **Settings** > **API**
2. Scroll ke section **Project API keys**
3. Copy 2 nilai ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 2: Setup Backend

#### 2.1 Install Dependencies
```bash
npm install
```

#### 2.2 Configure Environment Variables
1. Buat file `.env` di root folder:
```bash
cp .env.example .env
```

2. Edit `.env` dengan text editor:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=5000
```

3. Ganti dengan nilai yang Anda copy dari Supabase

#### 2.3 Buat Folder Uploads
```bash
mkdir uploads
```

Folder ini akan menyimpan gambar yang diupload.

#### 2.4 Test Backend
```bash
npm run server
```

Jika berhasil, akan muncul:
```
Server running on port 5000
```

Test API dengan browser atau curl:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok","message":"Server is running"}
```

### Step 3: Setup Frontend

#### 3.1 Install Dependencies
```bash
cd client
npm install
cd ..
```

#### 3.2 Test Frontend
```bash
npm run client
```

Browser akan otomatis terbuka di http://localhost:3000

### Step 4: Run Full Application

Stop semua terminal yang running, lalu:

```bash
npm run dev
```

Ini akan menjalankan backend dan frontend bersamaan.

---

## ✅ Verification Checklist

Pastikan semua ini berfungsi:

- [ ] Backend berjalan di http://localhost:5000
- [ ] Frontend berjalan di http://localhost:3000
- [ ] Kalender tampil dengan benar
- [ ] Klik tanggal membuka modal
- [ ] Bisa input catatan dan save
- [ ] Bisa upload gambar (max 5)
- [ ] Hari dengan progres muncul tanda ✓ hijau
- [ ] Bisa edit dan hapus progres
- [ ] Responsive di mobile (coba resize browser)

---

## 🔧 Troubleshooting

### Error: "Missing Supabase credentials"
**Problem**: File `.env` tidak ditemukan atau isinya salah.

**Solution**:
1. Pastikan file `.env` ada di root folder (bukan di folder `client/`)
2. Check isi file dengan text editor
3. Pastikan tidak ada spasi di sekitar `=`
   ```env
   # ❌ SALAH
   SUPABASE_URL = https://xxx.supabase.co
   
   # ✅ BENAR
   SUPABASE_URL=https://xxx.supabase.co
   ```

### Error: "Port 5000 is already in use"
**Problem**: Ada aplikasi lain menggunakan port 5000.

**Solution**:
```bash
# Windows - kill process di port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Atau ubah port di .env
PORT=5001
```

### Error: "Failed to fetch" di browser
**Problem**: Frontend tidak bisa connect ke backend.

**Solution**:
1. Pastikan backend running di terminal
2. Check `client/package.json` ada proxy:
   ```json
   "proxy": "http://localhost:5000"
   ```
3. Restart frontend: `npm run client`

### Gambar tidak muncul
**Problem**: Path gambar salah atau folder uploads tidak ada.

**Solution**:
1. Buat folder uploads:
   ```bash
   mkdir uploads
   ```
2. Check permissions:
   ```bash
   # Linux/Mac
   chmod 755 uploads
   ```
3. Verify di `client/src/components/ProgressModal.js` line 127:
   ```javascript
   src={`http://localhost:5000${imgPath}`}
   ```

### Error: "relation progress does not exist"
**Problem**: Tabel belum dibuat di Supabase.

**Solution**:
1. Login ke Supabase dashboard
2. Buka SQL Editor
3. Jalankan ulang SQL create table (lihat Step 1.2)

### Kalender tidak muncul / blank page
**Problem**: Library FullCalendar belum terinstall.

**Solution**:
```bash
cd client
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
cd ..
npm run client
```

---

## 🎓 Tips untuk Development

### 1. Hot Reload
Frontend sudah auto-reload saat file berubah. Backend perlu restart manual.

Untuk auto-reload backend, install nodemon:
```bash
npm install -g nodemon
nodemon server/index.js
```

### 2. Debug Mode
Tambahkan di `.env`:
```env
NODE_ENV=development
DEBUG=true
```

### 3. Clear Supabase Data
Untuk reset semua data:
```sql
-- Di Supabase SQL Editor
TRUNCATE TABLE progress RESTART IDENTITY CASCADE;
```

### 4. View Server Logs
Backend logs akan muncul di terminal. Frontend logs di browser console (F12).

### 5. Test dengan Sample Data
Buat beberapa progress untuk testing:
```sql
INSERT INTO progress (tanggal, catatan, gambar) VALUES
('2025-11-01', 'Test progress hari pertama', ARRAY[]::TEXT[]),
('2025-11-02', 'Progress kedua dengan gambar', ARRAY['/uploads/test.jpg']::TEXT[]),
('2025-11-03', 'Progress ketiga', ARRAY[]::TEXT[]);
```

---

## 📚 Next Steps

Setelah setup berhasil:

1. ✅ Coba semua fitur (create, edit, delete, upload)
2. 📱 Test di mobile device atau browser mobile mode
3. 🎨 Customize tema/warna sesuai preferensi
4. 🚀 Deploy ke production (Vercel, Netlify, Railway, dll)

---

## 🆘 Masih Ada Masalah?

1. Check semua error messages di terminal dan browser console
2. Verify semua dependencies terinstall dengan `npm list`
3. Restart semua: stop server/client, lalu `npm run dev` lagi
4. Clear browser cache dan reload (Ctrl+Shift+R)

Jika masih error, dokumentasikan:
- Error message lengkap
- Langkah yang dilakukan sebelum error
- Screenshot jika perlu

---

Happy tracking! 📊✨
