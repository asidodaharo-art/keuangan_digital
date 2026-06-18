/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Printer, FileText, Upload, X, Check, Eye } from 'lucide-react';
import { SPJRutin, Instansi } from '../types';

interface SPJRutinPageProps {
  spjList: SPJRutin[];
  instansiField: Instansi;
  onAdd: (newData: Omit<SPJRutin, 'id'>) => void;
  onEdit: (updatedData: SPJRutin) => void;
  onDelete: (id: string) => void;
  currentUserRole: 'Admin' | 'User';
}

export default function SPJRutinPage({
  spjList,
  instansiField,
  onAdd,
  onEdit,
  onDelete,
  currentUserRole
}: SPJRutinPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SPJRutin | null>(null);
  const [printPreviewItem, setPrintPreviewItem] = useState<SPJRutin | null>(null);

  // Form states
  const [formNomor, setFormNomor] = useState('');
  const [formTanggal, setFormTanggal] = useState('');
  const [formJenis, setFormJenis] = useState<'Belanja Operasi' | 'Belanja Modal'>('Belanja Operasi');
  const [formBarang, setFormBarang] = useState('');
  const [formVolume, setFormVolume] = useState<number | ''>('');
  const [formHarga, setFormHarga] = useState<number | ''>('');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [formLampiran, setFormLampiran] = useState('surat_bukti_nota.pdf');

  // Reset form helper
  const resetForm = () => {
    setFormNomor('');
    setFormTanggal(new Date().toISOString().substring(0, 10));
    setFormJenis('Belanja Operasi');
    setFormBarang('');
    setFormVolume('');
    setFormHarga('');
    setFormKeterangan('');
    setFormLampiran('surat_bukti_nota.pdf');
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: SPJRutin) => {
    setEditingItem(item);
    setFormNomor(item.nomorSpj);
    setFormTanggal(item.tanggal);
    setFormJenis(item.jenisSpj);
    setFormBarang(item.namaBarang);
    setFormVolume(item.volume);
    setFormHarga(item.harga);
    setFormKeterangan(item.keterangan || '');
    setFormLampiran(item.lampiranName || 'surat_bukti_nota.pdf');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomor || !formTanggal || !formBarang || !formVolume || !formHarga) {
      alert('Mohon lengkapi seluruh field wajib (*)');
      return;
    }

    const calculatedTotal = Number(formVolume) * Number(formHarga);

    if (editingItem) {
      onEdit({
        id: editingItem.id,
        nomorSpj: formNomor,
        tanggal: formTanggal,
        jenisSpj: formJenis,
        namaBarang: formBarang,
        volume: Number(formVolume),
        harga: Number(formHarga),
        total: calculatedTotal,
        keterangan: formKeterangan,
        lampiranName: formLampiran,
      });
    } else {
      onAdd({
        nomorSpj: formNomor,
        tanggal: formTanggal,
        jenisSpj: formJenis,
        namaBarang: formBarang,
        volume: Number(formVolume),
        harga: Number(formHarga),
        total: calculatedTotal,
        keterangan: formKeterangan,
        lampiranName: formLampiran,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, nomor: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen SPJ ${nomor}?`)) {
      onDelete(id);
    }
  };

  // Printing/PDF simulation dialog trigger
  const handlePrint = (item: SPJRutin) => {
    setPrintPreviewItem(item);
  };

  // Filter and search
  const filteredSPJ = spjList.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.nomorSpj.toLowerCase().includes(q) ||
      item.jenisSpj.toLowerCase().includes(q) ||
      item.namaBarang.toLowerCase().includes(q) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(q))
    );
  });

  const totalEntries = filteredSPJ.length;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredSPJ.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Simulated browser print trigger
  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div id="spj-page-root" className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Surat Pertanggungjawaban (SPJ) Rutin Dinas
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Daftar logistik belanja rutin operasional, bahan pakai habis, dan servis peralatan.</p>
        </div>

        <button
          id="btn-add-spj"
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm self-end md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Input SPJ Baru
        </button>
      </div>

      {/* Main content table */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row justify-between gap-3 items-center">
          <div className="flex items-center gap-2 w-full md:max-w-xs">
            <label className="text-xs text-neutral-500 font-bold shrink-0">Tampilkan:</label>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs border border-neutral-300 rounded px-2 py-1 bg-white outline-none"
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
            </select>
          </div>

          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari SPJ, Jenis belanja, atau nama barang..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-4 py-2 border border-neutral-300 rounded-xl focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Table data structure */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 text-left">
            <thead className="bg-neutral-50">
              <tr className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold border-b border-neutral-200">
                <th className="px-5 py-3">Nomor SPJ / Tanggal</th>
                <th className="px-5 py-3">Jenis Belanja</th>
                <th className="px-5 py-3">Nama Rincian Barang</th>
                <th className="px-5 py-3 text-center">Volume</th>
                <th className="px-5 py-3">Harga Satuan</th>
                <th className="px-5 py-3">Total Nominal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {currentEntries.length > 0 ? (
                currentEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-neutral-800 block">{row.nomorSpj}</span>
                      <span className="text-[10px] text-neutral-500">{row.tanggal}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg font-mono ${
                        row.jenisSpj === 'Belanja Operasi' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {row.jenisSpj}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-semibold text-neutral-900 leading-normal mb-1">{row.namaBarang}</div>
                      {row.keterangan && <p className="text-[10px] text-neutral-500 italic block">{row.keterangan}</p>}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-neutral-700">{row.volume}</td>
                    <td className="px-5 py-4 font-mono text-neutral-600">{formatRupiah(row.harga)}</td>
                    <td className="px-5 py-4 font-bold text-neutral-900">{formatRupiah(row.total)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-print-${row.id}`}
                          onClick={() => handlePrint(row)}
                          className="p-1 px-2.5 py-1.5 border border-blue-200 hover:bg-blue-50 text-blue-700 rounded-md transition-colors flex items-center gap-1"
                          title="Cetak Surat Lembar Dokumen"
                        >
                          <Printer className="w-3.5 h-3.5" /> Cetak
                        </button>
                        <button
                          id={`btn-edit-${row.id}`}
                          onClick={() => openEditModal(row)}
                          className="p-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md transition-colors flex items-center gap-1"
                          title="Ubah data log"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        {currentUserRole === 'Admin' && (
                          <button
                            id={`btn-delete-${row.id}`}
                            onClick={() => handleDelete(row.id, row.nomorSpj)}
                            className="p-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors flex items-center gap-1"
                            title="Hapus SPJ"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-400 font-medium">
                    Tidak ditemukan data SPJ rutin yang tersimpan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500 font-semibold shadow-xs">
            <span>
              Menampilkan {indexOfFirstEntry + 1} s.d. {Math.min(indexOfLastEntry, totalEntries)} dari {totalEntries} SPJ
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 border border-neutral-300 rounded-md bg-white hover:bg-neutral-50 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-md border font-bold ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 border border-neutral-300 rounded-md bg-white hover:bg-neutral-50 disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INPUT / EDIT SPJ MODEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full z-10 overflow-hidden animate-fade-in font-sans">
            <div className="bg-blue-600 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-tight text-sm uppercase">
                {editingItem ? 'Edit Dokumen SPJ Rutin' : 'Input Surat Pertanggungjawaban Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Nomor SPJ */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nomor SPJ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SPJ-2026/06/007"
                    value={formNomor}
                    onChange={(e) => setFormNomor(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Tanggal Dokumen *</label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Jenis Belanja */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Jenis SPJ Rutin *</label>
                  <select
                    value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Belanja Operasi">Belanja Operasi (ATK/Konsumsi)</option>
                    <option value="Belanja Modal">Belanja Modal (Alat/Fisik)</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nama Barang / Deskripsi Logistik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pengadaan Kertas Rim A4 80gram Sinar Dunia"
                    value={formBarang}
                    onChange={(e) => setFormBarang(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Volume */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Volume / Jumlah *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 50"
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Harga Satuan */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Harga Satuan Rupiah *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 45000"
                    value={formHarga}
                    onChange={(e) => setFormHarga(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Calculated Total indicator */}
                <div className="col-span-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-500 text-[10px] uppercase">Kumulatif Total Otomatis:</span>
                  <strong className="text-sm font-black text-blue-800">
                    {Number(formVolume) && Number(formHarga) 
                      ? formatRupiah(Number(formVolume) * Number(formHarga)) 
                      : 'Rp 0'}
                  </strong>
                </div>

                {/* Keterangan */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Keterangan Tambahan / Catatan kaki</label>
                  <textarea
                    rows={2}
                    placeholder="Catatan tambahan keperluan pengeluaran..."
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Upload attachment Simulator */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Simulasi Upload Lampiran File PDF/Nota *</label>
                  <div className="border border-dashed border-neutral-300 rounded-lg p-3 text-center bg-neutral-50 hover:bg-neutral-100/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormLampiran(e.target.files[0].name);
                          alert(`Simulasi: Berhasil merekam file "${e.target.files[0].name}"`);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-neutral-600 block">Klik atau Seret file nota belanja ke sini</span>
                    {formLampiran && (
                      <span className="text-[10px] text-blue-600 font-mono font-black mt-1 block">
                        Terpilih: {formLampiran}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Simpan SPJ Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL / GENERATE PDF SIMULATOR */}
      {printPreviewItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setPrintPreviewItem(null)} />
          
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-3xl w-full z-10 my-8 overflow-hidden flex flex-col animate-scale-up font-sans">
            {/* Header control */}
            <div className="bg-neutral-950 px-5 py-3.5 flex justify-between items-center text-white shrink-0">
              <span className="text-xs font-bold font-mono text-black uppercase tracking-widest">Lembar Cetak Cetakan PDF SPJ Administrasi</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerNativePrint}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Jendela Print / PDF
                </button>
                <button onClick={() => setPrintPreviewItem(null)} className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated letterhead physical sheet */}
            <div id="print-sheet-content" className="p-10 bg-white max-h-[70vh] overflow-y-auto font-serif text-black leading-relaxed">
              {/* Kop Surat Dinas */}
              <div className="flex items-center gap-4 border-b-3 border-double border-neutral-950 pb-4 mb-6">
                <img src={instansiField.logoUrl} alt="Logo Dinas" className="w-16 h-16 object-cover select-none referrerPolicy='no-referrer'" />
                <div className="flex-1 text-center font-sans">
                  {instansiField.pemerintahDaerah && <h2 className="text-xs font-bold uppercase tracking-wide leading-tight">{instansiField.pemerintahDaerah}</h2>}
                  {instansiField.unitOrganisasi && <h2 className="text-xs font-black uppercase tracking-wide leading-tight mb-0.5">{instansiField.unitOrganisasi}</h2>}
                  <h1 className="text-base font-black uppercase tracking-wide leading-tight">{instansiField.nama}</h1>
                  <p className="text-xs mt-1">{instansiField.alamat}</p>
                  <p className="text-[10px] text-neutral-600">
                    Telp: {instansiField.telepon} | Email: {instansiField.email} | Web: {instansiField.website}
                  </p>
                </div>
              </div>

              {/* Judul Surat */}
              <div className="text-center font-sans mb-8">
                <h3 className="text-sm font-bold tracking-wider underline">SURAT PERTANGGUNGJAWABAN RUTIN OPERASIONAL (SPJ-R)</h3>
                <span className="text-xs font-mono text-neutral-500">Nomor Registrasi: {printPreviewItem.nomorSpj}</span>
              </div>

              {/* Rincian Konten Surat */}
              <div className="text-[13px] space-y-4 mb-8 font-sans">
                <p>
                  Pada hari ini, tanggal <strong className="font-semibold">{printPreviewItem.tanggal}</strong>, telah disetujui administrasi Surat Pertanggungjawaban di lingkungan keuangan <strong className="font-semibold">{instansiField.nama}</strong>, untuk rincian pekerjaan belanja rutin sebagai berikut:
                </p>

                <table className="w-full border-collapse border border-neutral-500 text-left my-4">
                  <tbody>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold w-1/3">Jenis Pengeluaran</td>
                      <td className="p-2 text-blue-800 font-bold">{printPreviewItem.jenisSpj}</td>
                    </tr>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold">Rincian Barang / Jasa</td>
                      <td className="p-2">{printPreviewItem.namaBarang}</td>
                    </tr>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold">Volume Pekerjaan</td>
                      <td className="p-2 font-mono">{printPreviewItem.volume} Satuan Kegiatan</td>
                    </tr>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold">Harga Satuan</td>
                      <td className="p-2 font-mono">{formatRupiah(printPreviewItem.harga)}</td>
                    </tr>
                    <tr className="border-b border-neutral-400 bg-neutral-100">
                      <td className="p-2 border-r border-neutral-400 font-bold uppercase text-blue-900">Total Pengeluaran</td>
                      <td className="p-2 font-mono font-black text-sm text-blue-900">{formatRupiah(printPreviewItem.total)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-neutral-400 font-bold">Keterangan / Tujuan</td>
                      <td className="p-2 italic">{printPreviewItem.keterangan || 'Logistik Rutin Internal Aparatur'}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-4">
                  Segala dokumen bukti transaksi pengeluaran (Faktur Tagihan, Kuitansi Toko, SPTJM Belanja) terlampir yang secara sah terekam dalam file sistem dengan ID rujukan <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono">{printPreviewItem.id}</code> dan file fisik <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-semibold">{printPreviewItem.lampiranName || 'nota_atkrutin.pdf'}</code>.
                </p>
              </div>

              {/* Tanda tangan (Signatures) */}
              <div className="grid grid-cols-2 gap-4 pt-8 text-center text-xs font-sans">
                <div>
                  <p className="text-neutral-500">Mendengar / Mengetahui,</p>
                  <strong className="block mt-1">Pejabat Pembuat Komitmen (PPK)</strong>
                  <div className="h-20" />
                  <strong className="block underline">Ir. H. Budi Santoso, M.T.</strong>
                  <span className="text-[10px] text-neutral-500 block">NIP. 19720312 200112 1 002</span>
                </div>
                <div>
                  <p className="text-neutral-500">Penyedia SPJ / Bendahara,</p>
                  <strong className="block mt-1">Bendahara Pengeluaran Pembantu</strong>
                  <div className="h-20" />
                  <strong className="block underline">Sri Wahyuni, A.Md.Keb.</strong>
                  <span className="text-[10px] text-neutral-500 block">NIP. 19850402 201001 2 004</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
