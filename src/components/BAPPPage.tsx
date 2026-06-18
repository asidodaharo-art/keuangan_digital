/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Printer, Landmark, FileCheck, X, Check, Eye, HelpCircle, FileText, Coins, Layers, CreditCard, Users, Briefcase, ShieldAlert } from 'lucide-react';
import { Kontrak, BAPP, Instansi, MasterData } from '../types';
import { defaultMasterData } from '../data';

interface BAPPPageProps {
  kontrakList: Kontrak[];
  instansiField: Instansi;
  masterList?: MasterData[];
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
  masterList,
  onAddKontrak,
  onEditKontrak,
  onDeleteKontrak,
  onAddTermin,
  onDeleteTermin,
  currentUserRole
 }: BAPPPageProps) {
  const [activeTab, setActiveTab] = useState<'kontrak' | 'pembayaran'>('kontrak');
  const [activePaymentTab, setActivePaymentTab] = useState<'uangmuka' | 'termin'>('uangmuka');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKontrak, setSelectedKontrak] = useState<Kontrak | null>(kontrakList[0] || null);
  
  // Resolve masterData items with a fallback
  const masterDataItems = masterList || defaultMasterData;

  // Modals state
  const [isKontrakModalOpen, setIsKontrakModalOpen] = useState(false);
  const [editingKontrak, setEditingKontrak] = useState<Kontrak | null>(null);
  
  const [isTerminModalOpen, setIsTerminModalOpen] = useState(false);
  const [isUmModalOpen, setIsUmModalOpen] = useState(false);
  const [printBappItem, setPrintBappItem] = useState<{ kontrak: Kontrak; bapp: BAPP } | null>(null);

  // Sub-halaman state inside contract popup
  const [popupActiveTab, setPopupActiveTab] = useState<'kontrak' | 'rekanan' | 'pejabat'>('kontrak');

  // Form states for Kontrak (Main data)
  const [formNoKtr, setFormNoKtr] = useState('');
  const [formPenyedia, setFormPenyedia] = useState('');
  const [formNilaiKtr, setFormNilaiKtr] = useState<number | ''>('');
  const [formTglKtr, setFormTglKtr] = useState('');
  const [formUangMuka, setFormUangMuka] = useState<number | ''>('');
  const [formNamaKegiatan, setFormNamaKegiatan] = useState('');
  const [formJangkaWaktu, setFormJangkaWaktu] = useState('');

  // SPPBJ (nomor dan tanggal)
  const [formNoSppbj, setFormNoSppbj] = useState('');
  const [formTglSppbj, setFormTglSppbj] = useState('');

  // SPMK (nomor dan tanggal)
  const [formNoSpmk, setFormNoSpmk] = useState('');
  const [formTglSpmk, setFormTglSpmk] = useState('');

  // SPL (nomor dan tanggal)
  const [formNoSpl, setFormNoSpl] = useState('');
  const [formTglSpl, setFormTglSpl] = useState('');

  // Rekanan (Data rekanan)
  const [formRekananNamaPerusahaan, setFormRekananNamaPerusahaan] = useState('');
  const [formRekananNamaPengusaha, setFormRekananNamaPengusaha] = useState('');
  const [formRekananJabatan, setFormRekananJabatan] = useState('');
  const [formRekananAlamat, setFormRekananAlamat] = useState('');
  const [formRekananNpwp, setFormRekananNpwp] = useState('');
  const [formRekananFakturPajak, setFormRekananFakturPajak] = useState('');
  const [formRekananNoJaminanPelaksanaan, setFormRekananNoJaminanPelaksanaan] = useState('');
  const [formRekananTglJaminanPelaksanaan, setFormRekananTglJaminanPelaksanaan] = useState('');
  const [formRekananBankNama, setFormRekananBankNama] = useState('');
  const [formRekananNoRekening, setFormRekananNoRekening] = useState('');

  // Pejabat - KPA (nama, nip, pangkat. golongan, jabatan)
  const [formKpaNama, setFormKpaNama] = useState('');
  const [formKpaNip, setFormKpaNip] = useState('');
  const [formKpaPangkatGolongan, setFormKpaPangkatGolongan] = useState('');
  const [formKpaJabatan, setFormKpaJabatan] = useState('');

  // Pejabat - PPTK (nama, nip, pangkat golongan, jabatan)
  const [formPptkNama, setFormPptkNama] = useState('');
  const [formPptkNip, setFormPptkNip] = useState('');
  const [formPptkPangkatGolongan, setFormPptkPangkatGolongan] = useState('');
  const [formPptkJabatan, setFormPptkJabatan] = useState('');

  // Pejabat - Bendahara (nama, nip, pangkat golongan, jabatan)
  const [formBendaharaNama, setFormBendaharaNama] = useState('');
  const [formBendaharaNip, setFormBendaharaNip] = useState('');
  const [formBendaharaPangkatGolongan, setFormBendaharaPangkatGolongan] = useState('');
  const [formBendaharaJabatan, setFormBendaharaJabatan] = useState('');

  // Form states for BAPP Termin
  const [formNoBapp, setFormNoBapp] = useState('');
  const [formTerminKe, setFormTerminKe] = useState<number>('');
  const [formNilaiPembayaran, setFormNilaiPembayaran] = useState<number | ''>('');
  const [formTglBapp, setFormTglBapp] = useState('');
  const [formPotonganUM, setFormPotonganUM] = useState<number | ''>('');

  // New Uang Muka Details states for BAPP Page
  const [formPersenUm, setFormPersenUm] = useState<number>(20);
  const [formNoPermohonanUm, setFormNoPermohonanUm] = useState('');
  const [formTglPermohonanUm, setFormTglPermohonanUm] = useState('');
  const [formNoSuratPptkUm, setFormNoSuratPptkUm] = useState('');
  const [formTglSuratPptkUm, setFormTglSuratPptkUm] = useState('');
  const [formNoKpaUm, setFormNoKpaUm] = useState('');
  const [formTglKpaUm, setFormTglKpaUm] = useState('');
  const [formNoPernyataanRekananUm, setFormNoPernyataanRekananUm] = useState('');
  const [formTglPernyataanRekananUm, setFormTglPernyataanRekananUm] = useState('');
  const [formNoPernyataanKpaUm, setFormNoPernyataanKpaUm] = useState('');
  const [formTglPernyataanKpaUm, setFormTglPernyataanKpaUm] = useState('');
  const [formNoBaUm, setFormNoBaUm] = useState('');
  const [formTglBaUm, setFormTglBaUm] = useState('');
  const [formNoSppUm, setFormNoSppUm] = useState('');
  const [formTglSppUm, setFormTglSppUm] = useState('');
  const [formNoJaminanUm, setFormNoJaminanUm] = useState('');
  const [formTglJaminanUm, setFormTglJaminanUm] = useState('');
  const [showUmSavedToast, setShowUmSavedToast] = useState(false);

  React.useEffect(() => {
    if (selectedKontrak) {
      setFormPersenUm(selectedKontrak.persenUangMuka !== undefined ? selectedKontrak.persenUangMuka : 20);
      setFormNoPermohonanUm(selectedKontrak.noPermohonanUm || '');
      setFormTglPermohonanUm(selectedKontrak.tglPermohonanUm || '');
      setFormNoSuratPptkUm(selectedKontrak.noSuratPptkUm || '');
      setFormTglSuratPptkUm(selectedKontrak.tglSuratPptkUm || '');
      setFormNoKpaUm(selectedKontrak.noKpaUm || '');
      setFormTglKpaUm(selectedKontrak.tglKpaUm || '');
      setFormNoPernyataanRekananUm(selectedKontrak.noPernyataanRekananUm || '');
      setFormTglPernyataanRekananUm(selectedKontrak.tglPernyataanRekananUm || '');
      setFormNoPernyataanKpaUm(selectedKontrak.noPernyataanKpaUm || '');
      setFormTglPernyataanKpaUm(selectedKontrak.tglPernyataanKpaUm || '');
      setFormNoBaUm(selectedKontrak.noBaUm || '');
      setFormTglBaUm(selectedKontrak.tglBaUm || '');
      setFormNoSppUm(selectedKontrak.noSppUm || '');
      setFormTglSppUm(selectedKontrak.tglSppUm || '');
      setFormNoJaminanUm(selectedKontrak.noJaminanUm || '');
      setFormTglJaminanUm(selectedKontrak.tglJaminanUm || '');
    }
  }, [selectedKontrak?.id]);

  const handleSaveUangMukaData = () => {
    if (!selectedKontrak) return;

    const calculatedUangMuka = selectedKontrak.nilaiKontrak * (formPersenUm / 100);

    const updatedKontrak: Kontrak = {
      ...selectedKontrak,
      persenUangMuka: formPersenUm,
      uangMuka: calculatedUangMuka,
      noPermohonanUm: formNoPermohonanUm,
      tglPermohonanUm: formTglPermohonanUm,
      noSuratPptkUm: formNoSuratPptkUm,
      tglSuratPptkUm: formTglSuratPptkUm,
      noKpaUm: formNoKpaUm,
      tglKpaUm: formTglKpaUm,
      noPernyataanRekananUm: formNoPernyataanRekananUm,
      tglPernyataanRekananUm: formTglPernyataanRekananUm,
      noPernyataanKpaUm: formNoPernyataanKpaUm,
      tglPernyataanKpaUm: formTglPernyataanKpaUm,
      noBaUm: formNoBaUm,
      tglBaUm: formTglBaUm,
      noSppUm: formNoSppUm,
      tglSppUm: formTglSppUm,
      noJaminanUm: formNoJaminanUm,
      tglJaminanUm: formTglJaminanUm
    };

    onEditKontrak(updatedKontrak);
    setSelectedKontrak(updatedKontrak);
    setIsUmModalOpen(false);
    
    setShowUmSavedToast(true);
    setTimeout(() => {
      setShowUmSavedToast(false);
    }, 4000);
  };

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
    setFormNamaKegiatan('');
    setFormJangkaWaktu('');

    setFormNoSppbj('');
    setFormTglSppbj('');
    setFormNoSpmk('');
    setFormTglSpmk('');
    setFormNoSpl('');
    setFormTglSpl('');

    setFormRekananNamaPerusahaan('');
    setFormRekananNamaPengusaha('');
    setFormRekananJabatan('');
    setFormRekananAlamat('');
    setFormRekananNpwp('');
    setFormRekananFakturPajak('');
    setFormRekananNoJaminanPelaksanaan('');
    setFormRekananTglJaminanPelaksanaan('');
    setFormRekananBankNama('');
    setFormRekananNoRekening('');

    setFormKpaNama('');
    setFormKpaNip('');
    setFormKpaPangkatGolongan('');
    setFormKpaJabatan('');

    setFormPptkNama('');
    setFormPptkNip('');
    setFormPptkPangkatGolongan('');
    setFormPptkJabatan('');

    setFormBendaharaNama('');
    setFormBendaharaNip('');
    setFormBendaharaPangkatGolongan('');
    setFormBendaharaJabatan('');

    setPopupActiveTab('kontrak');
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
    setFormNamaKegiatan(k.namaKegiatan || k.penyedia);
    setFormJangkaWaktu(k.jangkaWaktu || '90 Hari Kalender');

    setFormNoSppbj(k.noSppbj || '');
    setFormTglSppbj(k.tglSppbj || '');
    setFormNoSpmk(k.noSpmk || '');
    setFormTglSpmk(k.tglSpmk || '');
    setFormNoSpl(k.noSpl || '');
    setFormTglSpl(k.tglSpl || '');

    setFormRekananNamaPerusahaan(k.rekananNamaPerusahaan || '');
    setFormRekananNamaPengusaha(k.rekananNamaPengusaha || '');
    setFormRekananJabatan(k.rekananJabatan || '');
    setFormRekananAlamat(k.rekananAlamat || '');
    setFormRekananNpwp(k.rekananNpwp || '');
    setFormRekananFakturPajak(k.rekananFakturPajak || '');
    setFormRekananNoJaminanPelaksanaan(k.rekananNoJaminanPelaksanaan || '');
    setFormRekananTglJaminanPelaksanaan(k.rekananTglJaminanPelaksanaan || '');
    setFormRekananBankNama(k.rekananBankNama || '');
    setFormRekananNoRekening(k.rekananNoRekening || '');

    setFormKpaNama(k.kpaNama || '');
    setFormKpaNip(k.kpaNip || '');
    setFormKpaPangkatGolongan(k.kpaPangkatGolongan || '');
    setFormKpaJabatan(k.kpaJabatan || '');

    setFormPptkNama(k.pptkNama || '');
    setFormPptkNip(k.pptkNip || '');
    setFormPptkPangkatGolongan(k.pptkPangkatGolongan || '');
    setFormPptkJabatan(k.pptkJabatan || '');

    setFormBendaharaNama(k.bendaharaNama || '');
    setFormBendaharaNip(k.bendaharaNip || '');
    setFormBendaharaPangkatGolongan(k.bendaharaPangkatGolongan || '');
    setFormBendaharaJabatan(k.bendaharaJabatan || '');

    setPopupActiveTab('kontrak');
    setIsKontrakModalOpen(true);
  };

  const handleSaveKontrak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNoKtr || !formNamaKegiatan || !formNilaiKtr || !formTglKtr || !formJangkaWaktu) {
      alert('Mohon isi field wajib di halaman Data Kontrak Utama (*)');
      return;
    }

    // Auto-calculate DP/Uang Muka 20% for consistency in BAPP calculation formulas
    const computedUangMuka = Number(formNilaiKtr) * 0.2;

    if (editingKontrak) {
      onEditKontrak({
        ...editingKontrak,
        nomorKontrak: formNoKtr,
        penyedia: formNamaKegiatan, // use the picked activity name or custom text for list items display
        nilaiKontrak: Number(formNilaiKtr),
        tanggalKontrak: formTglKtr,
        uangMuka: computedUangMuka,
        namaKegiatan: formNamaKegiatan,
        jangkaWaktu: formJangkaWaktu,
        noSppbj: formNoSppbj,
        tglSppbj: formTglSppbj,
        noSpmk: formNoSpmk,
        tglSpmk: formTglSpmk,
        noSpl: formNoSpl,
        tglSpl: formTglSpl,
        rekananNamaPerusahaan: formRekananNamaPerusahaan,
        rekananNamaPengusaha: formRekananNamaPengusaha,
        rekananJabatan: formRekananJabatan,
        rekananAlamat: formRekananAlamat,
        rekananNpwp: formRekananNpwp,
        rekananFakturPajak: formRekananFakturPajak,
        rekananNoJaminanPelaksanaan: formRekananNoJaminanPelaksanaan,
        rekananTglJaminanPelaksanaan: formRekananTglJaminanPelaksanaan,
        rekananBankNama: formRekananBankNama,
        rekananNoRekening: formRekananNoRekening,
        kpaNama: formKpaNama,
        kpaNip: formKpaNip,
        kpaPangkatGolongan: formKpaPangkatGolongan,
        kpaJabatan: formKpaJabatan,
        pptkNama: formPptkNama,
        pptkNip: formPptkNip,
        pptkPangkatGolongan: formPptkPangkatGolongan,
        pptkJabatan: formPptkJabatan,
        bendaharaNama: formBendaharaNama,
        bendaharaNip: formBendaharaNip,
        bendaharaPangkatGolongan: formBendaharaPangkatGolongan,
        bendaharaJabatan: formBendaharaJabatan,
      });
      // Update selected item state
      setTimeout(() => {
        const match = kontrakList.find(x => x.id === editingKontrak.id);
        if (match) setSelectedKontrak(match);
      }, 100);
    } else {
      onAddKontrak({
        nomorKontrak: formNoKtr,
        penyedia: formNamaKegiatan,
        nilaiKontrak: Number(formNilaiKtr),
        tanggalKontrak: formTglKtr,
        uangMuka: computedUangMuka,
        namaKegiatan: formNamaKegiatan,
        jangkaWaktu: formJangkaWaktu,
        noSppbj: formNoSppbj,
        tglSppbj: formTglSppbj,
        noSpmk: formNoSpmk,
        tglSpmk: formTglSpmk,
        noSpl: formNoSpl,
        tglSpl: formTglSpl,
        rekananNamaPerusahaan: formRekananNamaPerusahaan,
        rekananNamaPengusaha: formRekananNamaPengusaha,
        rekananJabatan: formRekananJabatan,
        rekananAlamat: formRekananAlamat,
        rekananNpwp: formRekananNpwp,
        rekananFakturPajak: formRekananFakturPajak,
        rekananNoJaminanPelaksanaan: formRekananNoJaminanPelaksanaan,
        rekananTglJaminanPelaksanaan: formRekananTglJaminanPelaksanaan,
        rekananBankNama: formRekananBankNama,
        rekananNoRekening: formRekananNoRekening,
        kpaNama: formKpaNama,
        kpaNip: formKpaNip,
        kpaPangkatGolongan: formKpaPangkatGolongan,
        kpaJabatan: formKpaJabatan,
        pptkNama: formPptkNama,
        pptkNip: formPptkNip,
        pptkPangkatGolongan: formPptkPangkatGolongan,
        pptkJabatan: formPptkJabatan,
        bendaharaNama: formBendaharaNama,
        bendaharaNip: formBendaharaNip,
        bendaharaPangkatGolongan: formBendaharaPangkatGolongan,
        bendaharaJabatan: formBendaharaJabatan,
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
    <div id="bapp-page-root" className="space-y-6">
      {/* Top Header & Sub-page Navigation Tabs */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Landmark className="text-blue-600 w-5 h-5 shrink-0" />
          <div>
            <h2 className="font-extrabold text-neutral-900 text-sm uppercase tracking-wider">Administrasi Pencairan BAPP</h2>
            <p className="text-[10px] text-neutral-500">Kelola dan terbitkan berkas administrasi kontrak, uang muka, dan termin pembayaran.</p>
          </div>
        </div>

        {/* Sub-Halaman Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200">
          <button
            id="tab-subpage-kontrak"
            onClick={() => setActiveTab('kontrak')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kontrak'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Data Kontrak
          </button>
          <button
            id="tab-subpage-pembayaran"
            onClick={() => setActiveTab('pembayaran')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pembayaran'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Data Pembayaran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Always visible contract directory for quick context switching */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-neutral-400">Pilih Berkas Kontrak</h3>
              {activeTab === 'kontrak' && (
                <button
                  id="btn-add-contract"
                  onClick={openAddKontrakModal}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Kontrak
                </button>
              )}
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
                filteredKontrak.map((k, index) => {
                  const isSelected = selectedKontrak?.id === k.id;
                  const totalPaid = k.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0);
                  const percentProgress = k.nilaiKontrak > 0 ? (totalPaid / k.nilaiKontrak) * 100 : 0;

                  // Define dynamic soft background themes for each contract so that they are visually distinct
                  // Index-based coloring to satisfy "warna background berbeda setiap ada data baru"
                  const themes = [
                    {
                      bg: 'bg-indigo-50/10 hover:bg-indigo-50/30 border-indigo-150',
                      selected: 'border-indigo-500 bg-indigo-50 shadow-xs ring-1 ring-indigo-500/25',
                      badge: 'bg-indigo-100 text-indigo-800 border border-indigo-200/50',
                      text: 'text-indigo-950',
                      pBar: 'bg-indigo-500'
                    },
                    {
                      bg: 'bg-emerald-50/10 hover:bg-emerald-50/30 border-emerald-150',
                      selected: 'border-emerald-500 bg-emerald-50 shadow-xs ring-1 ring-emerald-500/25',
                      badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200/50',
                      text: 'text-emerald-950',
                      pBar: 'bg-emerald-500'
                    },
                    {
                      bg: 'bg-amber-50/10 hover:bg-amber-50/30 border-amber-150',
                      selected: 'border-amber-500 bg-amber-50 shadow-xs ring-1 ring-amber-500/25',
                      badge: 'bg-amber-100 text-amber-800 border border-amber-200/50',
                      text: 'text-amber-950',
                      pBar: 'bg-amber-500'
                    },
                    {
                      bg: 'bg-rose-50/10 hover:bg-rose-50/30 border-rose-150',
                      selected: 'border-rose-500 bg-rose-50 shadow-xs ring-1 ring-rose-500/25',
                      badge: 'bg-rose-100 text-rose-800 border border-rose-200/50',
                      text: 'text-rose-950',
                      pBar: 'bg-rose-500'
                    },
                    {
                      bg: 'bg-purple-50/10 hover:bg-purple-50/30 border-purple-150',
                      selected: 'border-purple-500 bg-purple-50 shadow-xs ring-1 ring-purple-500/25',
                      badge: 'bg-purple-100 text-purple-800 border border-purple-200/50',
                      text: 'text-purple-950',
                      pBar: 'bg-purple-500'
                    },
                    {
                      bg: 'bg-teal-50/10 hover:bg-teal-50/30 border-teal-150',
                      selected: 'border-teal-500 bg-teal-50 shadow-xs ring-1 ring-teal-500/25',
                      badge: 'bg-teal-100 text-teal-800 border border-teal-200/50',
                      text: 'text-teal-950',
                      pBar: 'bg-teal-500'
                    },
                  ];
                  const currentTheme = themes[index % themes.length];

                  return (
                    <div
                      key={k.id}
                      onClick={() => setSelectedKontrak(k)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                        isSelected ? currentTheme.selected : `${currentTheme.bg} bg-white`
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-mono text-[10px] text-neutral-400 block truncate max-w-[200px]">
                          {k.nomorKontrak}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${currentTheme.badge}`}>
                          {k.terminList.length} Termin
                        </span>
                      </div>

                      <strong className="text-xs font-bold text-neutral-900 block mt-1">{k.penyedia}</strong>
                      
                      <div className="flex justify-between items-center text-xs mt-3">
                        <span className="text-neutral-500 font-medium font-sans">Nilai Kontrak:</span>
                        <strong className={currentTheme.text}>{formatRupiah(k.nilaiKontrak)}</strong>
                      </div>

                      <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                          <span>Serapan Realisasi Fisik / Termin</span>
                          <span className="font-bold text-blue-700">{percentProgress.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${currentTheme.pBar}`} style={{ width: `${Math.min(percentProgress, 100)}%` }} />
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

        {/* Right Panel: Content changes depending on activeTab (Data Kontrak vs Data Pembayaran) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedKontrak ? (
            activeTab === 'kontrak' ? (
              /* ================== SUB HALAMAN: DATA KONTRAK ================== */
              <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-xs space-y-5">
                {/* Header info */}
                <div className="pb-4 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider font-mono">DOKUMEN KONTRAK UTAMA</span>
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

                {/* Contract Detailed Specs */}
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Rincian Nilai Finansial</span>
                      <table className="w-full text-left font-sans">
                        <tbody>
                          <tr className="border-b border-neutral-205/60 py-1">
                            <td className="py-1.5 text-neutral-500">Nilai Kontrak (Pagu)</td>
                            <td className="py-1.5 text-right font-bold text-neutral-900">{formatRupiah(selectedKontrak.nilaiKontrak)}</td>
                          </tr>
                          <tr className="border-b border-neutral-205/60 py-1">
                            <td className="py-1.5 text-neutral-500">Nilai Uang Muka diserahkan</td>
                            <td className="py-1.5 text-right font-bold text-amber-700">{formatRupiah(selectedKontrak.uangMuka)}</td>
                          </tr>
                          <tr className="py-1">
                            <td className="py-1.5 text-neutral-500 font-semibold text-emerald-700">Terbayar (Realisasi)</td>
                            <td className="py-1.5 text-right font-semibold text-emerald-800">
                              {formatRupiah(selectedKontrak.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Keterangan Administrasi</span>
                      <table className="w-full text-left font-sans">
                        <tbody>
                          <tr className="border-b border-neutral-205/60 py-1">
                            <td className="py-1.5 text-neutral-500">Nama Kegiatan</td>
                            <td className="py-1.5 text-right font-bold text-blue-900">{selectedKontrak.namaKegiatan || selectedKontrak.penyedia}</td>
                          </tr>
                          <tr className="border-b border-neutral-205/60 py-1">
                            <td className="py-1.5 text-neutral-500">Jangka Waktu</td>
                            <td className="py-1.5 text-right font-semibold text-neutral-800">{selectedKontrak.jangkaWaktu || '90 Hari Kalender'}</td>
                          </tr>
                          <tr className="border-b border-neutral-205/60 py-1">
                            <td className="py-1.5 text-neutral-500">Unit Organisasi</td>
                            <td className="py-1.5 text-right font-medium text-neutral-700 font-sans truncate max-w-[200px]" title={instansiField.unitOrganisasi}>{instansiField.unitOrganisasi || '-'}</td>
                          </tr>
                          <tr className="py-1">
                            <td className="py-1.5 text-neutral-500">Tanggal Tanda Tangan</td>
                            <td className="py-1.5 text-right font-bold text-neutral-800">{selectedKontrak.tanggalKontrak}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Card and Progress Bar */}
                  <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                    <h5 className="font-bold text-blue-900 text-xs uppercase mb-1">Status Penyerapan Kontrak Kerja</h5>
                    <p className="text-[11px] text-neutral-500 mb-3">Realisasi kumulatif fisik & administrasi yang terdaftar di dalam sistem.</p>
                    {(() => {
                      const totalPaid = selectedKontrak.terminList.reduce((sum, t) => sum + t.nilaiPembayaran, 0);
                      const sisa = selectedKontrak.nilaiKontrak - totalPaid;
                      const percentProgress = selectedKontrak.nilaiKontrak > 0 ? (totalPaid / selectedKontrak.nilaiKontrak) * 100 : 0;
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono text-xs text-neutral-600">
                            <span>Faktor Serapan: <strong>{percentProgress.toFixed(2)}%</strong></span>
                            <span>Sisa Anggaran Tersedia: <strong className="text-rose-700">{formatRupiah(sisa)}</strong></span>
                          </div>
                          <div className="h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(percentProgress, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              /* ================== SUB HALAMAN: DATA PEMBAYARAN ================== */
              <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-xs space-y-4">
                {/* Active Contract context header */}
                <div className="pb-3 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-neutral-50/50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">RIWAYAT PEMBAYARAN KONTRAK</span>
                    <strong className="text-xs text-neutral-900 font-sans">{selectedKontrak.penyedia}</strong>
                    <span className="text-[10px] text-neutral-500 font-mono block leading-none mt-0.5">{selectedKontrak.nomorKontrak}</span>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">NILAI PAGU KONTRAK</span>
                    <strong className="text-xs text-neutral-950 font-bold block">{formatRupiah(selectedKontrak.nilaiKontrak)}</strong>
                  </div>
                </div>

                {/* Sub-tabs for Payment: Data Uang Muka vs Data Termin */}
                <div className="flex border-b border-neutral-200 gap-1.5">
                  <button
                    id="tab-payment-uangmuka"
                    onClick={() => setActivePaymentTab('uangmuka')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activePaymentTab === 'uangmuka'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Data Uang Muka
                  </button>
                  <button
                    id="tab-payment-termin"
                    onClick={() => setActivePaymentTab('termin')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activePaymentTab === 'termin'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Data Termin (Termyn)
                  </button>
                </div>

                {/* RENDER CURRENT PAYMENT SUB-TAB */}
                {activePaymentTab === 'uangmuka' ? (
                  /* DATA UANG MUKA */
                  <div className="space-y-4 text-xs">
                    {/* BUTTON BAR PINDAH KE ATAS */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
                      <div className="text-left font-sans">
                        <h5 className="font-bold text-neutral-800 text-xs uppercase tracking-wide">Pendaftaran & Administrasi Keabsahan Uang Muka</h5>
                        <p className="text-[10.5px] text-neutral-500 font-medium">Lengkapi No. & Tgl. berkas kelengkapan pengajuan dana uang muka penyerapan.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsUmModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-xs shrink-0 self-start sm:self-center"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Uang Muka</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Uang muka main KPI */}
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-amber-800 font-extrabold block">Nilai Uang Muka Pokok</span>
                          <h4 className="text-lg font-black text-neutral-900 mt-1">{formatRupiah(selectedKontrak.uangMuka)}</h4>
                          <span className="text-[10px] text-amber-900 font-medium font-sans block mt-1">
                            Sebesar <strong className="font-bold">{formPersenUm.toFixed(1)}%</strong> dari total Kontrak.
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-100/60">
                          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Status Realisasi Uang Muka</span>
                          {selectedKontrak.uangMuka > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold mt-1 text-[11px]">
                              <Check className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full p-0.5 shrink-0" />
                              Telah Disepakati & Cair di Awal
                            </span>
                          ) : (
                            <span className="text-neutral-500 font-medium italic mt-1 block">
                              Tidak Ada Pagu Penyerahan Uang Muka
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Amortization breakdown */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 text-xs">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">Amortisasi (Diberhentikan / Dipotong)</span>
                        {(() => {
                          const totalAmortized = selectedKontrak.terminList.reduce((sum, t) => sum + (t.potonganUangMuka || 0), 0);
                          const sisaAmortisasi = selectedKontrak.uangMuka - totalAmortized;
                          const percentAmortized = selectedKontrak.uangMuka > 0 ? (totalAmortized / selectedKontrak.uangMuka) * 100 : 0;

                          return (
                            <div className="space-y-3 font-sans">
                              <div className="flex justify-between py-1 border-b border-neutral-200">
                                <span className="text-neutral-500">Total Potongan Amortisasi:</span>
                                <strong className="text-neutral-800 font-bold">{formatRupiah(totalAmortized)}</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-neutral-200">
                                <span className="text-neutral-500">Sisa Uang Muka Belum Terbayar:</span>
                                <strong className="text-rose-700 font-bold">{formatRupiah(Math.max(0, sisaAmortisasi))}</strong>
                              </div>

                              <div className="pt-1">
                                <div className="flex justify-between text-[10px] text-neutral-400 mb-1 font-mono">
                                  <span>Progres Pemulihan Uang Muka:</span>
                                  <span className="font-bold text-neutral-700">{percentAmortized.toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(percentAmortized, 100)}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* SUMMARY OF DOWN PAYMENT ADMINISTRATION */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4.5 shadow-xs space-y-4 font-sans text-left">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-neutral-100 pb-3">
                        <div className="text-left">
                          <h5 className="font-bold text-neutral-800 text-xs uppercase tracking-wide">Kelayakan Berkas Uang Muka</h5>
                          <p className="text-[10.5px] text-neutral-500 font-sans font-medium">Informasi kelengkapan berkas pengajuan uang muka penyerapan.</p>
                        </div>
                      </div>

                      {/* Summary Grid of Document Numbers if they exist */}
                      {selectedKontrak.noPermohonanUm || selectedKontrak.noBaUm || selectedKontrak.noJaminanUm ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-50/55 p-3 rounded-xl border border-neutral-200 text-xs text-left">
                          <div className="p-2.5 bg-white rounded-lg shadow-2xs border border-neutral-150">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase block">1. Permohonan Rekanan</span>
                            <span className="font-bold text-neutral-800 block truncate mt-0.5" title={selectedKontrak.noPermohonanUm || 'Belum diinput'}>
                              {selectedKontrak.noPermohonanUm || '-'}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">{selectedKontrak.tglPermohonanUm || '-'}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg shadow-2xs border border-neutral-150">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase block">2. Rekomendasi PPTK</span>
                            <span className="font-bold text-neutral-800 block truncate mt-0.5" title={selectedKontrak.noSuratPptkUm || 'Belum diinput'}>
                              {selectedKontrak.noSuratPptkUm || '-'}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">{selectedKontrak.tglSuratPptkUm || '-'}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg shadow-2xs border border-neutral-150">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase block">6. BA Uang Muka</span>
                            <span className="font-bold text-neutral-800 block truncate mt-0.5" title={selectedKontrak.noBaUm || 'Belum diinput'}>
                              {selectedKontrak.noBaUm || '-'}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">{selectedKontrak.tglBaUm || '-'}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg shadow-2xs border border-amber-200 bg-amber-50/20">
                            <span className="text-[9px] font-extrabold text-amber-800 uppercase block">8. Jaminan Uang Muka</span>
                            <span className="font-bold text-amber-950 block truncate mt-0.5" title={selectedKontrak.noJaminanUm || 'Belum diinput'}>
                              {selectedKontrak.noJaminanUm || '-'}
                            </span>
                            <span className="text-[9px] text-amber-800 font-mono mt-0.5 block">{selectedKontrak.tglJaminanUm || '-'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-neutral-300 rounded-xl bg-neutral-50 flex flex-col items-center justify-center space-y-1">
                          <p className="text-[11px] text-neutral-500 italic">Belum ada berkas administrasi uang muka yang terdaftar.</p>
                          <p className="text-[9.5px] text-neutral-450">Silakan klik tombol "Tambah Uang Muka" untuk mengisi atau merinci berkas kelayakan.</p>
                        </div>
                      )}
                    </div>

                    {/* Timeline of deductions */}
                    <div className="border border-neutral-150 rounded-xl overflow-hidden shadow-xs bg-white">
                      <div className="bg-neutral-50 p-3 border-b border-neutral-150">
                        <h5 className="font-bold text-neutral-700 text-xs uppercase tracking-wide">Daftar Potongan Amortisasi per Termin</h5>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200 text-left">
                          <thead className="bg-neutral-50 text-[10px] font-bold text-neutral-500 uppercase">
                            <tr>
                              <th className="px-4 py-2">Nomor BAPP</th>
                              <th className="px-4 py-2 text-center">Termin</th>
                              <th className="px-4 py-2">Tanggal Realisasi</th>
                              <th className="px-4 py-2 text-right">Potongan Uang Muka</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {selectedKontrak.terminList.filter(t => t.potonganUangMuka > 0).length > 0 ? (
                              selectedKontrak.terminList
                                .filter(t => t.potonganUangMuka > 0)
                                .map(t => (
                                  <tr key={t.id} className="hover:bg-neutral-50/50">
                                    <td className="px-4 py-2.5 font-mono font-bold text-neutral-800">{t.nomorBAPP}</td>
                                    <td className="px-4 py-2.5 text-center font-bold">Ke-{t.terminKe}</td>
                                    <td className="px-4 py-2.5 text-neutral-500">{t.tanggalBAPP}</td>
                                    <td className="px-4 py-2.5 text-right font-mono text-rose-600 font-bold">-{formatRupiah(t.potonganUangMuka)}</td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center py-6 text-neutral-400 font-normal italic">
                                  Belum ada potongan amortisasi uang muka yang terekam pada termin ini.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* DATA TERMIN (TERMYN) */
                  <div className="space-y-4">
                    {/* Determin history title and button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">Histori Termin Pembayaran (BAPP)</h4>
                        <p className="text-[10px] text-neutral-500">Dapat ditambah bertahap apabila termin pembayaran lebih dari 1 kali berkala.</p>
                      </div>
                      <button
                        id="btn-add-termin"
                        onClick={openAddTerminModal}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Termin Baru
                      </button>
                    </div>

                    {/* BAPP Tables */}
                    <div className="overflow-x-auto border border-neutral-100 rounded-lg shadow-xs bg-white">
                      <table className="min-w-full divide-y divide-neutral-200 text-left">
                        <thead className="bg-neutral-50/70 text-[10px] uppercase font-bold text-neutral-500">
                          <tr>
                            <th className="px-4 py-2 bg-neutral-150 text-center">Termin</th>
                            <th className="px-4 py-2">Nomor BAPP / Tanggal</th>
                            <th className="px-4 py-2">Faktor Bayar (Bruto)</th>
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
                                      className="p-1 px-2 border border-blue-100 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center text-[10px] font-bold"
                                      title="Buka Blanko BAPP Resmi"
                                    >
                                      Cetak PDF
                                    </button>
                                    {currentUserRole === 'Admin' && (
                                      <button
                                        id={`btn-del-termin-${t.id}`}
                                        onClick={() => handleDeleteTermin(t.id, t.nomorBAPP)}
                                        className="p-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors text-[10px]"
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
                                Belum ada termin penarikan BAPP yang diajukan untuk kontrak ini. Klik "+ Tambah Termin Baru" untuk membuat termin penarikan cicilan/progress berkala.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="bg-white border rounded-xl p-10 text-center text-neutral-400">
              <HelpCircle className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
              <p className="font-bold text-sm">Silakan pilih kontrak di panel kiri untuk mengelola BAPP Termin maupun data pembayaran.</p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP KONTRAK INPUT/EDIT MODAL */}
      {isKontrakModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={() => setIsKontrakModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-5xl w-full z-10 overflow-hidden animate-fade-in font-sans flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-100 animate-pulse" />
                <div>
                  <h3 className="font-bold tracking-tight text-sm uppercase">
                    {editingKontrak ? 'Edit Detail Berkas Kontrak Kerja' : 'Pendaftaran Dokumen Kontrak Baru'}
                  </h3>
                  <p className="text-[10px] text-blue-150">Lengkapi data jaminan rekanan, pejabat pelaksana & dokumen penunjangan.</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsKontrakModalOpen(false)} className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Form containing the split layout */}
            <form onSubmit={handleSaveKontrak} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex overflow-hidden">
                {/* SUB PAGES - SIDEBAR LEFT PANEL */}
                <div className="w-64 border-r border-neutral-200 bg-neutral-50/80 p-4.5 flex flex-col gap-1 shrink-0">
                  <div className="mb-3.5 px-2">
                    <span className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider block">Menu Sub Halaman</span>
                  </div>

                  {/* Tab 1: Data Kontrak Utama */}
                  <button
                    type="button"
                    onClick={() => setPopupActiveTab('kontrak')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                      popupActiveTab === 'kontrak'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <span className="block leading-none">1. Kontrak Utama</span>
                      <span className={`text-[8px] font-normal block ${popupActiveTab === 'kontrak' ? 'text-blue-200' : 'text-neutral-400'}`}>Nilai, SPPBJ, SPMK, SPL</span>
                    </div>
                  </button>

                  {/* Tab 2: Data Rekanan */}
                  <button
                    type="button"
                    onClick={() => setPopupActiveTab('rekanan')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                      popupActiveTab === 'rekanan'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <Landmark className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <span className="block leading-none">2. Data Rekanan</span>
                      <span className={`text-[8px] font-normal block ${popupActiveTab === 'rekanan' ? 'text-blue-200' : 'text-neutral-400'}`}>Penyedia, Jaminan, Bank</span>
                    </div>
                  </button>

                  {/* Tab 3: Data Pejabat */}
                  <button
                    type="button"
                    onClick={() => setPopupActiveTab('pejabat')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                      popupActiveTab === 'pejabat'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <span className="block leading-none">3. Data Pejabat</span>
                      <span className={`text-[8px] font-normal block ${popupActiveTab === 'pejabat' ? 'text-blue-200' : 'text-neutral-400'}`}>KPA, PPTK, Bendahara</span>
                    </div>
                  </button>

                  <div className="mt-auto bg-amber-50 p-3 rounded-xl border border-amber-200/60 font-sans">
                    <div className="flex gap-1.5 text-amber-800 mb-1">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wide">Validasi Form</span>
                    </div>
                    <p className="text-[9px] text-amber-700 leading-normal">
                      Field bertanda (*) di halaman Kontrak Utama bersifat wajib diisi sebelum menyimpan berkas.
                    </p>
                  </div>
                </div>

                {/* FORM VIEW CONTROLLER - RIGHT PANEL CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 bg-white max-h-[64vh]">
                  
                  {/* TAB 1: DATA KONTRAK UTAMA */}
                  {popupActiveTab === 'kontrak' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-blue-50/50 p-4 border border-blue-105 rounded-xl mb-2">
                        <h4 className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">Informasi Dokumen Kontrak & Nilai Pekerjaan</h4>
                        <p className="text-[10px] text-neutral-500 font-sans">Silakan pilih master data sub kegiatan untuk mengikat pagu anggaran konstruksi daerah.</p>
                      </div>

                      {/* Nama Kegiatan */}
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Nama Kegiatan (dari Sub Kegiatan)*</label>
                        <select
                          required
                          value={formNamaKegiatan}
                          onChange={(e) => {
                            const selectedVal = e.target.value;
                            setFormNamaKegiatan(selectedVal);
                            
                            // Auto-set matching budget pagu
                            const matched = masterDataItems.find(m => m.subKegiatan === selectedVal);
                            if (matched) {
                              setFormNilaiKtr(matched.pagu);
                            }
                          }}
                          className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium"
                        >
                          <option value="">-- Pilih Sub Kegiatan --</option>
                          {masterDataItems.map((m) => (
                            <option key={m.id} value={m.subKegiatan}>
                              {m.subKegiatan} (Pagu: {formatRupiah(m.pagu)})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* No Kontrak & Tanggal */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">No. Kontrak *</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 602/092/PUPR/KTR-JALAN/2026"
                            value={formNoKtr}
                            onChange={(e) => setFormNoKtr(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-semibold text-neutral-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Tgl. Kontrak *</label>
                          <input
                            type="date"
                            required
                            value={formTglKtr}
                            onChange={(e) => setFormTglKtr(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-semibold text-neutral-800"
                          />
                        </div>
                      </div>

                      {/* Jangka Waktu & Nilai Kontrak */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Jangka Waktu Pelaksanaan *</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 90 Hari Kalender"
                            value={formJangkaWaktu}
                            onChange={(e) => setFormJangkaWaktu(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 text-neutral-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Nilai Kontrak *</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-bold">Rp</span>
                            <input
                              type="number"
                              required
                              placeholder="Contoh: 1200000000"
                              value={formNilaiKtr}
                              onChange={(e) => setFormNilaiKtr(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full text-xs pl-8 pr-3 py-2.5 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-extrabold text-blue-900"
                            />
                          </div>
                          {formNamaKegiatan && (() => {
                            const matched = masterDataItems.find(m => m.subKegiatan === formNamaKegiatan);
                            if (matched) {
                              return (
                                <p className="text-[9px] text-neutral-400 mt-1">
                                  Referansi Pagu Murni: <strong>{formatRupiah(matched.pagu)}</strong>
                                </p>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* SUB-SECTION: SPPBJ, SPMK, SPL */}
                      <div className="border-t border-neutral-100 pt-4 mt-2">
                        <h4 className="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-3 block">Surat & Kontrak Pendukung (SPPBJ, SPMK, SPL)</h4>
                        
                        <div className="space-y-3.5">
                          {/* SPPBJ */}
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                            <span className="text-[11px] font-black text-neutral-700 block mb-2">Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nomor SPPBJ</label>
                                <input
                                  type="text"
                                  placeholder="Contoh: 027/103/SPPBJ/PUPR/2026"
                                  value={formNoSppbj}
                                  onChange={(e) => setFormNoSppbj(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Tanggal SPPBJ</label>
                                <input
                                  type="date"
                                  value={formTglSppbj}
                                  onChange={(e) => setFormTglSppbj(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500 text-neutral-700"
                                />
                              </div>
                            </div>
                          </div>

                          {/* SPMK */}
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                            <span className="text-[11px] font-black text-neutral-700 block mb-2">Surat Perintah Mulai Kerja (SPMK)</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nomor SPMK</label>
                                <input
                                  type="text"
                                  placeholder="Contoh: 602/115/SPMK/PUPR/2026"
                                  value={formNoSpmk}
                                  onChange={(e) => setFormNoSpmk(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Tanggal SPMK</label>
                                <input
                                  type="date"
                                  value={formTglSpmk}
                                  onChange={(e) => setFormTglSpmk(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500 text-neutral-700"
                                />
                              </div>
                            </div>
                          </div>

                          {/* SPL */}
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                            <span className="text-[11px] font-black text-neutral-700 block mb-2">Surat Perintah Kerja / Lapangan (SPL)</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nomor SPL</label>
                                <input
                                  type="text"
                                  placeholder="Contoh: 602/115/SPL-URBAN/2026"
                                  value={formNoSpl}
                                  onChange={(e) => setFormNoSpl(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Tanggal SPL</label>
                                <input
                                  type="date"
                                  value={formTglSpl}
                                  onChange={(e) => setFormTglSpl(e.target.value)}
                                  className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 bg-white rounded-md outline-none focus:border-blue-500 text-neutral-700"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DATA REKANAN */}
                  {popupActiveTab === 'rekanan' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xl mb-2">
                        <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-0.5">Identitas Badan Usaha & Rekanan Lapangan</h4>
                        <p className="text-[10px] text-neutral-500">Formulir data perusahaan penyedia, NPWP, Bank, serta berkas jaminan pengadaan.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Nama Perusahaan */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Nama Perusahaan Rekanan / CV / PT</label>
                          <input
                            type="text"
                            placeholder="Contoh: PT. Wijaya Konstruksi Pratama"
                            value={formRekananNamaPerusahaan}
                            onChange={(e) => setFormRekananNamaPerusahaan(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 text-neutral-800"
                          />
                        </div>

                        {/* Nama Pengusaha */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Nama Pengusaha / Direktur Utama</label>
                          <input
                            type="text"
                            placeholder="Contoh: Ir. H. Ahmad Gozali"
                            value={formRekananNamaPengusaha}
                            onChange={(e) => setFormRekananNamaPengusaha(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 text-neutral-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Jabatan */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Jabatan Pengusaha</label>
                          <input
                            type="text"
                            placeholder="Contoh: Direktur Utama / Kuasa Direktur"
                            value={formRekananJabatan}
                            onChange={(e) => setFormRekananJabatan(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 text-neutral-800"
                          />
                        </div>

                        {/* NPWP */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">NPWP Perusahaan</label>
                          <input
                            type="text"
                            placeholder="Contoh: 01.234.567.8-901.000"
                            value={formRekananNpwp}
                            onChange={(e) => setFormRekananNpwp(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-mono text-neutral-800"
                          />
                        </div>
                      </div>

                      {/* Alamat */}
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Alamat Kantor Rekanan</label>
                        <textarea
                          placeholder="Contoh: Jl. Diponegoro No. 45 Cabang Baru, Kota Jakarta Pusat"
                          value={formRekananAlamat}
                          onChange={(e) => setFormRekananAlamat(e.target.value)}
                          rows={2}
                          className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 resize-none font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Faktur Pajak */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Faktur Pajak (Kode / No. Seri)</label>
                          <input
                            type="text"
                            placeholder="Contoh: 010.000-26.12345678"
                            value={formRekananFakturPajak}
                            onChange={(e) => setFormRekananFakturPajak(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 text-neutral-800"
                          />
                        </div>

                        {/* Rekening Bank */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Informasi Perbankan (Nama Bank & No Rekening)</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Nama Bank (e.g. Bank Jatim)"
                              value={formRekananBankNama}
                              onChange={(e) => setFormRekananBankNama(e.target.value)}
                              className="w-full text-xs px-2.5 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Nomor Rekening"
                              value={formRekananNoRekening}
                              onChange={(e) => setFormRekananNoRekening(e.target.value)}
                              className="w-full text-xs px-2.5 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Jaminan Pelaksanaan */}
                      <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-xl mt-2">
                        <h5 className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide mb-2 block">Informasi Jaminan Pelaksanaan</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-1">Nomor Surat Jaminan Pelaksanaan</label>
                            <input
                              type="text"
                              placeholder="Contoh: BG/9021/103/VI/2026"
                              value={formRekananNoJaminanPelaksanaan}
                              onChange={(e) => setFormRekananNoJaminanPelaksanaan(e.target.value)}
                              className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white rounded-lg outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-1">Tanggal Terbit Jaminan</label>
                            <input
                              type="date"
                              value={formRekananTglJaminanPelaksanaan}
                              onChange={(e) => setFormRekananTglJaminanPelaksanaan(e.target.value)}
                              className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white rounded-lg outline-none focus:border-blue-500 text-neutral-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DATA PEJABAT */}
                  {popupActiveTab === 'pejabat' && (
                    <div className="space-y-5 animate-fade-in pb-4">
                      <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl mb-2">
                        <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-0.5">Penetapan Pejabat Pelaksana Anggaran (KPA, PPTK, Bendahara)</h4>
                        <p className="text-[10px] text-neutral-500">Lengkapi NIP & Pangkat Pengesah Dokumen SPJ/BAPP agar blanko tanda tangan valid secara hukum.</p>
                      </div>

                      {/* 1. KPA */}
                      <div className="p-4.5 border border-neutral-200 rounded-xl bg-white shadow-xs">
                        <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                          <span className="text-[11px] font-extrabold text-neutral-800 uppercase tracking-wider">Kuasa Pengguna Anggaran (KPA)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nama Lengkap KPA</label>
                            <input
                              type="text"
                              placeholder="Nama KPA"
                              value={formKpaNama}
                              onChange={(e) => setFormKpaNama(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">NIP (Nomor Induk Pegawai)</label>
                            <input
                              type="text"
                              placeholder="19xxxxxxxxxxxxxx"
                              value={formKpaNip}
                              onChange={(e) => setFormKpaNip(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Pangkat / Golongan</label>
                            <input
                              type="text"
                              placeholder="Pembina, IV/a"
                              value={formKpaPangkatGolongan}
                              onChange={(e) => setFormKpaPangkatGolongan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Jabatan Struktur</label>
                            <input
                              type="text"
                              placeholder="Kepala Bidang Sarana PUPR"
                              value={formKpaJabatan}
                              onChange={(e) => setFormKpaJabatan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. PPTK */}
                      <div className="p-4.5 border border-neutral-200 rounded-xl bg-white shadow-xs">
                        <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
                          <div className="w-2.5 h-2.5 bg-emerald-580 rounded-full" />
                          <span className="text-[11px] font-extrabold text-neutral-800 uppercase tracking-wider">Pejabat Pelaksana Teknis Kegiatan (PPTK)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nama Lengkap PPTK</label>
                            <input
                              type="text"
                              placeholder="Nama PPTK"
                              value={formPptkNama}
                              onChange={(e) => setFormPptkNama(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">NIP (Nomor Induk Pegawai)</label>
                            <input
                              type="text"
                              placeholder="19xxxxxxxxxxxxxx"
                              value={formPptkNip}
                              onChange={(e) => setFormPptkNip(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Pangkat / Golongan</label>
                            <input
                              type="text"
                              placeholder="Penata, III/c"
                              value={formPptkPangkatGolongan}
                              onChange={(e) => setFormPptkPangkatGolongan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Jabatan Struktur</label>
                            <input
                              type="text"
                              placeholder="PPTK Seksi Pemeliharaan PUPR"
                              value={formPptkJabatan}
                              onChange={(e) => setFormPptkJabatan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Bendahara */}
                      <div className="p-4.5 border border-neutral-200 rounded-xl bg-white shadow-xs">
                        <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                          <span className="text-[11px] font-extrabold text-neutral-800 uppercase tracking-wider">Bendahara Pengeluaran Dinas</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Nama Lengkap Bendahara</label>
                            <input
                              type="text"
                              placeholder="Nama Bendahara"
                              value={formBendaharaNama}
                              onChange={(e) => setFormBendaharaNama(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">NIP (Nomor Induk Pegawai)</label>
                            <input
                              type="text"
                              placeholder="19xxxxxxxxxxxxxx"
                              value={formBendaharaNip}
                              onChange={(e) => setFormBendaharaNip(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Pangkat / Golongan</label>
                            <input
                              type="text"
                              placeholder="Penata Muda, III/a"
                              value={formBendaharaPangkatGolongan}
                              onChange={(e) => setFormBendaharaPangkatGolongan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-neutral-500 block mb-0.5">Jabatan Struktur</label>
                            <input
                              type="text"
                              placeholder="Bendahara Pengeluaran Dinas PUPR"
                              value={formBendaharaJabatan}
                              onChange={(e) => setFormBendaharaJabatan(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Shared Footer across tabs */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-200 bg-neutral-50 shrink-0">
                <span className="text-[10px] text-neutral-400 font-medium">Lengkapi seluruh sub halaman sebelum melakukan kompilasi data.</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsKontrakModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Kontrak</span>
                  </button>
                </div>
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
                    <span className="text-neutral-500">Referensi Kontrak Kerja:</span>
                    <strong className="text-neutral-900 font-mono">{printBappItem.kontrak.nomorKontrak}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tanggal Perjanjian Kontrak:</span>
                    <strong className="text-neutral-800">{printBappItem.kontrak.tanggalKontrak}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Nama Kegiatan / Sub Kegiatan:</span>
                    <strong className="text-blue-900">{printBappItem.kontrak.namaKegiatan || printBappItem.kontrak.penyedia}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Jangka Waktu Pelaksanaan:</span>
                    <strong className="text-neutral-800">{printBappItem.kontrak.jangkaWaktu || '90 Hari Kalender'}</strong>
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

      {/* MODAL PENDAFTARAN & ADMINISTRASI KEABSAHAN UANG MUKA */}
      {isUmModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setIsUmModalOpen(false)} />
          
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-4xl w-full z-10 my-8 overflow-hidden flex flex-col animate-scale-up font-sans">
            {/* Header */}
            <div className="bg-neutral-900 px-5 py-4 flex justify-between items-center text-white shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  Pendaftaran & Administrasi Keabsahan Uang Muka
                </h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">Lengkapi data parameter dan nomor/tanggal berkas kelayakan uang muka.</p>
              </div>
              <button 
                onClick={() => setIsUmModalOpen(false)} 
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content Scroller */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5 bg-neutral-50/50">
              {/* Parameter & Info Box */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 p-4.5 rounded-xl border border-blue-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-2/5 text-left">
                  <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                    % Persentase Uang Muka *
                  </label>
                  <div className="relative max-w-[200px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formPersenUm}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setFormPersenUm(val);
                      }}
                      className="w-full text-sm font-extrabold px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      placeholder="20"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-neutral-400">%</span>
                  </div>
                  <p className="text-[8.5px] text-neutral-500 mt-1 font-medium">Sesuai aturan, maksimum penarikan senilai 20% s/d 30% dari nilai kontrak.</p>
                </div>
                
                <div className="w-full md:w-3/5 flex flex-col justify-end text-left md:text-right font-sans border-t md:border-t-0 pt-3 md:pt-0 border-neutral-200">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-extrabold block">Hasil Perhitungan Uang Muka</span>
                  <div className="text-xs mt-0.5 text-neutral-600">
                    Nilai Pagu <span className="font-mono font-bold">{formatRupiah(selectedKontrak?.nilaiKontrak || 0)}</span> &times; <strong className="text-neutral-800 font-mono font-black">{formPersenUm}%</strong>
                  </div>
                  <div className="text-xl font-black text-blue-700 font-mono mt-1">
                    {formatRupiah((selectedKontrak?.nilaiKontrak || 0) * (formPersenUm / 100))}
                  </div>
                  <span className="text-[9px] text-neutral-400 italic">(Faktur pencairan pertama yang diterbitkan kepada rekanan/penyedia)</span>
                </div>
              </div>

              {/* Grid 8 Documents */}
              <div>
                <h4 className="text-[11px] font-black text-neutral-800 uppercase tracking-wider mb-3 block border-b border-neutral-200 pb-1.5 text-left">
                  Kelengkapan Berkas Administrasi Penyaluran
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-left">
                  
                  {/* 1. Permohonan */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      1. Permohonan Rekanan / Penyedia
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Permohonan</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat"
                          value={formNoPermohonanUm}
                          onChange={(e) => setFormNoPermohonanUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Permohonan</label>
                        <input
                          type="date"
                          value={formTglPermohonanUm}
                          onChange={(e) => setFormTglPermohonanUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Surat PPTK */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      2. Surat Rekomendasi PPTK
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Surat PPTK</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat PPTK"
                          value={formNoSuratPptkUm}
                          onChange={(e) => setFormNoSuratPptkUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Surat PPTK</label>
                        <input
                          type="date"
                          value={formTglSuratPptkUm}
                          onChange={(e) => setFormTglSuratPptkUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Surat KPA */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      3. Surat Keputusan KPA
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Surat KPA</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat KPA"
                          value={formNoKpaUm}
                          onChange={(e) => setFormNoKpaUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Surat KPA</label>
                        <input
                          type="date"
                          value={formTglKpaUm}
                          onChange={(e) => setFormTglKpaUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Pernyataan Rekanan */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      4. Surat Pernyataan Rekanan
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Pernyataan Rekanan</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat Pernyataan"
                          value={formNoPernyataanRekananUm}
                          onChange={(e) => setFormNoPernyataanRekananUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Surat</label>
                        <input
                          type="date"
                          value={formTglPernyataanRekananUm}
                          onChange={(e) => setFormTglPernyataanRekananUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Pernyataan KPA */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      5. Surat Pernyataan KPA
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Pernyataan KPA</label>
                        <input
                          type="text"
                          placeholder="Nomor Pernyataan"
                          value={formNoPernyataanKpaUm}
                          onChange={(e) => setFormNoPernyataanKpaUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Pernyataan</label>
                        <input
                          type="date"
                          value={formTglPernyataanKpaUm}
                          onChange={(e) => setFormTglPernyataanKpaUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Berita Acara */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      6. Berita Acara (BA) Uang Muka
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. Berita Acara</label>
                        <input
                          type="text"
                          placeholder="Nomor Berita Acara"
                          value={formNoBaUm}
                          onChange={(e) => setFormNoBaUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Berita Acara</label>
                        <input
                          type="date"
                          value={formTglBaUm}
                          onChange={(e) => setFormTglBaUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. SPP */}
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-neutral-700 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1 w-full">
                      7. Surat Permintaan Pembayaran (SPP)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">No. SPP</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat SPP"
                          value={formNoSppUm}
                          onChange={(e) => setFormNoSppUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-medium bg-neutral-50/30"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-neutral-450 block mb-0.5">Tanggal Surat SPP</label>
                        <input
                          type="date"
                          value={formTglSppUm}
                          onChange={(e) => setFormTglSppUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded-md outline-none focus:border-blue-500 font-mono text-neutral-700 bg-neutral-50/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 8. Jaminan Uang Muka */}
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 shadow-2xs text-left">
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block mb-2 border-b border-amber-200 pb-1 w-full text-left">
                      8. Surat Jaminan Uang Muka
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-amber-900 block mb-0.5">No. Jaminan Uang Muka</label>
                        <input
                          type="text"
                          placeholder="Nomor Surat Jaminan"
                          value={formNoJaminanUm}
                          onChange={(e) => setFormNoJaminanUm(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-amber-305 bg-white rounded-md outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-amber-900 block mb-0.5">Tanggal Jaminan Uang Muka</label>
                        <input
                          type="date"
                          value={formTglJaminanUm}
                          onChange={(e) => setFormTglJaminanUm(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-amber-305 bg-white rounded-md outline-none focus:border-amber-500 font-mono text-neutral-700"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (selectedKontrak) {
                    setFormPersenUm(selectedKontrak.persenUangMuka !== undefined ? selectedKontrak.persenUangMuka : 20);
                    setFormNoPermohonanUm(selectedKontrak.noPermohonanUm || '');
                    setFormTglPermohonanUm(selectedKontrak.tglPermohonanUm || '');
                    setFormNoSuratPptkUm(selectedKontrak.noSuratPptkUm || '');
                    setFormTglSuratPptkUm(selectedKontrak.tglSuratPptkUm || '');
                    setFormNoKpaUm(selectedKontrak.noKpaUm || '');
                    setFormTglKpaUm(selectedKontrak.tglKpaUm || '');
                    setFormNoPernyataanRekananUm(selectedKontrak.noPernyataanRekananUm || '');
                    setFormTglPernyataanRekananUm(selectedKontrak.tglPernyataanRekananUm || '');
                    setFormNoPernyataanKpaUm(selectedKontrak.noPernyataanKpaUm || '');
                    setFormTglPernyataanKpaUm(selectedKontrak.tglPernyataanKpaUm || '');
                    setFormNoBaUm(selectedKontrak.noBaUm || '');
                    setFormTglBaUm(selectedKontrak.tglBaUm || '');
                    setFormNoSppUm(selectedKontrak.noSppUm || '');
                    setFormTglSppUm(selectedKontrak.tglSppUm || '');
                    setFormNoJaminanUm(selectedKontrak.noJaminanUm || '');
                    setFormTglJaminanUm(selectedKontrak.tglJaminanUm || '');
                  }
                }}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 font-bold hover:text-neutral-900 transition-all cursor-pointer text-xs"
              >
                Reset Perubahan
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUmModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-bold rounded-lg transition-all text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveUangMukaData}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Simpan Administrasi Uang Muka</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
