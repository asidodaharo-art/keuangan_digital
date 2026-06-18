/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Instansi {
  pemerintahDaerah: string;
  unitOrganisasi: string;
  nama: string;
  alamat: string;
  email: string;
  telepon: string;
  website: string;
  logoUrl: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'User';
  namaLengkap: string;
  email: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface MasterData {
  id: string;
  kodeRekening: string;
  program: string;
  kegiatan: string;
  subKegiatan: string;
  uraianKegiatan: string;
  pagu: number;
}

export interface SPJRutin {
  id: string;
  nomorSpj: string;
  tanggal: string;
  jenisSpj: 'Belanja Operasi' | 'Belanja Modal';
  namaBarang: string;
  volume: number;
  harga: number;
  total: number;
  keterangan?: string;
  lampiranName?: string;
}

export interface BAPP {
  id: string;
  nomorBAPP: string;
  kontrakId: string;
  terminKe: number;
  nilaiPembayaran: number;
  sisaKontrak: number;
  tanggalBAPP: string;
  potonganUangMuka: number;
}

export interface Kontrak {
  id: string;
  nomorKontrak: string;
  penyedia: string;
  nilaiKontrak: number;
  tanggalKontrak: string;
  uangMuka: number;
  terminList: BAPP[];
  namaKegiatan?: string;
  jangkaWaktu?: string;
  // Dokumen Pelengkap
  noSppbj?: string;
  tglSppbj?: string;
  noSpmk?: string;
  tglSpmk?: string;
  noSpl?: string;
  tglSpl?: string;
  // Rekanan
  rekananNamaPerusahaan?: string;
  rekananNamaPengusaha?: string;
  rekananJabatan?: string;
  rekananAlamat?: string;
  rekananNpwp?: string;
  rekananFakturPajak?: string;
  rekananNoJaminanPelaksanaan?: string;
  rekananTglJaminanPelaksanaan?: string;
  rekananBankNama?: string;
  rekananNoRekening?: string;
  // Pejabat KPA
  kpaNama?: string;
  kpaNip?: string;
  kpaPangkatGolongan?: string;
  kpaJabatan?: string;
  // PPTK
  pptkNama?: string;
  pptkNip?: string;
  pptkPangkatGolongan?: string;
  pptkJabatan?: string;
  // Bendahara
  bendaharaNama?: string;
  bendaharaNip?: string;
  bendaharaPangkatGolongan?: string;
  bendaharaJabatan?: string;
  // Detail Input Uang Muka di Data Pembayaran
  persenUangMuka?: number;
  noPermohonanUm?: string;
  tglPermohonanUm?: string;
  noSuratPptkUm?: string;
  tglSuratPptkUm?: string;
  noKpaUm?: string;
  tglKpaUm?: string;
  noPernyataanRekananUm?: string;
  tglPernyataanRekananUm?: string;
  noPernyataanKpaUm?: string;
  tglPernyataanKpaUm?: string;
  noBaUm?: string;
  tglBaUm?: string;
  noSppUm?: string;
  tglSppUm?: string;
  noJaminanUm?: string;
  tglJaminanUm?: string;
  // Addendum Kontrak
  hasAddendum1?: boolean;
  noAddendum1?: string;
  tglAddendum1?: string;
  nilaiAddendum1?: number;
  hasAddendum2?: boolean;
  noAddendum2?: string;
  tglAddendum2?: string;
  nilaiAddendum2?: number;
  hasAddendum3?: boolean;
  noAddendum3?: string;
  tglAddendum3?: string;
  nilaiAddendum3?: number;
  addendums?: AddendumItem[];
}

export interface AddendumItem {
  id: string;
  isAktif: boolean;
  nama: string; // e.g. "Addendum I", "Addendum II", "Addendum III", "Addendum IV", etc.
  nomor: string;
  tanggal: string;
  nilai: number | '';
  keteranganPerubahan?: string;
}

