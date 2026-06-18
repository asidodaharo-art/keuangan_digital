-- =====================================================================
-- SKEMA SQL DATABASE APLIKASI BAPP DIGITAL (MYSQL / MARIADB COMPATIBLE)
-- =====================================================================
-- Direkomendasikan untuk deployment di localhost (XAMPP) maupun InfinityFree.
-- 

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `bapp`;
DROP TABLE IF EXISTS `kontrak`;
DROP TABLE IF EXISTS `spj`;
DROP TABLE IF EXISTS `master_data`;
DROP TABLE IF EXISTS `instansi`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. TABEL USERS (Autentikasi Multi-Role & Kelola User)
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
  `status` ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default users (password default: 'password' dihash menggunakan bcrypt)
INSERT INTO `users` (`id`, `username`, `password`, `nama_lengkap`, `email`, `role`, `status`) VALUES
(1, 'admin', '$2y$10$7zqy47eBNo.n6Psk9T7XEu7Q3MvN.uJby.9/jC16L8cW7/3Vpxq7O', 'Muhammad Irfan, S.T., M.Si.', 'irfan.admin@pupr-daerah.go.id', 'Admin', 'Aktif'),
(2, 'user', '$2y$10$7zqy47eBNo.n6Psk9T7XEu7Q3MvN.uJby.9/jC16L8cW7/3Vpxq7O', 'Soni Setiawan, A.Md.', 'soni.user@pupr-daerah.go.id', 'User', 'Aktif');


-- ---------------------------------------------------------------------
-- 2. TABEL INSTANSI (Konfigurasi Profil & Kop Surat Klerikal)
-- ---------------------------------------------------------------------
CREATE TABLE `instansi` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `pemerintah_daerah` VARCHAR(150) DEFAULT NULL,
  `unit_organisasi` VARCHAR(150) DEFAULT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `alamat` TEXT NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `telepon` VARCHAR(50) DEFAULT NULL,
  `website` VARCHAR(100) DEFAULT NULL,
  `logo_url` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default instansi profile (hanya 1 baris record yang di-update)
