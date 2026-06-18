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
}
