/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Printer, Landmark, FileCheck, X, Check, Eye, HelpCircle } from 'lucide-react';
import { Kontrak, BAPP, Instansi } from '../types';

interface BAPPPageProps {
  kontrakList: Kontrak[];
  instansiField: Instansi;
  onAddKontrak: (newK: Omit<Kontrak, 'id' | 'terminList'>) => void;
  onEditKontrak: (updatedK: Kontrak) => void;
  onDeleteKontrak: (id: string) => void;
  onAddTermin: (kontrakId: string, newB: Omit<BAPP, 'id'>) => void;
  onDeleteTermin: (kontrakId: string, terminId: string) => void;
  currentUserRole: 'Admin' | 'User';
}

export default function BAPPPage({
  kontrakList,
  instansiField,
  onAddKontrak,
  onEditKontrak,
  onDeleteKontrak,
  onAddTermin,
  onDeleteTermin,
  currentUserRole
}: BAPPPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKontrak, setSelectedKontrak] = useState<Kontrak | null>(kontrakList[0] || null);
  
  // Modals state
  const [isKontrakModalOpen, setIsKontrakModalOpen] = useState(false);
  const [editingKontrak, setEditingKontrak] = useState<Kontrak | null>(null);
  
  const [isTerminModalOpen, setIsTerminModalOpen] = useState(false);
  const [printBappItem, setPrintBappItem] = useState<{ kontrak: Kontrak; bapp: BAPP } | null>(null);

  // Form states for Kontrak
  const [formNoKtr, setFormNoKtr] = useState('');
  const [formPenyedia, setFormPenyedia] = useState('');
  const [formNilaiKtr, setFormNilaiKtr] = useState<number | ''>('');
  const [formTglKtr, setFormTglKtr] = useState('');
  const [formUangMuka, setFormUangMuka] = useState<number | ''>('');

  // Form states for BAPP Termin
  const [formNoBapp, setFormNoBapp] = useState('');
  const [formTerminKe, setFormTerminKe] = useState<number>('');
  const [formNilaiPembayaran, setFormNilaiPembayaran] = useState<number | ''>('');
  const [formTglBapp, setFormTglBapp] = useState('');
  const [formPotonganUM, setFormPotonganUM] = useState<number | ''>('');

  // Currency helpers
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Reset Kontrak Form
  const resetKontrakForm = () => {
    setFormNoKtr('');
    setFormPenyedia('');
    setFormNilaiKtr('');
    setFormTglKtr(new Date().toISOString().substring(0, 10));
    setFormUangMuka('');
    setEditingKontrak(null);
  };

  const openAddKontrakModal = () => {
    resetKontrakForm();
    setIsKontrakModalOpen(true);
  };

  const openEditKontrakModal = (k: Kontrak) => {
    setEditingKontrak(k);
    setFormNoKtr(k.nomorKontrak);
    setFormPenyedia(k.penyedia);
    setFormNilaiKtr(k.nilaiKontrak);
    setFormTglKtr(k.tanggalKontrak);
    setFormUangMuka(k.uangMuka);
    setIsKontrakModalOpen(true);
  };

  const handleSaveKontrak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNoKtr || !formPenyedia || !formNilaiKtr) {
      alert('Mohon isi field wajib (*)');
      return;
    }

    if (editingKontrak) {
      onEditKontrak({
        ...editingKontrak,
        nomorKontrak: formNoKtr,
        penyedia: formPenyedia,
        nilaiKontrak: Number(formNilaiKtr),
        tanggalKontrak: formTglKtr,
        uangMuka: Number(formUangMuka) || 0,
      });
      // Update selected item state
      setTimeout(() => {
        const match = kontrakList.find(x => x.id === editingKontrak.id);
        if (match) setSelectedKontrak(match);
      }, 100);
    } else {
      onAddKontrak({
        nomorKontrak: formNoKtr,
        penyedia: formPenyedia,
        nilaiKontrak: Number(formNilaiKtr),
        tanggalKontrak: formTglKtr,
        uangMuka: Number(formUangMuka) || 0,
      });
    }

    setIsKontrakModalOpen(false);
    resetKontrakForm();
  };

  const handleDeleteKontrak = (id: string, nomor: string) => {
    if (confirm(`Apakah Anda yakin menghapus Kontrak ${nomor}? Seluruh data termin pembayaran terkait juga akan terhapus!`)) {
      onDeleteKontrak(id);
      setSelectedKontrak(null);
    }
  };

  // Prepare and open Add Termin/BAPP Modal
  const openAddTerminModal = () => {
    if (!selectedKontrak) return;
    setFormNoBapp(`BAPP/TERM-${(selectedKontrak.terminList.length + 1)}/${selectedKontrak.nomorKontrak.split('/')[1] || 'KTR'}/2026`);
    setFormTerminKe(selectedKontrak.terminList.length + 1);
    setFormNilaiPembayaran('');
    setFormTglBapp(new Date().toISOString().substring(0, 10));
    setFormPotonganUM(selectedKontrak.uangMuka > 0 ? (selectedKontrak.uangMuka / 5) : 0); // automatic linear amortization suggestion
    setIsTerminModalOpen(true);
  };

  const handleSaveTermin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKontrak) return;
    if (!formNoBapp || !formTerminKe || !formNilaiPembayaran) {
      alert('Lengkapi seluruh form inputan termin!');
      return;
    }

    // Calculative remainder check
    const totalTerminPaid = selectedKontrak.terminList.reduce((acc, t) => acc + t.nilaiPembayaran, 0);
    const sisa = selectedKontrak.nilaiKontrak - totalTerminPaid;

    if (Number(formNilaiPembayaran) > sisa) {
      alert(`Peringatan: Nilai termin pembayaran (${formatRupiah(Number(formNilaiPembayaran))}) melebihi sisa kontrak tersedia (${formatRupiah(sisa)})!`);
      return;
    }

    onAddTermin(selectedKontrak.id, {
      nomorBAPP: formNoBapp,
      kontrakId: selectedKontrak.id,
      terminKe: Number(formTerminKe),
      nilaiPembayaran: Number(formNilaiPembayaran),
      sisaKontrak: sisa - Number(formNilaiPembayaran),
      tanggalBAPP: formTglBapp,
      potonganUangMuka: Number(formPotonganUM) || 0
    });

    setIsTerminModalOpen(false);
  };

  const handleDeleteTermin = (terminId: string, bappNo: string) => {
    if (selectedKontrak && confirm(`Hapus registrasi BAPP termin no ${bappNo}?`)) {
      onDeleteTermin(selectedKontrak.id, terminId);
    }
  };

  // Searching logic
  const filteredKontrak = kontrakList.filter(k => {
    const q = searchQuery.toLowerCase();
    return (
      k.nomorKontrak.toLowerCase().includes(q) ||
      k.penyedia.toLowerCase().includes(q)
    );
  });

  return (
    <div id="bapp-page-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left panel: Contracts Directory */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-neutral-900 text-sm">Daftar Kontrak Kerja Sama</h3>
            <button
              id="btn-add-contract"
              onClick={openAddKontrakModal}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Kontrak
            </button>
          </div>

          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Cari kontrak atau penyedia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-neutral-300 rounded-lg outline-none"
            />
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {filteredKontrak.length > 0 ? (
              filteredKontrak.map(k => {
                const isSelected = selectedKontrak?.id === k.id;
                const totalPaid = k.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0);
                const percentProgress = k.nilaiKontrak > 0 ? (totalPaid / k.nilaiKontrak) * 100 : 0;

                return (
                  <div
                    key={k.id}
                    onClick={() => setSelectedKontrak(k)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-neutral-200 hover:bg-neutral-50 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-mono text-[10px] text-neutral-400 block truncate max-w-[200px]">
                        {k.nomorKontrak}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-100 text-[9px] font-mono font-bold text-neutral-600 rounded">
                        {k.terminList.length} Termin
                      </span>
                    </div>

                    <strong className="text-xs font-bold text-neutral-900 block mt-1">{k.penyedia}</strong>
                    
                    <div className="flex justify-between items-center text-xs mt-3">
                      <span className="text-neutral-500 font-medium">Nilai Kontrak:</span>
                      <strong className="text-blue-950">{formatRupiah(k.nilaiKontrak)}</strong>
                    </div>

                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>Serapan Realisasi Fisik / Termin</span>
                        <span className="font-bold text-blue-700">{percentProgress.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(percentProgress, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-8 text-xs text-neutral-400 font-medium">Tidak ada kontrak kerja sama.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Termins detail & history */}
      <div className="lg:col-span-7 space-y-4">
        {selectedKontrak ? (
          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-xs">
            {/* Header info */}
            <div className="pb-4 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider font-mono">DOKUMEN KONTRAK AKTIF</span>
                <h3 className="text-base font-black text-neutral-900 tracking-tight mt-0.5">{selectedKontrak.penyedia}</h3>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{selectedKontrak.nomorKontrak}</p>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button
                  id="btn-edit-contract"
                  onClick={() => openEditKontrakModal(selectedKontrak)}
                  className="px-2.5 py-1.5 border border-amber-300 hover:bg-amber-50 text-amber-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Edit Kontrak
                </button>
                {currentUserRole === 'Admin' && (
                  <button
                    id="btn-delete-contract"
                    onClick={() => handleDeleteKontrak(selectedKontrak.id, selectedKontrak.nomorKontrak)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {/* Quick specifications metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-neutral-100 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block font-bold">NILAI KONTRAK</span>
                <strong className="text-neutral-800 tracking-tight">{formatRupiah(selectedKontrak.nilaiKontrak)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-bold">UANG MUKA DISERAHKAN</span>
                <strong className="text-neutral-800 tracking-tight">{formatRupiah(selectedKontrak.uangMuka)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-bold">TOTAL REALISASI TERM</span>
                <strong className="text-emerald-700">
                  {formatRupiah(selectedKontrak.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0))}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-bold">SISA KONTRAK HARI INI</span>
                <strong className="text-rose-700">
                  {formatRupiah(
                    selectedKontrak.nilaiKontrak - 
                    selectedKontrak.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0)
                  )}
                </strong>
              </div>
            </div>

            {/* Determin history title and button */}
            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">Histori Termin Pembayaran (BAPP)</h4>
                <button
                  id="btn-add-termin"
                  onClick={openAddTerminModal}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Termin BAPP
                </button>
              </div>

              {/* BAPP Tables */}
              <div className="overflow-x-auto border border-neutral-100 rounded-lg shadow-xs">
                <table className="min-w-full divide-y divide-neutral-200 text-left">
                  <thead className="bg-neutral-50/70 text-[10px] uppercase font-bold text-neutral-500">
                    <tr>
                      <th className="px-4 py-2 bg-neutral-100">Termin</th>
                      <th className="px-4 py-2">Nomor BAPP / Tanggal</th>
                      <th className="px-4 py-2">Faktor Bayar</th>
                      <th className="px-4 py-2">Potongan UM</th>
                      <th className="px-4 py-2">Sisa Kontrak</th>
                      <th className="px-4 py-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {selectedKontrak.terminList.length > 0 ? (
                      selectedKontrak.terminList.map(t => (
                        <tr key={t.id} className="hover:bg-neutral-50/40">
                          <td className="px-4 py-3 bg-neutral-50 font-black font-mono text-center">Ke-{t.terminKe}</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-neutral-800 block truncate max-w-[170px]" title={t.nomorBAPP}>
                              {t.nomorBAPP}
                            </span>
                            <span className="text-[10px] text-neutral-500">{t.tanggalBAPP}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-800 font-mono">
                            {formatRupiah(t.nilaiPembayaran)}
                          </td>
                          <td className="px-4 py-3 text-rose-600 font-mono">
                            -{formatRupiah(t.potonganUangMuka)}
                          </td>
                          <td className="px-4 py-3 text-neutral-400 font-mono">
                            {formatRupiah(t.sisaKontrak)}
                          </td>
                          <td className="px-4 py-3 text-right shrink-0">
                            <div className="flex gap-1 justify-end">
                              <button
                                id={`btn-view-bapp-${t.id}`}
                                onClick={() => setPrintBappItem({ kontrak: selectedKontrak, bapp: t })}
                                className="p-1 px-2 border border-blue-100 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center"
                                title="Buka Blanko BAPP Resmi"
                              >
                                Cetak PDF
                              </button>
                              {currentUserRole === 'Admin' && (
                                <button
                                  id={`btn-del-termin-${t.id}`}
                                  onClick={() => handleDeleteTermin(t.id, t.nomorBAPP)}
                                  className="p-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                                  title="Batalkan BAPP Termin"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-neutral-400 font-medium">
                          Belum ada termin penarikan BAPP yang diajukan untuk kontrak ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-xl p-10 text-center text-neutral-400">
            <HelpCircle className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
            <p className="font-bold text-sm">Silakan pilih kontrak di panel kiri untuk mengelola BAPP Termin.</p>
          </div>
        )}
      </div>

      {/* POPUP KONTRAK INPUT/EDIT MODAL */}
      {isKontrakModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsKontrakModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full z-10 overflow-hidden animate-fade-in font-sans">
            <div className="bg-blue-600 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-tight text-sm uppercase">
                {editingKontrak ? 'Edit Detail Kontrak Kerja' : 'Pendaftaran Dokumen Kontrak Baru'}
              </h3>
              <button onClick={() => setIsKontrakModalOpen(false)} className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKontrak} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Nomor kontrak */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nomor Kontrak Kerja *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 602/092/PUPR/KTR-JALAN/2026"
                    value={formNoKtr}
                    onChange={(e) => setFormNoKtr(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Penyedia */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nama Penyedia Lapangan (Penyedia Jasa) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Wijaya Konstruksi Pratama"
                    value={formPenyedia}
                    onChange={(e) => setFormPenyedia(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Nilai kontrak */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nilai Pagu Kontrak Kerja *</label>
                  <input
                    type="number"
                    required
                    placeholder="Masukan nilai kontrak"
                    value={formNilaiKtr}
                    onChange={(e) => setFormNilaiKtr(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Tanggal kontrak */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Tanggal Tanda Tangan *</label>
                  <input
                    type="date"
                    required
                    value={formTglKtr}
                    onChange={(e) => setFormTglKtr(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Uang muka */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nilai Uang Muka diserahkan (Uang Muka)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 240000000"
                    value={formUangMuka}
                    onChange={(e) => setFormUangMuka(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                  <span className="text-[9px] text-neutral-400 mt-1 block">Tinggalkan kosong bila tidak ada penarikan Uang Muka.</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsKontrakModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Simpan Kontrak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP BAPP TERMIN INPUT MODAL */}
      {isTerminModalOpen && selectedKontrak && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsTerminModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full z-10 overflow-hidden animate-fade-in font-sans">
            <div className="bg-indigo-700 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-tight text-sm uppercase">
                Buat Berita Acara Pembayaran Pekerjaan (BAPP)
              </h3>
              <button onClick={() => setIsTerminModalOpen(false)} className="text-indigo-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTermin} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Nomor Bapp */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nomor Registrasi BAPP *</label>
                  <input
                    type="text"
                    required
                    value={formNoBapp}
                    onChange={(e) => setFormNoBapp(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Termin Ke */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Termin Pembayaran Ke-*</label>
                  <input
                    type="number"
                    required
                    value={formTerminKe}
                    onChange={(e) => setFormTerminKe(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Tanggal BAPP */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Tanggal BAPP Realisasi *</label>
                  <input
                    type="date"
                    required
                    value={formTglBapp}
                    onChange={(e) => setFormTglBapp(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Nilai Pembayaran */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nilai Pembayaran Termin (Bruto) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 300000000"
                    value={formNilaiPembayaran}
                    onChange={(e) => setFormNilaiPembayaran(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Potongan Uang muka */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Potongan Pengembalian UM (Pelepasan)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 48000000"
                    value={formPotonganUM}
                    onChange={(e) => setFormPotonganUM(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold text-rose-600"
                  />
                </div>

                {/* Info sisa kontrak after calculations */}
                <div className="col-span-2 bg-neutral-100 p-2.5 rounded-lg border flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-500 text-[10px] uppercase">Rekomendasi Netto Sisa Kontrak:</span>
                  <strong className="text-neutral-800">
                    {Number(formNilaiPembayaran) 
                      ? formatRupiah(
                          (selectedKontrak.nilaiKontrak - selectedKontrak.terminList.reduce((acc, t) => acc + t.nilaiPembayaran, 0)) - 
                          Number(formNilaiPembayaran)
                        )
                      : formatRupiah(selectedKontrak.nilaiKontrak - selectedKontrak.terminList.reduce((acc, t) => acc + t.nilaiPembayaran, 0))}
                  </strong>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsTerminModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Terbitkan Dokumen BAPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED PRINT BLANKO BAPP MODAL */}
      {printBappItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setPrintBappItem(null)} />
          
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-3xl w-full z-10 my-8 overflow-hidden flex flex-col animate-scale-up font-sans">
            <div className="bg-neutral-950 px-5 py-3.5 flex justify-between items-center text-white shrink-0">
              <span className="text-xs font-bold font-mono text-black uppercase tracking-wider">Lembar Fisik Berita Acara Pembayaran Pekerjaan</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak BAPP / PDF
                </button>
                <button onClick={() => setPrintBappItem(null)} className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated letterhead physical sheet */}
            <div id="print-bapp-sheet" className="p-10 bg-white max-h-[70vh] overflow-y-auto font-serif text-black leading-relaxed">
              {/* Kop Surat */}
              <div className="flex items-center gap-4 border-b-3 border-double border-neutral-950 pb-4 mb-6">
                <img src={instansiField.logoUrl} alt="Logo" className="w-16 h-16 object-cover select-none referrerPolicy='no-referrer'" />
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

              {/* Judul Dokumen */}
              <div className="text-center font-sans mb-6">
                <h3 className="text-sm font-bold tracking-wider underline uppercase">BERITA ACARA PEMBAYARAN PEKERJAAN (BAPP)</h3>
                <span className="text-xs font-mono font-bold text-neutral-500">Nomor Registrasi BAPP: {printBappItem.bapp.nomorBAPP}</span>
              </div>

              {/* Rincian Lembar BAPP */}
              <div className="text-[13px] space-y-4 mb-6 font-sans">
                <p>
                  Sesuai dengan pelaksanaan kontrak dilingkungan <strong className="font-semibold">{instansiField.nama}</strong>, pada hari ini tanggal <strong className="font-semibold">{printBappItem.bapp.tanggalBAPP}</strong> kami yang bertanda tangan di bawah ini secara sah menyatakan bahwa progress penyerapan termin fisik kerja penyedia jasa dapat diajukan dengan rujukan klausul kontrak:
                </p>

                <div className="bg-neutral-50 p-4 border border-neutral-300 rounded-lg my-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Referansi Kontrak Kerja:</span>
                    <strong className="text-neutral-900 font-mono">{printBappItem.kontrak.nomorKontrak}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tanggal Perjanjian Kontrak:</span>
                    <strong className="text-neutral-800">{printBappItem.kontrak.tanggalKontrak}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Penyedia Jasa Konstruksi:</span>
                    <strong className="text-blue-900">{printBappItem.kontrak.penyedia}</strong>
                  </div>
                </div>

                <p className="font-bold text-neutral-800 border-b pb-1">RINCIAN PERHITUNGAN TERMIN KEUANGAN (TERMIN KE-{printBappItem.bapp.terminKe}):</p>

                <table className="w-full border-collapse border border-neutral-500 text-left my-4">
                  <tbody>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold w-1/2">1. Nilai Total Kontrak</td>
                      <td className="p-2 font-mono text-neutral-900 font-semibold">{formatRupiah(printBappItem.kontrak.nilaiKontrak)}</td>
                    </tr>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold">2. Penarikan Pembayaran Kas (Bruto)</td>
                      <td className="p-2 font-mono font-bold text-neutral-900">{formatRupiah(printBappItem.bapp.nilaiPembayaran)}</td>
                    </tr>
                    <tr className="border-b border-neutral-400">
                      <td className="p-2 border-r border-neutral-400 font-bold text-rose-700">3. Potongan Pelepasan Uang Muka Amortisasi</td>
                      <td className="p-2 font-mono text-rose-700 font-semibold">-{formatRupiah(printBappItem.bapp.potonganUangMuka)}</td>
                    </tr>
                    <tr className="border-b border-neutral-400 bg-emerald-50">
                      <td className="p-2 border-r border-neutral-400 font-bold text-emerald-950">4. Jumlah Pembayaran Netto Termin Ini (Diterima)</td>
                      <td className="p-2 font-mono font-black text-sm text-emerald-850">
                        {formatRupiah(printBappItem.bapp.nilaiPembayaran - printBappItem.bapp.potonganUangMuka)}
                      </td>
                    </tr>
                    <tr className="bg-neutral-100">
                      <td className="p-2 border-r border-neutral-400 font-bold text-neutral-500">5. Sisa Nilai Kontrak Selanjutnya</td>
                      <td className="p-2 font-mono font-bold text-neutral-500">{formatRupiah(printBappItem.bapp.sisaKontrak)}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="italic mt-4">
                  Pekerjaan fisik telah ditinjau dan dinyatakan layak bayar (sesuai target progress Rencana Fisika Dinas PUPR). Segala dokumen penunjang seperti as-built drawing, progress report, dokumentasi 0-50-100% dinyatakan sah dan lengkap.
                </p>
              </div>

              {/* Tanda tangan (Signatures) */}
              <div className="grid grid-cols-2 gap-4 pt-8 text-center text-xs font-sans">
                <div>
                  <p className="text-neutral-500">PIHAK PERTAMA,</p>
                  <strong className="block mt-1">Pejabat Pembuat Komitmen (PPK)</strong>
                  <div className="h-20" />
                  <strong className="block underline">Ir. H. Budi Santoso, M.T.</strong>
                  <span className="text-[10px] text-neutral-500 block">NIP. 19720312 200112 1 002</span>
                </div>
                <div>
                  <p className="text-neutral-500">PIHAK KEDUA,</p>
                  <strong className="block mt-1">{printBappItem.kontrak.penyedia}</strong>
                  <div className="h-20" />
                  <strong className="block underline">Direktur Pelaksana Jasa</strong>
                  <span className="text-[10px] text-neutral-500 block">Materai Cukup 10000 Dilunasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
