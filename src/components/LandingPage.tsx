/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, FileText, TrendingUp, Landmark, Award, BookOpen, KeyRound } from 'lucide-react';
import { Instansi } from '../types';

interface LandingPageProps {
  instansi: Instansi;
  onLogin: (role: 'Admin' | 'User') => void;
}

export default function LandingPage({ instansi, onLogin }: LandingPageProps) {
  return (
    <div id="landing-page-root" className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Header */}
      <header id="landing-header" className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-50 flex items-center justify-between p-1 border border-blue-100">
              <img src={instansi.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-md referrerPolicy='no-referrer'" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-900 tracking-tight leading-4">
                {instansi.nama}
              </h1>
              <p className="text-xs text-neutral-500 font-medium">Sistem Keuangan & BAPP Kerja</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#visi-misi" className="text-xs font-semibold text-neutral-600 hover:text-blue-600 px-3 py-2 transition-colors">Visi & Misi</a>
            <a href="#stats" className="text-xs font-semibold text-neutral-600 hover:text-blue-600 px-3 py-2 transition-colors">Statistik</a>
            <button
              id="btn-nav-login"
              onClick={() => {
                const el = document.getElementById('login-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section id="hero" className="relative bg-white py-20 border-b border-neutral-100 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#f0f4f8_1px,transparent_1px),linear-gradient(to_bottom,#f0f4f8_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full w-fit mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" /> Portal Administrasi Pembayaran Digital Resmi
                </span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6">
                  Aplikasi Pembayaran <br />
                  <span className="text-blue-600">Berita Acara Pembayaran Pekerjaan</span> (BAPP)
                </h1>
                <p className="text-neutral-600 text-base leading-relaxed mb-8 max-w-xl">
                  Kelola administrasi pembayaran pekerjaan, Surat Pertanggungjawaban (SPJ) rutin, 
                  kontrak penyedia, termin BAPP, serta pelaporan anggaran secara digital, 
                  akurat, transparan, dan terintegrasi di lingkungan instansi daerah.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#login-section"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md text-sm cursor-pointer"
                  >
                    Mulai Kelola Administrasi
                  </a>
                  <a
                    href="#visi-misi"
                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg transition-all text-sm"
                  >
                    Pelajari Selengkapnya
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div id="hero-card" className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xl relative z-10 transition-all hover:translate-y--1">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-neutral-500">LIVE BUDGET MONITOR</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">PUPR-2026</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-neutral-500 block mb-1">Total Pagu Tersedia (TA 2026)</span>
                      <strong className="text-2xl font-black text-neutral-900">Rp 3,935,000,000</strong>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                        <span>Total Penyerapan Realisasi</span>
                        <span className="font-bold">14.15%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '14.15%' }} />
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 block">Realisasi: Rp 557,375,000</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-[10px] text-neutral-500 block">Belanja Operasi</span>
                        <strong className="text-xs font-bold text-neutral-800">Rp 11,375,000</strong>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-[10px] text-neutral-500 block">Belanja Modal</span>
                        <strong className="text-xs font-bold text-neutral-800">Rp 546,000,000</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-40 h-40 bg-blue-100 rounded-full filter blur-2xl opacity-50 -z-0" />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-emerald-100 rounded-full filter blur-2xl opacity-40 -z-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-12 bg-neutral-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-sm">
                <Landmark className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Instansi Induk</p>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">Dinas PUPR Daerah</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-sm">
                <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Tipe SPJ Rutin</p>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">Operasional & ATK</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-sm">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Termin Kontrak</p>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">Otomatisasi BAPP</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-sm">
                <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Akurasi Perhitungan</p>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">Validasi Saldo 100%</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section id="visi-misi" className="py-16 bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Visi & Misi Keuangan Instansi</h2>
              <p className="text-neutral-500 text-sm mt-3">
                Mendukung stabilitas, keandalan, dan transparansi administrasi pertanggungjawaban fisik dan anggaran secara akuntabel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                <h3 className="text-xl font-bold text-blue-900 mb-3 block">VISI UTAMA</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  "Terwujudnya tata kelola keuangan dan administrasi pembayaran pekerjaan yang transparan, modern, akuntabel, dan bebas hambatan serta mengutamakan ketepatan waktu guna mempercepat penyelesaian proyek pembangunan daerah demi kepentingan masyarakat umum."
                </p>
              </div>

              <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                <h3 className="text-xl font-bold text-blue-900 mb-3 block font-sans">MISI KEUANGAN DIGITAL</h3>
                <ul className="space-y-3.5 text-sm text-neutral-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 block" />
                    <span>Digitalisasi dokumen pengajuan Surat Pertanggungjawaban (SPJ) Operasi Rutin Instansi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 block" />
                    <span>Mempersingkat birokrasi verifikasi fisik, penyerapan anggaran, dan data termin kontrak kerja.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 block" />
                    <span>Meningkatkan akurasi kalkulasi potongan uang muka penyedia dan perhitungan sisa tagihan secara real-time.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Log In Area */}
        <section id="login-section" className="py-20 bg-neutral-100/40 relative">
          <div className="max-w-md mx-auto px-4">
            <div id="login-card" className="bg-white rounded-2xl shadow-xl border border-neutral-200/80 p-8 relative overflow-hidden">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">Masuk ke Sistem Aplikasi</h2>
                <p className="text-xs text-neutral-500 mt-1">Silakan pilih role pengguna untuk login cepat</p>
              </div>

              <div className="space-y-4">
                <button
                  id="btn-login-admin"
                  onClick={() => onLogin('Admin')}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-between group"
                >
                  <div className="text-left">
                    <span className="block text-sm">Masuk sebagai ADMIN</span>
                    <span className="block text-[10px] text-blue-200 font-normal">Akses penuh, Kelola User, SPJ & BAPP</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-500 group-hover:bg-blue-800 text-white text-[10px] font-mono rounded-md uppercase tracking-wider transition-colors">
                    Admin Access
                  </span>
                </button>

                <button
                  id="btn-login-user"
                  onClick={() => onLogin('User')}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-between group"
                >
                  <div className="text-left">
                    <span className="block text-sm">Masuk sebagai USER</span>
                    <span className="block text-[10px] text-emerald-200 font-normal">Akses Data, Input SPJ & BAPP</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500 group-hover:bg-emerald-800 text-white text-[10px] font-mono rounded-md uppercase tracking-wider transition-colors">
                    Staff Access
                  </span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-[11px] text-neutral-400 leading-normal">
                Sistem internal Pemerintah Daerah. Seluruh aktivitas login dipantau dan dilindungi 
                enkripsi sesi PHP / HTTPS aktif. <br />
                <a href="#lupa-password" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi administrator dinas untuk mereset password akun Anda."); }} className="text-blue-500 hover:underline font-semibold mt-2 inline-block">Lupa password Anda?</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="landing-footer" className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-neutral-800">
            <div>
              <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-2">{instansi.nama}</h4>
              <p className="text-xs leading-normal">
                {instansi.alamat}<br />
                Telepon: {instansi.telepon} | Email: {instansi.email}
              </p>
            </div>
            <div className="md:text-right">
              <span className="text-xs font-mono">BAPP ONLINE PORTAL v2.1.0</span>
              <p className="text-[11px] text-neutral-500 mt-1">Compatible with InfinityFree Host & PHP 8.x Native</p>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
            <p>
              &copy; {new Date().getFullYear()} {instansi.nama}. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Syarat Ketentuan</a>
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Bantuan Dinas</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
