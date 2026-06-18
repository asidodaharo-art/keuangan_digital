# Aplikasi Pembayaran Berita Acara Pembayaran Pekerjaan (BAPP) Digital

Aplikasi Full-Stack ini dirancang khusus untuk mengelola administrasi pembayaran pekerjaan, Surat Pertanggungjawaban (SPJ) rutin, kontrak kerja sama penyedia, termin pembayaran Berita Acara Pembayaran Pekerjaan (BAPP), dan pelaporan anggaran dinas/instansi secara digital, transparan, dan realtime.

Proyek ini memiliki **Dual-Engine Architecture** untuk kebutuhan pengerjaan:
1. **Interactive Client Demo (React 19 + Tailwind CSS + Lucide Icons)**: Digunakan untuk visualisasi purwarupa (prototype) yang responsif dan berjalan sempurna pada pre-visualisasi AI Studio.
2. **Production Package (PHP Native 8.x + MySQL MVC Architecture)**: Paket folder siap pakai untuk diunggah langsung ke GitHub dan dideploy ke web hosting gratis seperti **InfinityFree** atau VPS cPanel Anda.

---

## 📂 Struktur Folder Project

Aplikasi ini disusun rapi mengikuti kaidah MVC (Model-View-Controller) sederhana untuk PHP Native, berdampingan dengan konfigurasi React:

```text
/
├── app/                      <-- [PHP CORE MVC]
│   ├── controllers/          <-- Logika Bisnis & Pengolah Command CRUD
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── MasterController.php
│   │   ├── SpjController.php
│   │   └── BappController.php
│   ├── models/               <-- Query SQL & Relasi Database MySQL
│   │   ├── DB.php
│   │   ├── User.php
│   │   ├── Master.php
│   │   ├── Spj.php
│   │   └── Bapp.php
│   └── views/                <-- Tampilan HTML5, CSS3, & JS Frontend
│       ├── layouts/          <-- Header, Sidebar (Collapse), Footer
│       ├── auth/             <-- Halaman Login Multi-Role & Lupa Pwd
│       ├── dashboard.php     <-- Visualisasi Chart & Ringkasan Anggaran
│       ├── master/           <-- Menu CRUD Popup Master Data
│       ├── spj/              <-- Menu Registrasi SPJ & Preview Cetak
│       └── bapp.php          <-- Formulir BAPP & Riwayat Termin
│
├── assets/                   <-- File Pendukung PHP
│   ├── css/                  <-- Custom Style CSS Theme Biru Cemerlang
│   ├── js/                   <-- Logic AJAX, Chart.js, & DataTables
│   ├── images/               <-- Logo Pemda & Ilustrasi Instansi
│   └── uploads/              <-- Folder Penyimpanan Dokumen Lampiran SPJ
│
├── config/
│   └── database.php          <-- File Konfigurasi Koneksi MySQL PDO
│
├── database/
│   └── database.sql          <-- File Skema DDL & DML Tabel Lengkap
│
├── src/                      <-- [SOURCE CODE CLIENT REACT PREVIEW]
│   ├── components/           <-- Komponen UI Terpisah
│   ├── types.ts              <-- Definisi Type-safety TypeScript
│   └── data.ts               <-- Mock Database State untuk Demo
│
├── .htaccess                 <-- Konfigurasi Pretty URL Routing PHP
├── index.php                 <-- Gerbang Utama (Entry Point) PHP Routing
├── index.html                <-- Entry Point React Client
├── package.json              <-- Library Node untuk Preview React
└── README.md                 <-- Panduan Teknis & Tutorial
```

---

## 🛠️ Cara Menjalankan Versi Preview Terintegrasi (React)

Tampilan interaktif pada simulator ini dijalankan menggunakan Node development server:
```bash
# Mengunduh library
npm install

# Menjalankan local preview port 3000
npm run dev
```

---

## 🚀 PANDUAN DEPLOY KE INFINITYFREE (PHP & MySQL)