INSERT INTO `instansi` (`id`, `pemerintah_daerah`, `unit_organisasi`, `nama`, `alamat`, `email`, `telepon`, `website`, `logo_url`) VALUES
(1, 'PEMERINTAH PROVINSI DKI JAKARTA', 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG', 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)', 'Jl. Jenderal Sudirman No. 123, Kompleks Perkantoran Pemerintah, Gedung B', 'info@pupr-daerah.go.id', '(021) 827-3928', 'www.pupr-daerah.go.id', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=150&q=80');


-- ---------------------------------------------------------------------
-- 3. TABEL MASTER_DATA (Kode Rekening / RKA Pagu Belanja)
-- ---------------------------------------------------------------------
CREATE TABLE `master_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_rekening` VARCHAR(50) NOT NULL UNIQUE,
  `program` VARCHAR(255) NOT NULL,
  `kegiatan` VARCHAR(255) DEFAULT NULL,
  `sub_kegiatan` VARCHAR(255) NOT NULL,
  `uraian_kegiatan` TEXT DEFAULT NULL,
  `pagu` BIGINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed master data pagu anggaran
INSERT INTO `master_data` (`id`, `kode_rekening`, `program`, `kegiatan`, `sub_kegiatan`, `uraian_kegiatan`, `pagu`) VALUES
(1, '5.1.02.01.01.0024', 'Program Penyelenggaraan Jalan', 'Preservasi Jalan dan Jembatan', 'Rehabilitasi Mayor Jalan Protokol', 'Pekerjaan Pengaspalan Aspal Hotmix Jalan Sudirman-Thamrin', 1200000000),
(2, '5.1.02.01.01.0025', 'Program Penyelenggaraan Bangunan Gedung', 'Pembangunan Gedung Fasilitas Publik', 'Pembangunan Fisik Puskesmas Pembantu', 'Konstruksi Struktur Baja & Arsitektur Puskesmas Mekarsari', 2500000000),
(3, '5.1.01.03.01.0001', 'Program Penunjang Urusan Pemerintahan Daerah', 'Penyediaan Jasa Penunjang Administrasi', 'Penyediaan Peralatan dan Perlengkapan Kantor', 'Pengadaan ATK Rutin Kantor Dinas PUPR Triwulan I & II', 150000000),
(4, '5.1.01.03.01.0002', 'Program Penunjang Urusan Pemerintahan Daerah', 'Pemeliharaan Barang Milik Daerah', 'Penyediaan Jasa Pemeliharaan Kendaraan Dinas', 'Pemeliharaan Rutin / SPJ Servis Kendaraan Operasional Lapangan', 85000000);


-- ---------------------------------------------------------------------
-- 4. TABEL SPJ_RUTIN (Surat Pertanggungjawaban Bulanan Operasional)
-- ---------------------------------------------------------------------
CREATE TABLE `spj` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nomor_spj` VARCHAR(100) NOT NULL UNIQUE,
  `tanggal` DATE NOT NULL,
  `jenis_spj` ENUM('Belanja Operasi', 'Belanja Modal') NOT NULL DEFAULT 'Belanja Operasi',
  `nama_barang` VARCHAR(255) NOT NULL,
  `volume` INT NOT NULL DEFAULT 1,
  `harga` INT NOT NULL DEFAULT 0,
  `total` BIGINT NOT NULL DEFAULT 0,
  `keterangan` TEXT DEFAULT NULL,
  `lampiran_name` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default SPJ rutin
INSERT INTO `spj` (`id`, `nomor_spj`, `tanggal`, `jenis_spj`, `nama_barang`, `volume`, `harga`, `total`, `keterangan`, `lampiran_name`) VALUES
(1, 'SPJ-2026/06/001', '2026-06-01', 'Belanja Operasi', 'Kertas HVS A4 80gr Sinar Dunia & Tinta Printer HP Epson', 65, 55000, 3575000, 'Pembelian logistik penunjang administrasi SPJ Rutin dinas', 'surat_bukti_nota_atkrutin.pdf'),
(2, 'SPJ-2026/06/002', '2026-06-10', 'Belanja Operasi', 'Penyediaan Logistik Konsumsi Rapat Koordinasi Terpadu Dinas', 120, 35000, 4200000, 'Konsumsi untuk rapat bulanan realisasi anggaran triwulan II', 'invoice_katering_mamacantik.pdf'),
(3, 'SPJ-2026/06/003', '2026-06-15', 'Belanja Modal', 'Pembelian AC Split 1.5 PK Daikin untuk Ruang Pelayanan', 2, 4800000, 9600000, 'Belanja peralatan pendingin ruangan pelayanan demi kenyamanan publik', 'faktur_pembelian_daikin_service.pdf');


-- ---------------------------------------------------------------------
-- 5. TABEL KONTRAK (Registrasi Kontrak Penyedia)
-- ---------------------------------------------------------------------
CREATE TABLE `kontrak` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nomor_kontrak` VARCHAR(100) NOT NULL UNIQUE,
  `penyedia` VARCHAR(150) NOT NULL,
  `nilai_kontrak` BIGINT NOT NULL,
  `tanggal_kontrak` DATE NOT NULL,
  `uang_muka` BIGINT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default kontrak
INSERT INTO `kontrak` (`id`, `nomor_kontrak`, `penyedia`, `nilai_kontrak`, `tanggal_kontrak`, `uang_muka`) VALUES
(1, '602/092/PUPR/KTR-JALAN/2026', 'PT Wijaya Konstruksi Pratama', 1200000000, '2026-05-15', 240000000),
(2, '602/105/PUPR/KTR-BANGUNAN/2026', 'CV Megah Mulia Nusantara', 2500000000, '2026-05-20', 500000000);


-- ---------------------------------------------------------------------
-- 6. TABEL BAPP (Berita Acara Pembayaran Pekerjaan per Termin)
-- ---------------------------------------------------------------------
CREATE TABLE `bapp` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nomor_bapp` VARCHAR(100) NOT NULL UNIQUE,
  `kontrak_id` INT NOT NULL,
  `termin_ke` INT NOT NULL DEFAULT 1,
  `nilai_pembayaran` BIGINT NOT NULL,
  `sisa_kontrak` BIGINT NOT NULL,
  `tanggal_bapp` DATE NOT NULL,
  `potongan_uang_muka` BIGINT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bapp_kontrak` FOREIGN KEY (`kontrak_id`) REFERENCES `kontrak` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default termin BAPP
INSERT INTO `bapp` (`id`, `nomor_bapp`, `kontrak_id`, `termin_ke`, `nilai_pembayaran`, `sisa_kontrak`, `tanggal_bapp`, `potongan_uang_muka`) VALUES
(1, '001/PUPR/BAPP-TERM1/2026', 1, 1, 360000000, 840000000, '2026-06-12', 72000000);
