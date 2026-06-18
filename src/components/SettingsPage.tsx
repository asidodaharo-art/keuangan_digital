/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Users, Key, Building2, Upload, Trash2, Edit2, RotateCw, Check, X, ShieldAlert } from 'lucide-react';
import { Instansi, User } from '../types';

interface SettingsPageProps {
  instansi: Instansi;
  onUpdateInstansi: (updated: Instansi) => void;
  userList: User[];
  onAddUser: (u: Omit<User, 'id'>) => void;
  onEditUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  onResetPassword: (id: string) => void;
}

export default function SettingsPage({
  instansi,
  onUpdateInstansi,
  userList,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onResetPassword
}: SettingsPageProps) {
  
  // Tab states
  const [activeSubTab, setActiveSubTab] = useState<'Instansi' | 'Users'>('Instansi');

  // Instansi Form states
  const [instansiPemda, setInstansiPemda] = useState(instansi.pemerintahDaerah || '');
  const [instansiUnit, setInstansiUnit] = useState(instansi.unitOrganisasi || '');
  const [instansiNama, setInstansiNama] = useState(instansi.nama);
  const [instansiAlamat, setInstansiAlamat] = useState(instansi.alamat);
  const [instansiEmail, setInstansiEmail] = useState(instansi.email);
  const [instansiTelepon, setInstansiTelepon] = useState(instansi.telepon);
  const [instansiWebsite, setInstansiWebsite] = useState(instansi.website);
  const [instansiLogo, setInstansiLogo] = useState(instansi.logoUrl);

  // Users management states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User form states
  const [formUsername, setFormUsername] = useState('');
  const [formNamaLengkap, setFormNamaLengkap] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Admin' | 'User'>('User');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Submit Instansi Profile modifications
  const handleSaveInstansi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instansiNama || !instansiAlamat) {
      alert('Nama dan Alamat Instansi wajib diisi!');
      return;
    }
    onUpdateInstansi({
      pemerintahDaerah: instansiPemda,
      unitOrganisasi: instansiUnit,
      nama: instansiNama,
      alamat: instansiAlamat,
      email: instansiEmail,
      telepon: instansiTelepon,
      website: instansiWebsite,
      logoUrl: instansiLogo
    });
    alert('Profil instansi induk berhasil diperbarui! Kop Surat di Dokumen SPJ & BAPP akan otomatis mengikuti.');
  };

  // Reset User form fields
  const resetUserForm = () => {
    setFormUsername('');
    setFormNamaLengkap('');
    setFormEmail('');
    setFormRole('User');
    setFormStatus('Aktif');
    setEditingUser(null);
  };

  const openAddUserModal = () => {
    resetUserForm();
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: User) => {
    setEditingUser(u);
    setFormUsername(u.username);
    setFormNamaLengkap(u.namaLengkap);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormStatus(u.status);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername || !formNamaLengkap || !formEmail) {
      alert('Data wajib (*) harus diisi!');
      return;
    }

    if (editingUser) {
      onEditUser({
        id: editingUser.id,
        username: formUsername,
        namaLengkap: formNamaLengkap,
        email: formEmail,
        role: formRole,
        status: formStatus
      });
    } else {
      onAddUser({
        username: formUsername,
        namaLengkap: formNamaLengkap,
        email: formEmail,
        role: formRole,
        status: formStatus
      });
    }

    setIsUserModalOpen(false);
    resetUserForm();
  };

  const handleDeleteUserClick = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin menghapus pengguna "${name}"? Tindakan ini permanen.`)) {
      onDeleteUser(id);
    }
  };

  const handleResetPasswordClick = (id: string, name: string) => {
    onResetPassword(id);
    alert(`Password untuk pengguna "${name}" telah direset kembali ke default: "123456"`);
  };

  return (
    <div id="settings-page-root" className="space-y-6">
      
      {/* Settings Navigation Bar */}
      <div className="border-b border-neutral-200 bg-white p-2.5 rounded-xl border flex flex-wrap gap-2 shadow-xs">
        <button
          onClick={() => setActiveSubTab('Instansi')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'Instansi'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <Building2 className="w-4 h-4" /> Profil Instansi Pemerintah
        </button>
        <button
          onClick={() => setActiveSubTab('Users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'Users'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" /> Manajemen Pengguna (Users)
        </button>
      </div>

      {/* Subtab Contents Profile Instansi */}
      {activeSubTab === 'Instansi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form container */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold uppercase text-neutral-400 tracking-wider mb-4 pb-2 border-b border-neutral-100">
              Konfigurasi Identitas Instansi (Kop Surat)
            </h3>
            
            <form onSubmit={handleSaveInstansi} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Pemerintah Daerah *</label>
                  <input
                    type="text"
                    required
                    value={instansiPemda}
                    onChange={(e) => setInstansiPemda(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Contoh: PEMERINTAH PROVINSI DKI JAKARTA"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Unit Organisasi *</label>
                  <input
                    type="text"
                    required
                    value={instansiUnit}
                    onChange={(e) => setInstansiUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Contoh: DINAS PEKERJAAN UMUM DAN PENATAAN RUANG"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nama Instansi Dinas *</label>
                  <input
                    type="text"
                    required
                    value={instansiNama}
                    onChange={(e) => setInstansiNama(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Alamat Kantor Resmi *</label>
                  <textarea
                    rows={2}
                    required
                    value={instansiAlamat}
                    onChange={(e) => setInstansiAlamat(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Telepon Dinas</label>
                  <input
                    type="text"
                    value={instansiTelepon}
                    onChange={(e) => setInstansiTelepon(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">E-mail Dinas Resmi</label>
                  <input
                    type="email"
                    value={instansiEmail}
                    onChange={(e) => setInstansiEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Website</label>
                  <input
                    type="text"
                    value={instansiWebsite}
                    onChange={(e) => setInstansiWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Simulasi URL Logo / Lambang Pemda</label>
                  <input
                    type="text"
                    value={instansiLogo}
                    onChange={(e) => setInstansiLogo(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm cursor-pointer"
                >
                  Simpan Perubahan Dinas
                </button>
              </div>
            </form>
          </div>

          {/* Explanation panel / Live Preview Kop Surat */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 shadow-xs">
              <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block mb-3">Kop Surat Live Preview</h4>
              
              <div className="bg-white border rounded-lg p-4 font-sans text-center text-black shadow-xs">
                <div className="flex justify-center mb-2">
                  <img src={instansiLogo} alt="Logo" className="w-12 h-12 object-cover rounded shadow-xs referrerPolicy='no-referrer'" />
                </div>
                {instansiPemda && <p className="text-[9px] font-bold uppercase tracking-wide leading-tight mb-0.5">{instansiPemda}</p>}
                {instansiUnit && <p className="text-[9px] font-bold uppercase tracking-wide leading-tight mb-0.5">{instansiUnit}</p>}
                <strong className="text-[10px] leading-tight block font-extrabold uppercase">{instansiNama}</strong>
                <p className="text-[8px] text-neutral-400 mt-1">{instansiAlamat}</p>
                <p className="text-[7px] text-neutral-500">Telp: {instansiTelepon} | Website: {instansiWebsite}</p>
              </div>
              <span className="text-[10px] text-neutral-400 mt-3 block leading-relaxed">
                * Kop surat di atas akan dicangkokkan secara otomatis di atas blanko cetakan SPJ Rutin maupun penarikan BAPP termin pembayaran lapangan!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Contents Users Management */}
      {activeSubTab === 'Users' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase text-neutral-400 tracking-wider">Aparatur Sistem Pengguna (Multi Roles)</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Edit hak akses, reset password akun klerikal bendahara/staf.</p>
            </div>

            <button
              id="btn-add-user"
              onClick={openAddUserModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" /> Tambah Akun Baru
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200 text-left">
              <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500">
                <tr>
                  <th className="px-5 py-3">Nama Pegawai / Email</th>
                  <th className="px-5 py-3">Username Login</th>
                  <th className="px-5 py-3 text-center">Hak Akses Role</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right text-black">Tindakan klerikal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <strong className="text-neutral-800 font-bold block">{u.namaLengkap}</strong>
                      <span className="text-[10px] text-neutral-500 font-mono">{u.email}</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-neutral-700">{u.username}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        u.role === 'Admin' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        u.status === 'Aktif' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-neutral-50 text-neutral-400 border border-neutral-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-reset-pwd-${u.id}`}
                          onClick={() => handleResetPasswordClick(u.id, u.namaLengkap)}
                          className="px-2 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-md transition-colors flex items-center gap-1 font-semibold"
                          title="Reset Password Akun ke Default '123456'"
                        >
                          <RotateCw className="w-3 h-3" /> Reset Pwd
                        </button>
                        <button
                          id={`btn-edit-user-${u.id}`}
                          onClick={() => openEditUserModal(u)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md transition-colors"
                          title="Ubah rincian user"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-del-user-${u.id}`}
                          disabled={userList.length <= 1}
                          onClick={() => handleDeleteUserClick(u.id, u.namaLengkap)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors disabled:opacity-30"
                          title="Hapus user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP MODAL FOR USER ADD / EDIT */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={() => setIsUserModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-md w-full z-10 overflow-hidden animate-fade-in font-sans">
            <div className="bg-blue-600 px-5 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-tight text-sm uppercase">
                {editingUser ? 'Edit Rincian Akun User' : 'Daftarkan User Baru'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-blue-100 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs font-medium">
              <div className="space-y-3.5">
                {/* Username */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: soniputra"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Nama lengkap */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Nama Pegawai Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Soni Setiawan, A.Md."
                    value={formNamaLengkap}
                    onChange={(e) => setFormNamaLengkap(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Alamat Email Kerja *</label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: soni@pupr-daerah.go.id"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Hak Akses Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 bg-white font-bold"
                  >
                    <option value="User">User (Akses Standard SPJ, BAPP, Master)</option>
                    <option value="Admin">Admin (Akses Penuh + Kelola Pengguna)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Status Keaktifan Pegawai *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Non-Aktif / Suspend</option>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