InfinityFree adalah layanan web hosting gratis yang sangat cocok untuk mendeploy aplikasi PHP Native 8.x ini tanpa perlu mengeluarkan biaya VPS tambahan.

### Langkah 1: Persiapan Database MySQL pada Panel InfinityFree
1. Daftar atau masuk ke **InfinityFree Client Area**.
2. Buat akun hosting baru (pilih subdomain gratis, misal: `bapp-pupr.infy.uk`).
3. Pada dashboard hosting Anda, tekan tombol **Control Panel** (cPanel).
4. Masuk ke menu **MySQL Databases** di bawah bagian Databases.
5. Buat database baru, contoh: `epiz_xxxxxx_bapp_db`.
6. Simpan detail informasi berikut yang tampil pada layar Anda:
   - **MySQL Hostname** (biasanya format: `sqlXXX.infinityfree.com`)
   - **MySQL Username** (format: `epiz_xxxxxx`)
   - **MySQL Password** (sesuai password cPanel Anda)
   - **Database Name** (contoh: `epiz_xxxxxx_bapp_db`)

### Langkah 2: Import Skema SQL
1. Di cPanel, klik menu **phpMyAdmin** di sebelah database yang baru Anda buat.
2. Pilih tab **Import** di bagian atas menu phpMyAdmin.
3. Klik **Choose File** lalu pilih file sql dari proyek Anda di `/database/database.sql`.
4. Klik tombol **Go** di bagian bawah. Tunggu proses instalasi tabel `users`, `instansi`, `master_data`, `spj`, `kontrak`, dan `bapp` selesai dilakukan.

### Langkah 3: Konfigurasi Koneksi Database PHP
1. Buka file `/config/database.php` melalui file manager lokal Anda.
2. Ubah isian parameter sesuai kredensial database InfinityFree Anda:
   ```php
   define('DB_HOST', 'sqlXXX.infinityfree.com'); // Sesuaikan Hostname Anda
   define('DB_NAME', 'epiz_xxxxxx_bapp_db');      // Name Database Anda
   define('DB_USER', 'epiz_xxxxxx');              // Username Anda
   define('DB_PASS', 'PASSWORD_CPANEL_ANDA');     // Password cPanel
   ```

### Langkah 4: Upload File Code ke InfinityFree via File Manager / FTP
1. Pada cPanel InfinityFree, klik **Online File Manager** (atau gunakan FTP Client seperti FileZilla).
2. Cari folder bernama **`htdocs`**. Folder ini merupakan root direktori publik hosting Anda.
3. Hapus file `index2.html` bawaan default jika ada.
4. Upload seluruh folder dan file PHP berikut dari repo Anda langsung ke dalam folder `htdocs`:
   - Folder `/app`
   - Folder `/assets`
   - Folder `/config`
   - Folder `/database`
   - File `.htaccess`
   - File `index.php`
5. **PENTING**: Pastikan folder `/assets/uploads` memiliki hak izin akses tulis (write permission) agar fitur upload lampiran SPJ tidak error. Pada File Manager online, klik kanan folder `/assets/uploads`, pilih **Chmod**, lalu centang seluruh izin akses atau ubah nilainya menjadi `0777`.

### Langkah 5: Pengujian Login
Aplikasi di web hosting Anda kini telah aktif! Akses di browser sesuai domain Anda.
Masukkan akun default berikut yang tercatat dalam skema database:

* **Role Administrator**:
  * Username: `admin`
  * Password: `password` (Segera ganti pada menu Profil demi keamanan)
* **Role Staff User**:
  * Username: `user`
  * Password: `password`

---

## 📝 Catatan Teknis Integrasi Kop Surat
Data profil instansi (Nama Instansi, No Telp, Email, Alamat, Website, Logo) dikelola secara dinamis di database. Saat diklik cetak pada SPJ atau BAPP, data ini secara otomatis dipanggil untuk diletakkan di dalam Kop Surat. Apabila Anda memodifikasi menu profil instansi di Pengaturan, maka seluruh surat menyurat akan berganti secara otomatis.
