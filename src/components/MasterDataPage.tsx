/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, Download, Upload, X, Check, Grid } from 'lucide-react';
import { MasterData } from '../types';

interface MasterDataPageProps {
  masterList: MasterData[];
  onAdd: (newData: Omit<MasterData, 'id'>) => void;
  onEdit: (updatedData: MasterData) => void;
  onDelete: (id: string) => void;
  onImport: (importedItems: Omit<MasterData, 'id'>[]) => void;
  currentUserRole: 'Admin' | 'User';
}

export default function MasterDataPage({
  masterList,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  currentUserRole
}: MasterDataPageProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof MasterData>('kodeRekening');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterData | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  // Form states
  const [formKode, setFormKode] = useState('');
  const [formProgram, setFormProgram] = useState('');
  const [formKegiatan, setFormKegiatan] = useState('');
  const [formSubKegiatan, setFormSubKegiatan] = useState('');
  const [formUraian, setFormUraian] = useState('');
  const [formPagu, setFormPagu] = useState<number | ''>('');

  // Dialog Reset Helpers
  const resetForm = () => {
    setFormKode('');
    setFormProgram('');
    setFormKegiatan('');
    setFormSubKegiatan('');
    setFormUraian('');
    setFormPagu('');
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: MasterData) => {
    setEditingItem(item);
    setFormKode(item.kodeRekening);
    setFormProgram(item.program);
    setFormKegiatan(item.kegiatan);
    setFormSubKegiatan(item.subKegiatan);
    setFormUraian(item.uraianKegiatan);
    setFormPagu(item.pagu);
    setIsModalOpen(true);
  };

  // Save changes handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode || !formProgram || !formSubKegiatan || !formPagu) {
      alert('Mohon lengkapi seluruh field wajib (*)');
      return;
    }

    if (editingItem) {
      onEdit({
        id: editingItem.id,
        kodeRekening: formKode,
        program: formProgram,
        kegiatan: formKegiatan,
        subKegiatan: formSubKegiatan,
        uraianKegiatan: formUraian,
        pagu: Number(formPagu),
      });
    } else {
      onAdd({
        kodeRekening: formKode,
        program: formProgram,
        kegiatan: formKegiatan,
        subKegiatan: formSubKegiatan,
        uraianKegiatan: formUraian,
        pagu: Number(formPagu),
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (id: string, code: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kode rekening ${code}?`)) {
      onDelete(id);
    }
  };

  // Excel Export Simulator
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Kode Rekening,Program,Kegiatan,Sub Kegiatan,Uraian,Pagu\r\n';
    
    masterList.forEach((row) => {
      csvContent += `"${row.id}","${row.kodeRekening}","${row.program}","${row.kegiatan}","${row.subKegiatan}","${row.uraianKegiatan}","${row.pagu}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'master_data_pagu_dinas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Import Simulator Parser
  const handleImportTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    // We expect simple comma/tab/newline formatted data
    // Example: Kode;Program;Kegiatan;SubKegiatan;Uraian;Pagu
    const rows = importText.split('\n');
    const parsedData: Omit<MasterData, 'id'>[] = [];

    rows.forEach(r => {
      const parts = r.split(';');
      if (parts.length >= 6) {
        parsedData.push({
          kodeRekening: parts[0].trim(),
          program: parts[1].trim(),
          kegiatan: parts[2].trim(),
          subKegiatan: parts[3].trim(),
          uraianKegiatan: parts[4].trim(),
          pagu: Number(parts[5].trim()) || 0,
        });
      }
    });

    if (parsedData.length > 0) {
      onImport(parsedData);
      setIsImportModalOpen(false);
      setImportText('');
      alert(`Berhasil mengimpor ${parsedData.length} baris data baru ke Master Data!`);
    } else {
      alert('Format tidak valid. Gunakan format pisahan titik koma (;)\nContoh:\nKode;Program;Kegiatan;SubKegiatan;Uraian;Pagu');
    }
  };

  // Sorting Logic
  const handleSort = (field: keyof MasterData) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredItems = masterList.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.kodeRekening.toLowerCase().includes(q) ||
      item.program.toLowerCase().includes(q) ||
      item.kegiatan.toLowerCase().includes(q) ||
      item.subKegiatan.toLowerCase().includes(q) ||
      item.uraianKegiatan.toLowerCase().includes(q)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  // Pagination calculations
  const totalEntries = sortedItems.length;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="master-page-root" className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Grid className="w-5 h-5 text-blue-600" /> Pengelolaan Master Data Pagu Anggaran
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Daftar Kode Rekening, RKA Program Kegiatan, dan alokasi Pagu.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {currentUserRole === 'Admin' && (
            <>
              <button
                id="btn-import-excel"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Import Excel
              </button>
              <button
                id="btn-add-master"
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Rekening
              </button>
            </>
          )}

          <button
            id="btn-export-excel"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV (Excel)
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters and search box */}
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
              placeholder="Cari Kode Rekening, Program, Kegiatan atau Sub..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-4 py-2 border border-neutral-300 rounded-xl focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Data list */}
        <div className="overflow-x-auto">
          <table id="tbl-master-pagu" className="min-w-full divide-y divide-neutral-200 text-left">
            <thead className="bg-neutral-50">
              <tr className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold border-b border-neutral-200">
                <th className="px-5 py-3 cursor-pointer select-none" onClick={() => handleSort('kodeRekening')}>
                  <div className="flex items-center gap-1">Kode Rekening <ArrowUpDown className="w-3 h-3 text-neutral-400" /></div>
                </th>
                <th className="px-5 py-3">Rincian Program / Kegiatan / Sub</th>
                <th className="px-5 py-3">Uraian Pekerjaan</th>
                <th className="px-5 py-3 cursor-pointer select-none" onClick={() => handleSort('pagu')}>
                  <div className="flex items-center gap-1">Alokasi Pagu <ArrowUpDown className="w-3 h-3 text-neutral-400" /></div>
                </th>
                {currentUserRole === 'Admin' && <th className="px-5 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {currentEntries.length > 0 ? (
                currentEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-neutral-700">{row.kodeRekening}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <div className="font-bold text-neutral-900 truncate" title={row.program}>{row.program}</div>
                      <div className="text-neutral-500 text-[11px] truncate" title={row.kegiatan}>-{row.kegiatan}</div>
                      <div className="text-blue-700 text-[11px] font-semibold truncate" title={row.subKegiatan}>-{row.subKegiatan}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-600 max-w-xs truncate" title={row.uraianKegiatan}>
                      {row.uraianKegiatan || '-'}
                    </td>
                    <td className="px-5 py-4 font-bold text-neutral-900">{formatRupiah(row.pagu)}</td>
                    {currentUserRole === 'Admin' && (
                      <td className="px-5 py-4 text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-edit-${row.id}`}
                            onClick={() => openEditModal(row)}
                            className="p-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md transition-colors flex items-center gap-1"
                            title="Edit Data Pagu"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            id={`btn-delete-${row.id}`}
                            onClick={() => handleDeleteClick(row.id, row.kodeRekening)}
                            className="p-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors flex items-center gap-1"
                            title="Hapus Rekening"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentUserRole === 'Admin' ? 5 : 4} className="text-center py-8 text-neutral-400 font-medium">
                    Tidak ditemukan data pagu anggaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500 font-semibold shadow-xs">
            <span>
              Menampilkan {indexOfFirstEntry + 1} s.d. {Math.min(indexOfLastEntry, totalEntries)} dari {totalEntries} data
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

      {/* POPUP MODAL (Bootstrap-like popup simulator) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal box */}
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full z-10 overflow-hidden animate-fade-in">
            <div className="bg-blue-600 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-tight text-sm uppercase">
                {editingItem ? 'Ubah Kode Rekening & Pagu' : 'Tambah Rekening Pagu Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Kode rekening */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Kode Rekening *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5.1.02.01.01.0024"
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Program */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Program *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Program Kerja Dinas"
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Kegiatan */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Nama Kegiatan"
                    value={formKegiatan}
                    onChange={(e) => setFormKegiatan(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Sub Kegiatan */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Sub Kegiatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Sub Kegiatan rincian"
                    value={formSubKegiatan}
                    onChange={(e) => setFormSubKegiatan(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Uraian Kegiatan */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Uraian Pekerjaan / Kegiatan</label>
                  <textarea
                    rows={2}
                    placeholder="Uraian detail rincian pekerjaan"
                    value={formUraian}
                    onChange={(e) => setFormUraian(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Pagu IDR */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Alokasi Pagu Rupiah *</label>
                  <input
                    type="number"
                    required
                    placeholder="Masukan nilai pagu rupiah"
                    value={formPagu}
                    onChange={(e) => setFormPagu(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* Botones modal */}
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT EXCEL POPUP SIMULATOR */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsImportModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full z-10 overflow-hidden animate-fade-in font-sans">
            <div className="bg-neutral-850 px-5 py-4 flex justify-between items-center text-white">
              <span className="font-bold text-xs uppercase tracking-wider text-black">Simulator CSV/Excel Import</span>
              <button onClick={() => setIsImportModalOpen(false)} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportTextSubmit} className="p-5 space-y-4">
              <div>
                <p className="text-xs text-neutral-500 leading-normal mb-3">
                  Silakan tempel (paste) baris data dengan pemisah titik koma (;) sesuai urutan berikut:<br />
                  <code className="bg-neutral-100 px-1 py-0.5 rounded text-[10px] text-blue-700 font-mono">Kode;Program;Kegiatan;SubKegiatan;Uraian;Pagu</code>
                </p>

                <textarea
                  rows={6}
                  required
                  placeholder="5.1.02.01.01.9999;Program Baru;Kegiatan Baru;Sub Baru;Uraian Kerja Baru;75000000"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full text-[11px] font-mono p-3 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 resize-none bg-neutral-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Proses Anggaran Impor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
