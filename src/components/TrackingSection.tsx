import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCw, 
  Printer, 
  Share2, 
  Phone, 
  Package, 
  MapPin, 
  User, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Truck,
  ArrowRight,
  CreditCard,
  Banknote
} from 'lucide-react';
import { TrackingData } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface TrackingSectionProps {
  currentTracking: TrackingData | null;
  onSearchTracking: (resiNumber: string) => void;
  onOpenPrintModal: (tracking: TrackingData) => void;
  onOpenCourierModal: (tracking: TrackingData) => void;
  allTrackingDatabase: Record<string, TrackingData>;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  currentTracking,
  onSearchTracking,
  onOpenPrintModal,
  onOpenCourierModal,
  allTrackingDatabase,
}) => {
  const [searchInput, setSearchInput] = useState(currentTracking?.trackingNumber || 'SAC-8829104-JKT');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(5);

  // Auto-tick "last updated x seconds ago"
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSec(prev => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchTracking(searchInput.trim());
    }
  };

  const handleQuickResi = (resi: string) => {
    setSearchInput(resi);
    onSearchTracking(resi);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setLastUpdatedSec(0);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCopyLink = () => {
    if (!currentTracking) return;
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?resi=${currentTracking.trackingNumber}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleResis = [
    { code: 'SAC-8829104-JKT', label: 'Sedang Diantar (Kurir OTW)' },
    { code: 'SAC-7739102-BDG', label: 'Telah Diterima (Selesai)' },
    { code: 'SAC-9912048-SUB', label: 'Kargo Muatan Kapal (Transit)' },
    { code: 'SAC-4491023-DPS', label: 'Menunggu Pickup Bali' },
  ];

  return (
    <div className="space-y-8">
      {/* Search Bar & Fast Track Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pelacakan Resi Real-Time
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Pantau posisi paket Anda detik demi detik dengan pembaruan GPS armada dan status manifest akurat.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Masukkan No. Resi (contoh: SAC-8829104-JKT)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Lacak Paket</span>
            </button>
          </div>
        </form>

        {/* Quick Test Resi List */}
        <div className="max-w-2xl mx-auto mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">
            Contoh Resi Demo:
          </span>
          {sampleResis.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleQuickResi(item.code)}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-colors ${
                currentTracking?.trackingNumber === item.code
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {item.code} <span className="opacity-70">({item.label.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tracking Result View */}
      {currentTracking ? (
        <div className="space-y-6">
          {/* Status Header Strip */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    NO. RESI
                  </span>
                  <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                    {currentTracking.trackingNumber}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    title="Salin Nomor Resi"
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Status description */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                    {currentTracking.statusText}
                  </span>
                  <span>·</span>
                  <span>{currentTracking.serviceName}</span>
                  <span>·</span>
                  <span>Diperbarui {lastUpdatedSec} detik lalu</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <button
                onClick={handleManualRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Refresh Posisi Live"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => onOpenPrintModal(currentTracking)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Label Thermal</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
              </button>

              {currentTracking.courier && currentTracking.status === 'out_for_delivery' && (
                <button
                  onClick={() => onOpenCourierModal(currentTracking)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi Kurir</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Map Visual */}
          <InteractiveMap tracking={currentTracking} isLiveUpdating={isRefreshing} />

          {/* Details Grid: Shipper / Receiver / Specs / Courier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sender & Receiver Card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Rincian Pengirim & Penerima</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Dibuat: {currentTracking.bookingDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Pengirim */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pengirim (Asal)
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentTracking.sender.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {currentTracking.sender.address}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {currentTracking.sender.district}, {currentTracking.sender.city}
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 pt-1">
                    Telp: {currentTracking.sender.phone}
                  </div>
                </div>

                {/* Penerima */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">
                    Penerima (Tujuan)
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentTracking.receiver.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {currentTracking.receiver.address}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {currentTracking.receiver.district}, {currentTracking.receiver.city}
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 pt-1">
                    Telp: {currentTracking.receiver.phone}
                  </div>
                </div>
              </div>

              {/* Package Specs strip */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jenis Paket</span>
                  <span className="font-medium text-slate-900 dark:text-white truncate block">
                    {currentTracking.packageDetails.itemType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Berat Aktual</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {currentTracking.packageDetails.weightKg} kg
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dimensi (P×L×T)</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {currentTracking.packageDetails.dimensions 
                      ? `${currentTracking.packageDetails.dimensions.length}×${currentTracking.packageDetails.dimensions.width}×${currentTracking.packageDetails.dimensions.height} cm`
                      : 'Standar'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Instruksi Khusus</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400 truncate block">
                    {currentTracking.packageDetails.notes || 'Handle with Care'}
                  </span>
                </div>
              </div>

              {/* Payment Details strip */}
              {currentTracking.payment && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                      {currentTracking.payment.method === 'cod' ? (
                        <Banknote className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Metode Pembayaran:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                        {currentTracking.payment.method === 'cod'
                          ? 'COD (Bayar di Tempat)'
                          : `Transfer ${currentTracking.payment.bankName || 'Virtual Account'}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Tagihan:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(currentTracking.payment.amount)}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold ${
                      currentTracking.payment.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}>
                      {currentTracking.payment.status === 'paid'
                        ? '✓ LUNAS'
                        : currentTracking.payment.method === 'cod'
                        ? 'TAGIHAN COD KURIR'
                        : 'MENUNGGU TRANSFER'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Side Card: Courier & Delivery Proof */}
            <div className="space-y-4">
              {/* Courier info card */}
              {currentTracking.courier && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Kurir Pengantaran
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                      {currentTracking.courier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {currentTracking.courier.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {currentTracking.courier.vehiclePlate} · {currentTracking.courier.vehicle}
                      </div>
                      <div className="text-[11px] text-amber-500 font-medium">
                        ★ {currentTracking.courier.rating} / 5.0 (Kurir Teladan)
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCourierModal(currentTracking)}
                    className="w-full mt-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi Kurir ({currentTracking.courier.phone})</span>
                  </button>
                </div>
              )}

              {/* Delivery Proof Card if delivered */}
              {currentTracking.proof && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/80 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Bukti Paket Diterima</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Penerima: </span>
                      <span className="font-semibold">{currentTracking.proof.receiverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Hubungan: </span>
                      <span>{currentTracking.proof.relation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Waktu Penyerahan: </span>
                      <span className="font-mono">{currentTracking.proof.deliveredAt}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                    ✓ Tanda Tangan Digital Tersimpan
                  </div>
                </div>
              )}

              {/* Security notice */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>Jaminan Keamanan Paket</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Semua kiriman dilindungi SOP segel anti-rusak Si Agak Cepat. Klaim asuransi dapat diproses langsung melalui kantor cabang.
                </p>
              </div>
            </div>

          </div>

          {/* Chronological Timeline History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Riwayat Perjalanan Paket (Manifest History)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Catatan kronologis dari saat penjemputan hingga tiba di tangan penerima.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {currentTracking.timeline.length} Aktivitas Tercatat
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {currentTracking.timeline.map((event, idx) => {
                const isFirst = idx === 0;
                return (
                  <div key={event.id} className="relative group">
                    {/* Circle Node */}
                    <div 
                      className={`absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full border-2 transition-transform ${
                        isFirst
                          ? 'bg-red-600 border-white dark:border-slate-900 shadow-md ring-4 ring-red-100 dark:ring-red-950'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isFirst && <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-1" />}
                    </div>

                    {/* Timeline Event Card */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                          {event.timestamp}
                        </span>
                        <span>·</span>
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          {event.location}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {event.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {event.description}
                      </p>

                      {event.actor && (
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                          Pelaksana: {event.actor}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Empty / Not Found State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Nomor Resi Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Pastikan format nomor resi benar (contoh: <code className="font-mono font-semibold">SAC-8829104-JKT</code>). Atau pilih salah satu contoh resi demo di atas.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => handleQuickResi('SAC-8829104-JKT')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Lihat Demo Resi OTW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
