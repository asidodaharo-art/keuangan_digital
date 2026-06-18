/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Menu, 
  ChevronLeft, 
  LayoutDashboard, 
  Grid, 
  FileText, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  GraduationCap, 
  Home, 
  User as UserIcon,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

import { Instansi, User, MasterData, SPJRutin, Kontrak, BAPP } from './types';
import { 
  defaultInstansi, 
  defaultUsers, 
  defaultMasterData, 
  defaultSPJRutin, 
  defaultKontrak 
} from './data';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MasterDataPage from './components/MasterDataPage';
import SPJRutinPage from './components/SPJRutinPage';
import BAPPPage from './components/BAPPPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  // Session Persistence Simulator
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'Landing' | 'Dashboard' | 'MasterData' | 'SPJRutin' | 'BAPP' | 'Settings'>('Landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // States
  const [instansi, setInstansi] = useState<Instansi>(defaultInstansi);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [masterData, setMasterData] = useState<MasterData[]>(defaultMasterData);
  const [spjList, setSpjList] = useState<SPJRutin[]>(defaultSPJRutin);
  const [kontrakList, setKontrakList] = useState<Kontrak[]>(defaultKontrak);

  // Custom inline notification simulator (SweetAlert2 replica)
  const [sweetAlert, setSweetAlert] = useState<{
    show: boolean;
    title: string;
    text: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Auto-login simulator on initial load or persist via localStorage
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('bapp_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser) as User;
      setCurrentUser(parsed);
      setActiveTab('Dashboard');
    }
  }, []);

  const triggerAlert = (title: string, text: string, type: 'success' | 'warning' | 'error') => {
    setSweetAlert({ show: true, title, text, type });
    setTimeout(() => {
      setSweetAlert(null);
    }, 3500);
  };

  const handleLogin = (role: 'Admin' | 'User') => {
    const matched = users.find(u => u.role === role && u.status === 'Aktif');
    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem('bapp_current_user', JSON.stringify(matched));
      setActiveTab('Dashboard');
      triggerAlert('Login Berhasil!', `Selamat datang kembali, ${matched.namaLengkap} (${matched.role})`, 'success');
    } else {
      triggerAlert('Login Gagal', 'Akun dibekukan atau tidak ditemukan.', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bapp_current_user');
    setActiveTab('Landing');
    triggerAlert('Berhasil Keluar', 'Sesi login Anda sudah ditutup.', 'success');
  };

  // CRUD callbacks Master Data
  const handleAddMaster = (newData: Omit<MasterData, 'id'>) => {
    const item: MasterData = {
      ...newData,
      id: 'M' + (masterData.length + 10)
    };
    setMasterData([...masterData, item]);
    triggerAlert('Berhasil!', 'Rekening anggaran baru sukses didaftarkan.', 'success');
  };

  const handleEditMaster = (updated: MasterData) => {
    setMasterData(masterData.map(m => m.id === updated.id ? updated : m));
    triggerAlert('Berhasil!', 'Data Rekening sukses diperbaharui.', 'success');
  };

  const handleDeleteMaster = (id: string) => {
    setMasterData(masterData.filter(m => m.id !== id));
    triggerAlert('Terhapus!', 'Data Rekening sudah dihapus dari sistem.', 'success');
  };

  const handleImportMaster = (importedList: Omit<MasterData, 'id'>[]) => {
    const startIdx = masterData.length + 10;
    const mapped = importedList.map((x, i) => ({
      ...x,
      id: 'M' + (startIdx + i)
    }));
    setMasterData([...masterData, ...mapped]);
    triggerAlert('Berhasil Impor!', `${importedList.length} rekening sukses dimasukkan.`, 'success');
  };

  // CRUD callbacks SPJ Rutin
  const handleAddSpj = (newData: Omit<SPJRutin, 'id'>) => {
    const item: SPJRutin = {
      ...newData,
      id: 'S' + (spjList.length + 10)
    };
    setSpjList([...spjList, item]);
    triggerAlert('Berhasil SPJ!', 'SPJ Rutin sukses terekam & siap cetak.', 'success');
  };

  const handleEditSpj = (updated: SPJRutin) => {
    setSpjList(spjList.map(s => s.id === updated.id ? updated : s));
    triggerAlert('SPJ Diperbarui!', 'Log rincian barang berhasil disimpan.', 'success');
  };

  const handleDeleteSpj = (id: string) => {
    setSpjList(spjList.filter(s => s.id !== id));
    triggerAlert('Terhapus!', 'Bukti pengadaan SPJ rutin berhasil dibatalkan.', 'success');
  };

  // CRUD callbacks Kontrak & BAPP Termin
  const handleAddKontrak = (newData: Omit<Kontrak, 'id' | 'terminList'>) => {
    const item: Kontrak = {
      ...newData,
      id: 'K' + (kontrakList.length + 10),
      terminList: []
    };
    setKontrakList([...kontrakList, item]);
    triggerAlert('Kontrak Ditambahkan!', 'Berkas kontrak penyedia jasa resmi terekam.', 'success');
  };

  const handleEditKontrak = (updated: Kontrak) => {
    setKontrakList(kontrakList.map(k => k.id === updated.id ? updated : k));
    triggerAlert('Kontrak Diperbarui!', 'Informasi nilai kontrak berhasil disimpan.', 'success');
  };

  const handleDeleteKontrak = (id: string) => {
    setKontrakList(kontrakList.filter(k => k.id !== id));
    triggerAlert('Terhapus!', 'Kontrak & riwayat penarikan berhasil dibersihkan.', 'success');
  };

  // Add BAPP termin
  const handleAddTermin = (kontrakId: string, newBapp: Omit<BAPP, 'id'>) => {
    const updated = kontrakList.map(k => {
      if (k.id === kontrakId) {
        const idList = k.terminList.map(x => Number(x.id.replace('B', '')) || 0);
        const maxVal = idList.length > 0 ? Math.max(...idList) : 0;
        const b: BAPP = {
          ...newBapp,
          id: 'B' + (maxVal + 1)
        };
        return {
          ...k,
          terminList: [...k.terminList, b]
        };
      }
      return k;
    });
    setKontrakList(updated);
    triggerAlert('BAPP Diterbitkan!', 'Form BAPP termin sukses masuk ke rekap anggaran.', 'success');
  };

  const handleDeleteTermin = (kontrakId: string, terminId: string) => {
    const updated = kontrakList.map(k => {
      if (k.id === kontrakId) {
        return {
          ...k,
          terminList: k.terminList.filter(t => t.id !== terminId)
        };
      }
      return k;
    });
    setKontrakList(updated);
    triggerAlert('Termin Dibatalkan!', 'BAPP termin berhasil ditarik.', 'success');
  };

  // CRUD Users Settings
  const handleAddUser = (newData: Omit<User, 'id'>) => {
    const u: User = {
      ...newData,
      id: String(users.length + 10)
    };
    setUsers([...users, u]);
    triggerAlert('User Ditambahkan!', `Developer/Staf ${newData.namaLengkap} ditambahkan.`, 'success');
  };

  const handleEditUser = (updated: User) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    triggerAlert('Data Diperbarui!', `Akun ${updated.username} berhasil disimpan.`, 'success');
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    triggerAlert('User Terhapus!', 'Akses login user dicabut.', 'success');
  };

  const handleResetPassword = (id: string) => {
    // Logic simulated successfully
    triggerAlert('Sukses Reset', 'Password kembali ke 123456.', 'success');
  };

  return (
    <div id="application-container" className="min-h-screen bg-neutral-50 text-neutral-800 font-sans relative antialiased">
      
      {/* 1. SWEETALERT POPUP SIMULATOR */}
      {sweetAlert && (
        <div className="fixed top-5 right-5 z-200 bg-white border border-neutral-200/90 shadow-2xl rounded-2xl p-5 max-w-sm flex items-start gap-3.5 animate-slide-in">
          <div className={`p-2 rounded-full shrink-0 ${
            sweetAlert.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <AlertCircle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-extrabold text-[13px] text-neutral-900 leading-none">{sweetAlert.title}</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-normal">{sweetAlert.text}</p>
          </div>
        </div>
      )}

      {/* 2. TAB ROUTING VIEW CONTROLLER */}
      {activeTab === 'Landing' || !currentUser ? (
        <LandingPage 
          instansi={instansi} 
          onLogin={handleLogin} 
        />
      ) : (
        <div className="flex h-screen relative overflow-hidden w-full">
          
          {/* SIDEBAR: Brilliant Bright Blue Sidebar configured natively (#2196F3 or custom bold blue) */}
          <aside 
            id="app-sidebar"
            className={`bg-blue-600 text-white flex flex-col justify-between shrink-0 transition-all duration-300 relative z-30 h-screen overflow-y-auto ${
              isSidebarCollapsed ? 'w-18' : 'w-64'
            }`}
          >
            {/* Sidebar Top Block with Title */}
            <div>
              <div className="px-5 py-4 border-b border-blue-500/70 flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-white/10 p-1 flex items-center justify-center p-0.5 border border-white/20 select-none">
                      <img src={instansi.logoUrl} alt="Logo" className="w-full h-full object-cover rounded referrerPolicy='no-referrer'" />
                    </div>
                    <div>
                      <span className="block text-xs font-black tracking-normal uppercase text-white leading-3">SIM-BAPP</span>
                      <span className="text-[10px] text-blue-100 font-medium">Internal PUPR</span>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="bg-blue-500 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors cursor-pointer self-center mx-auto"
                >
                  {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Navigation items list */}
              <nav className="p-3.5 space-y-1.5 font-sans">
                {/* 1. Dashboard Tab */}
                <button
                  id="tab-dashboard"
                  onClick={() => setActiveTab('Dashboard')}
                  className={`w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-3.5 transition-all text-left truncate cursor-pointer ${
                    activeTab === 'Dashboard'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-50 hover:bg-white/10'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span>Dashboard Keuangan</span>}
                </button>

                {/* 2. Master Data Tab (View restriction indicators applied) */}
                <button
                  id="tab-master"
                  onClick={() => setActiveTab('MasterData')}
                  className={`w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-between transition-all text-left truncate cursor-pointer ${
                    activeTab === 'MasterData'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <Grid className="w-5 h-5 shrink-0" />
                    {!isSidebarCollapsed && <span>Daftar Master Data</span>}
                  </div>
                  {!isSidebarCollapsed && currentUser.role === 'User' && (
                    <span className="text-[9px] bg-blue-500 px-1.5 py-0.5 rounded text-white tracking-widest uppercase">LIHAT</span>
                  )}
                </button>

                {/* 3. SPJ Rutin Tab */}
                <button
                  id="tab-spj"
                  onClick={() => setActiveTab('SPJRutin')}
                  className={`w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-3.5 transition-all text-left truncate cursor-pointer ${
                    activeTab === 'SPJRutin'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-50 hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span>Rincian SPJ Rutin</span>}
                </button>

                {/* 4. BAPP Tab */}
                <button
                  id="tab-bapp"
                  onClick={() => setActiveTab('BAPP')}
                  className={`w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-3.5 transition-all text-left truncate cursor-pointer ${
                    activeTab === 'BAPP'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-50 hover:bg-white/10'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span>Administrasi BAPP</span>}
                </button>

                {/* 5. Settings Tab (Only visible to Admin role) */}
                {currentUser?.role === 'Admin' && (
                  <button
                    id="tab-settings"
                    onClick={() => setActiveTab('Settings')}
                    className={`w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-between transition-all text-left truncate cursor-pointer ${
                      activeTab === 'Settings'
                        ? 'bg-white text-blue-800 shadow-sm'
                        : 'text-blue-50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <Settings className="w-5 h-5 shrink-0" />
                      {!isSidebarCollapsed && <span>Pengaturan Sistem</span>}
                    </div>
                  </button>
                )}
              </nav>
            </div>

            {/* Sidebar bottom block: Identity and profile */}
            <div className="p-3 border-t border-blue-550 bg-blue-700/50">
              <div className="p-2.5 rounded-xl bg-blue-850/40 text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white uppercase select-none shrink-0 border border-blue-400">
                  {currentUser.namaLengkap.substring(0, 2)}
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate flex-1">
                    <strong className="block text-xs font-bold text-white truncate leading-none">{currentUser.namaLengkap}</strong>
                    <span className="text-[10px] text-blue-200 mt-1 block uppercase font-mono tracking-wider font-extrabold leading-none">
                      {currentUser.role} Account
                    </span>
                  </div>
                )}
              </div>

              <button
                id="btn-sidebar-logout"
                onClick={handleLogout}
                className="w-full text-xs font-bold py-3 px-3 mt-2 rounded-xl text-blue-100 hover:bg-red-650 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {!isSidebarCollapsed && <span>Logout Sesi</span>}
              </button>
            </div>
          </aside>

          {/* MAIN PAGE AREA */}
          <div className="flex-1 flex flex-col h-screen overflow-y-auto max-w-full">
            
            {/* UPPER NAVIGATION BAR HEADER */}
            <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest leading-none">Sistem Administrasi BAPP</span>
                <h1 className="text-sm font-bold text-neutral-900 tracking-tight mt-1">
                  {activeTab === 'Dashboard' && 'Dashboard Monitoring & S-Curve Realisasi Anggaran'}
                  {activeTab === 'MasterData' && 'Rincian Master Program & Alokasi Pagu Anggaran'}
                  {activeTab === 'SPJRutin' && 'Pengisian Surat Pertanggungjawaban (SPJ) Rutin Operasional'}
                  {activeTab === 'BAPP' && 'Pemberkasan Kontrak & Berita Acara Pembayaran Pekerjaan (BAPP)'}
                  {activeTab === 'Settings' && 'Rencana Profil Instansi & Otoritas User Multi-Role'}
                </h1>
              </div>

              {/* Time display and server indicator */}
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-semibold align-middle font-mono mt-1 sm:mt-0">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> PHP 8.3 EMULATION RUNNING
                </span>
                <span>Time: 08:30 WIB</span>
              </div>
            </header>

            {/* TAB BODY INNER CONTROLLER */}
            <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
              {activeTab === 'Dashboard' && (
                <Dashboard 
                  masterList={masterData} 
                  spjList={spjList} 
                  kontrakList={kontrakList} 
                />
              )}
              
              {activeTab === 'MasterData' && (
                <MasterDataPage 
                  masterList={masterData} 
                  onAdd={handleAddMaster} 
                  onEdit={handleEditMaster} 
                  onDelete={handleDeleteMaster} 
                  onImport={handleImportMaster}
                  currentUserRole={currentUser.role}
                />
              )}

              {activeTab === 'SPJRutin' && (
                <SPJRutinPage 
                  spjList={spjList} 
                  instansiField={instansi} 
                  onAdd={handleAddSpj} 
                  onEdit={handleEditSpj} 
                  onDelete={handleDeleteSpj}
                  currentUserRole={currentUser.role}
                />
              )}

              {activeTab === 'BAPP' && (
                <BAPPPage 
                  kontrakList={kontrakList} 
                  instansiField={instansi} 
                  onAddKontrak={handleAddKontrak} 
                  onEditKontrak={handleEditKontrak} 
                  onDeleteKontrak={handleDeleteKontrak} 
                  onAddTermin={handleAddTermin} 
                  onDeleteTermin={handleDeleteTermin}
                  currentUserRole={currentUser.role}
                />
              )}

              {activeTab === 'Settings' && currentUser?.role === 'Admin' && (
                <SettingsPage 
                  instansi={instansi} 
                  onUpdateInstansi={setInstansi} 
                  userList={users} 
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  onResetPassword={handleResetPassword}
                />
              )}
            </main>

            {/* FOOTER */}
            <footer className="py-4 border-t border-neutral-200 text-center text-[11px] text-neutral-400 bg-white">
              <p>&copy; {new Date().getFullYear()} {instansi.nama}. Dioptimalkan untuk InfinityFree Host & MySQL.</p>
              <p className="text-[10px] mt-0.5 text-neutral-300">Aplikasi Pembayaran Berita Acara Pembayaran Pekerjaan Digital.</p>
            </footer>
          </div>

        </div>
      )}
    </div>
  );
}
