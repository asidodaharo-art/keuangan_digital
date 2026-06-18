/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Filter, DollarSign, PieChart as PieIcon, BarChart2, TrendingUp, RefreshCw } from 'lucide-react';
import { MasterData, SPJRutin, Kontrak } from '../types';

interface DashboardProps {
  masterList: MasterData[];
  spjList: SPJRutin[];
  kontrakList: Kontrak[];
}

export default function Dashboard({ masterList, spjList, kontrakList }: DashboardProps) {
  const [filterTahun, setFilterTahun] = useState('2026');
  const [filterBulan, setFilterBulan] = useState('Semua');

  // Month map
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to parse date
  const isDateInFilter = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const yr = date.getFullYear().toString();
    const mo = date.getMonth(); // 0-11
    
    if (filterTahun !== 'Semua' && yr !== filterTahun) {
      return false;
    }
    if (filterBulan !== 'Semua') {
      const targetMoIdx = namaBulan.indexOf(filterBulan);
      if (mo !== targetMoIdx) {
        return false;
      }
    }
    return true;
  };

  // 1. Calculate Totals based on current data matching filters
  const totalPagu = masterList.reduce((acc, m) => acc + m.pagu, 0);

  // SPJ Rutin filtered values
  const filteredSPJ = spjList.filter(s => isDateInFilter(s.tanggal));
  const spjBelanjaOperasi = filteredSPJ.filter(s => s.jenisSpj === 'Belanja Operasi').reduce((acc, s) => acc + s.total, 0);
  const spjBelanjaModal = filteredSPJ.filter(s => s.jenisSpj === 'Belanja Modal').reduce((acc, s) => acc + s.total, 0);

  // BAPP / Kontrak Pekerjaan filtered values
  let bappBelanjaModal = 0;
  kontrakList.forEach(k => {
    k.terminList.forEach(t => {
      if (isDateInFilter(t.tanggalBAPP)) {
        bappBelanjaModal += t.nilaiPembayaran;
      }
    });
  });

  const totalBelanjaOperasi = spjBelanjaOperasi;
  const totalBelanjaModal = spjBelanjaModal + bappBelanjaModal;
  const totalPenyerapan = totalBelanjaOperasi + totalBelanjaModal;
  const persentasePenyerapan = totalPagu > 0 ? (totalPenyerapan / totalPagu) * 100 : 0;

  // Formatting currency Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // --- CHART 1: Realisasi per Kode Rekening (Bar Chart) ---
  // We can group payments corresponding to our 4 default Master Items
  // For simplicity, we match M1 to Kontrak 1 (PT Wijaya), M2 to Kontrak 2 (CV Megah), M3 & M4 to SPJ Rutin
  const chartDataBar = masterList.map(item => {
    let realisasi = 0;
    if (item.id === 'M1') {
      // PT Wijaya Kontrak termin payments
      const k = kontrakList.find(x => x.id === 'K1');
      if (k) {
        realisasi = k.terminList.filter(t => isDateInFilter(t.tanggalBAPP)).reduce((acc, t) => acc + t.nilaiPembayaran, 0);
      }
    } else if (item.id === 'M2') {
      // CV Megah
      const k = kontrakList.find(x => x.id === 'K2');
      if (k) {
        realisasi = k.terminList.filter(t => isDateInFilter(t.tanggalBAPP)).reduce((acc, t) => acc + t.nilaiPembayaran, 0);
      }
    } else if (item.id === 'M3') {
      // ATK Spj
      realisasi = filteredSPJ.reduce((acc, s) => acc + s.total, 0);
    } else {
      // Servis Kendaraan
      realisasi = 0; // simulated
    }
    return {
      name: item.kodeRekening,
      label: item.subKegiatan,
      pagu: item.pagu,
      realisasi: realisasi,
      percent: item.pagu > 0 ? (realisasi / item.pagu) * 100 : 0,
    };
  });

  // --- CHART 2: Monthly Progress (Line Progression & S-Curve target) ---
  // Interactive visualization logic
  const bulananRealisasi = Array(12).fill(0);
  spjList.forEach(s => {
    const d = new Date(s.tanggal);
    if (d.getFullYear().toString() === filterTahun) {
      bulananRealisasi[d.getMonth()] += s.total;
    }
  });
  kontrakList.forEach(k => {
    k.terminList.forEach(t => {
      const d = new Date(t.tanggalBAPP);
      if (d.getFullYear().toString() === filterTahun) {
        bulananRealisasi[d.getMonth()] += t.nilaiPembayaran;
      }
    });
  });

  // Calculate Cumulative values for S-Curve
  const cumulativeRealisasi = [];
  let currentSum = 0;
  for (let i = 0; i < 12; i++) {
    currentSum += bulananRealisasi[i];
    cumulativeRealisasi.push(currentSum);
  }

  // Planned values (Target Kurva S Target Rencana)
  const TargetRencanaS = [
    5000000, 15000000, 45000000, 110000000, 250000000, 500000000,
    750000000, 1000000000, 1400000000, 2000000000, 2800000000, 3935000000
  ];

  const maxMonthVal = Math.max(...bulananRealisasi, 1);
  const maxCumulativeVal = Math.max(...cumulativeRealisasi, totalPagu, 1);

  return (
    <div id="dashboard-tab-root" className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 font-sans tracking-tight">Kinerja Anggaran & BAPP</h2>
          <p className="text-xs text-neutral-500">Visualisasi realtime penyerapan anggaran operasional dan modal.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Filter Tahun */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <span className="text-xs font-semibold px-2 text-neutral-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Th.
            </span>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="text-xs font-bold text-neutral-800 bg-white border border-neutral-300 rounded px-2 py-1 outline-none pointer-events-auto"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="Semua">Semua</option>
            </select>
          </div>

          {/* Filter Bulan */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
            <span className="text-xs font-semibold px-2 text-neutral-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Bln.
            </span>
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="text-xs font-bold text-neutral-800 bg-white border border-neutral-300 rounded px-2 py-1 outline-none pointer-events-auto"
            >
              <option value="Semua">Semua Bulan</option>
              {namaBulan.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Pagu */}
        <div id="metric-pagu" className="bg-white border border-neutral-200/85 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-4xl -z-10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-500 opacity-20" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block uppercase">TOTAL PAGU ANGGARAN</span>
          <strong className="text-xl font-black text-neutral-800 block mt-2">{formatRupiah(totalPagu)}</strong>
          <span className="text-[10px] text-neutral-500 mt-1 block">Tahun Anggaran {filterTahun}</span>
        </div>

        {/* Total Penyerapan */}
        <div id="metric-penyerapan" className="bg-white border border-neutral-200/85 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-4xl -z-10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-500 opacity-20" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block uppercase">TOTAL REALISASI</span>
          <strong className="text-xl font-black text-emerald-600 block mt-2">{formatRupiah(totalPenyerapan)}</strong>
          <span className="text-[10px] text-neutral-500 mt-1 block">Rutin & Kontrak Kerja BAPP</span>
        </div>

        {/* Persentase Penyerapan */}
        <div id="metric-percent" className="bg-white border border-neutral-200/85 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-4xl -z-10 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-amber-500 opacity-20" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block uppercase">PERSENTASE SERAPAN</span>
          <strong className="text-xl font-black text-neutral-800 block mt-2">
            {persentasePenyerapan.toFixed(2)}%
          </strong>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(persentasePenyerapan, 100)}%` }} />
          </div>
        </div>

        {/* Belanja Operasi */}
        <div id="metric-operasi" className="bg-white border border-neutral-200/85 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-4xl -z-10 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block uppercase">BELANJA OPERASI</span>
          <strong className="text-lg font-black text-neutral-800 block mt-2">{formatRupiah(totalBelanjaOperasi)}</strong>
          <span className="text-[10px] text-neutral-500 mt-1 block">Pembelian Logistik & ATK</span>
        </div>

        {/* Belanja Modal */}
        <div id="metric-modal" className="bg-white border border-neutral-200/85 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-4xl -z-10 flex items-center justify-center">
            <PieIcon className="w-6 h-6 text-indigo-500 opacity-20" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block uppercase">BELANJA MODAL</span>
          <strong className="text-lg font-black text-neutral-800 block mt-2">{formatRupiah(totalBelanjaModal)}</strong>
          <span className="text-[10px] text-neutral-500 mt-1 block">Konstruksi Fisik & Peralatan</span>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Pagu vs Realisasi per Rekening */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-5">
            <h3 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">Pagu VS Realisasi per Rekening (Sub Kegiatan)</h3>
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded-md font-mono">Bar Chart</span>
          </div>
          
          <div id="bar-chart-container" className="space-y-4">
            {chartDataBar.map((item, idx) => (
              <div key={idx} className="space-y-1 bg-neutral-50 p-3 rounded-lg border border-neutral-200/40">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-800 tracking-tight block truncate max-w-xs">{item.label}</span>
                  <span className="font-mono text-neutral-400">{item.name}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center text-[10px]">
                  <div className="col-span-10">
                    {/* Progress Bar Pagu */}
                    <span className="text-[9px] text-neutral-400 block">Pagu: {formatRupiah(item.pagu)}</span>
                    <div className="w-full bg-neutral-200/70 h-2.5 rounded-full overflow-hidden relative mt-0.5">
                      <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.min(item.percent, 100)}%` }} />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-black text-blue-700 block">{item.percent.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono mt-1 pt-1 border-t border-neutral-200/30">
                  <span className="text-neutral-500">Realisasi Diserap:</span>
                  <strong className="text-emerald-700">{formatRupiah(item.realisasi)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart B: Proporsi Jenis Belanja */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-5">
            <h3 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">Proporsi Distribusi Jenis Belanja</h3>
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded-md font-mono">Pie Chart Proporsional</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around h-60">
            {/* Custom Interactive SVG Pie Indicator */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" strokeWidth="15" />
                {totalPenyerapan > 0 && (
                  <>
                    {/* Belanja Modal Pie Segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="15"
                      strokeDasharray={`${(totalBelanjaModal / totalPenyerapan) * 220} 220`}
                      className="transition-all"
                    />
                    {/* Belanja Operasi Segment start offset */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="transparent"
                      stroke="#8b5cf6"
                      strokeWidth="15"
                      strokeDashoffset={`-${(totalBelanjaModal / totalPenyerapan) * 220}`}
                      strokeDasharray={`${(totalBelanjaOperasi / totalPenyerapan) * 220} 220`}
                      className="transition-all"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-neutral-800">
                  {totalPenyerapan > 0 ? ((totalBelanjaModal + totalBelanjaOperasi) > 0 ? 100 : 0) : 0}%
                </span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Serapan</span>
              </div>
            </div>

            <div className="space-y-4 max-w-xs w-full sm:w-auto">
              {/* Belanja Operasi */}
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded bg-purple-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">BELANJA OPERASI</span>
                  <strong className="text-xs font-black text-neutral-800">{formatRupiah(totalBelanjaOperasi)}</strong>
                  <span className="text-[11px] text-purple-700 block font-mono">
                    ({totalPenyerapan > 0 ? ((totalBelanjaOperasi / totalPenyerapan) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>

              {/* Belanja Modal */}
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded bg-blue-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">BELANJA MODAL</span>
                  <strong className="text-xs font-black text-neutral-800">{formatRupiah(totalBelanjaModal)}</strong>
                  <span className="text-[11px] text-blue-700 block font-mono">
                    ({totalPenyerapan > 0 ? ((totalBelanjaModal / totalPenyerapan) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* S-Curve & Timeline Section */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-5">
          <div>
            <h3 className="text-sm font-extrabold uppercase text-neutral-800 tracking-tight">Kurva S Kumulatif Realisasi vs Target</h3>
            <p className="text-[11px] text-neutral-400">Realisasi kumulatif belanja pembangunan daerah terhadap target Pagu Dinas.</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] rounded-md font-mono font-bold tracking-wider">S-CURVE PROJECTION</span>
        </div>

        {/* Custom SVG Line S-Curve Plot */}
        <div className="w-full relative h-72">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 400" preserveAspectRatio="none">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map(lineIdx => (
              <line
                key={lineIdx}
                x1="40"
                y1={40 + lineIdx * 80}
                x2="1160"
                y2={40 + lineIdx * 80}
                stroke="#f1f5f9"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* Months Indicators lines */}
            {namaBulan.map((_, mIdx) => (
              <line
                key={mIdx}
                x1={40 + mIdx * 100}
                y1="30"
                x2={40 + mIdx * 100}
                y2="360"
                stroke="#f1f5f9"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* Axis titles */}
            <text x="35" y="30" fill="#94a3b8" fontSize="11" textAnchor="end">100%</text>
            <text x="35" y="110" fill="#94a3b8" fontSize="11" textAnchor="end">75%</text>
            <text x="35" y="190" fill="#94a3b8" fontSize="11" textAnchor="end">50%</text>
            <text x="35" y="270" fill="#94a3b8" fontSize="11" textAnchor="end">25%</text>
            <text x="35" y="350" fill="#94a3b8" fontSize="11" textAnchor="end">0%</text>

            {/* S-Curve Planned Target Line (Dotted Gray-Silver Line) */}
            <path
              d={`M 40 ${350 - (TargetRencanaS[0] / totalPagu) * 320}
                  ${TargetRencanaS.map((val, idx) => `L ${40 + idx * 100} ${350 - (val / totalPagu) * 320}`).join(' ')}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="3.5"
              strokeDasharray="6 4"
            />

            {/* S-Curve Realized Cumulative Line (Solid Bright Emerald Line) */}
            <path
              d={`M 40 ${350 - (cumulativeRealisasi[0] / totalPagu) * 320}
                  ${cumulativeRealisasi.map((val, idx) => `L ${40 + idx * 100} ${350 - (val / totalPagu) * 320}`).join(' ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Realization Nodes Points */}
            {cumulativeRealisasi.map((val, idx) => {
              const xPos = 40 + idx * 100;
              const yPos = 350 - (val / totalPagu) * 320;
              // Only draw up to current month (June 2026 is month index 5)
              if (idx > 5) return null;
              return (
                <g key={idx}>
                  <circle cx={xPos} cy={yPos} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x={xPos} y={yPos - 12} fill="#047857" fontWeight="bold" fontSize="10" textAnchor="middle">
                    {((val / totalPagu) * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Month labels underneath */}
          <div className="absolute left-0 right-0 -bottom-2 flex items-center justify-between pl-8 pr-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
            {namaBulan.map((name, idx) => (
              <span key={idx} style={{ flexBasis: '100%', textAlign: 'center' }}>{name.substring(0, 3)}</span>
            ))}
          </div>
        </div>

        {/* S-curve legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-600 font-semibold shadow-xs bg-neutral-50/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-1 bg-emerald-500 rounded" />
            <span>S-Curve Realisasi Anggaran Kumulatif ({filterTahun})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-1 border-t-3 border-dashed border-neutral-400" />
            <span>Target Rencana RKA-S Dinas ({filterTahun})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
