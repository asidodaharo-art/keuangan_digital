/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instansi, User, MasterData, SPJRutin, Kontrak } from './types';

export const defaultInstansi: Instansi = {
  pemerintahDaerah: 'PEMERINTAH PROVINSI DKI JAKARTA',
  unitOrganisasi: 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG',
  nama: 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)',
  alamat: 'Jl. Jenderal Sudirman No. 123, Kompleks Perkantoran Pemerintah, Gedung B',
  email: 'info@pupr-daerah.go.id',
  telepon: '(021) 827-3928 / 0811-2233-4455',
  website: 'www.pupr-daerah.go.id',
  logoUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=150&q=80', // Beautiful modern abstract geometric corporate logo
};

export const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'Admin',
    namaLengkap: 'Muhammad Irfan, S.T., M.Si.',
    email: 'irfan.admin@pupr-daerah.go.id',
    status: 'Aktif',
  },
  {
    id: '2',
    username: 'user',
    role: 'User',
    namaLengkap: 'Soni Setiawan, A.Md.',
    email: 'soni.user@pupr-daerah.go.id',
    status: 'Aktif',
  },
];

export const defaultMasterData: MasterData[] = [
  {
    id: 'M1',
    kodeRekening: '5.1.02.01.01.0024',
    program: 'Program Penyelenggaraan Jalan',
    kegiatan: 'Preservasi Jalan dan Jembatan',
    subKegiatan: 'Rehabilitasi Mayor Jalan Protokol',
    uraianKegiatan: 'Pekerjaan Pengaspalan Aspal Hotmix Jalan Sudirman-Thamrin',
    pagu: 1200000000,
  },
  {
    id: 'M2',
    kodeRekening: '5.1.02.01.01.0025',
    program: 'Program Penyelenggaraan Bangunan Gedung',
    kegiatan: 'Pembangunan Gedung Fasilitas Publik',
    subKegiatan: 'Pembangunan Fisik Puskesmas Pembantu',
    uraianKegiatan: 'Konstruksi Struktur Baja & Arsitektur Puskesmas Mekarsari',
    pagu: 2500000000,
  },
  {
    id: 'M3',
    kodeRekening: '5.1.01.03.01.0001',
    program: 'Program Penunjang Urusan Pemerintahan Daerah',
    kegiatan: 'Penyediaan Jasa Penunjang Administrasi',
    subKegiatan: 'Penyediaan Peralatan dan Perlengkapan Kantor',
    uraianKegiatan: 'Pengadaan ATK Rutin Kantor Dinas PUPR Triwulan I & II',
    pagu: 150000000,
  },
  {
    id: 'M4',
    kodeRekening: '5.1.01.03.01.0002',
    program: 'Program Penunjang Urusan Pemerintahan Daerah',
    kegiatan: 'Pemeliharaan Barang Milik Daerah',
    subKegiatan: 'Penyediaan Jasa Pemeliharaan Kendaraan Dinas',
    uraianKegiatan: 'Pemeliharaan Rutin / SPJ Servis Kendaraan Operasional Lapangan',
    pagu: 85000000,
  },
];

export const defaultSPJRutin: SPJRutin[] = [
  {
    id: 'S1',
    nomorSpj: 'SPJ-2026/06/001',
    tanggal: '2026-06-01',
    jenisSpj: 'Belanja Operasi',
    namaBarang: 'Kertas HVS A4 80gr Sinar Dunia & Tinta Printer HP Epson',
    volume: 65,
    harga: 55000,
    total: 3575000,
    keterangan: 'Pembelian logistik penunjang administrasi SPJ Rutin dinas',
    lampiranName: 'surat_bukti_nota_atkrutin.pdf',
  },
  {
    id: 'S2',
    nomorSpj: 'SPJ-2026/06/002',
    tanggal: '2026-06-10',
    jenisSpj: 'Belanja Operasi',
    namaBarang: 'Penyediaan Logistik Konsumsi Rapat Koordinasi Terpadu Dinas',
    volume: 120,
    harga: 35000,
    total: 4200000,
    keterangan: 'Konsumsi untuk rapat bulanan realisasi anggaran triwulan II',
    lampiranName: 'invoice_katering_mamacantik.pdf',
  },
  {
    id: 'S3',
    nomorSpj: 'SPJ-2026/06/003',
    tanggal: '2026-06-15',
    jenisSpj: 'Belanja Modal',
    namaBarang: 'Pembelian AC Split 1.5 PK Daikin untuk Ruang Pelayanan',
    volume: 2,
    harga: 4800000,
    total: 9600000,
    keterangan: 'Belanja peralatan pendingin ruangan pelayanan demi kenyamanan publik',
    lampiranName: 'faktur_pembelian_daikin_service.pdf',
  },
];

export const defaultKontrak: Kontrak[] = [
  {
    id: 'K1',
    nomorKontrak: '602/092/PUPR/KTR-JALAN/2026',
    penyedia: 'PT Wijaya Konstruksi Pratama',
    nilaiKontrak: 1200000000,
    tanggalKontrak: '2026-05-15',
    uangMuka: 240000000,
    terminList: [
      {
        id: 'B1',
        nomorBAPP: '001/PUPR/BAPP-TERM1/2026',
        kontrakId: 'K1',
        terminKe: 1,
        nilaiPembayaran: 360000000,
        sisaKontrak: 840000000,
        tanggalBAPP: '2026-06-12',
        potonganUangMuka: 72000000,
      }
    ]
  },
  {
    id: 'K2',
    nomorKontrak: '602/105/PUPR/KTR-BANGUNAN/2026',
    penyedia: 'CV Megah Mulia Nusantara',
    nilaiKontrak: 2500000000,
    tanggalKontrak: '2026-05-20',
    uangMuka: 500000000,
    terminList: []
  }
];
