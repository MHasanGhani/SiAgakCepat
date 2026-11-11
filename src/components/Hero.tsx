import React, { useState } from 'react';
import { Search, Calculator, ArrowRight, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

interface HeroProps {
  onSearchTracking: (resi: string) => void;
  onGoToTab: (tab: 'tracking' | 'calculator' | 'droppoint' | 'services') => void;
  onRequestPickup: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchTracking,
  onGoToTab,
  onRequestPickup,
}) => {
  const [heroResi, setHeroResi] = useState('');
  const [activeHeroTab, setActiveHeroTab] = useState<'track' | 'rates'>('track');

  const handleHeroTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroResi.trim()) {
      onSearchTracking(heroResi.trim());
      onGoToTab('tracking');
    } else {
      onSearchTracking('SAC-8829104-JKT');
      onGoToTab('tracking');
    }
  };

  return (
    <div className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-500/5 via-rose-500/5 to-transparent pointer-events-none rounded-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Brand Announcement / Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
            <span>Ekspedisi & Kurir Logistik Terdepan</span>
            <span aria-hidden="true">·</span>
            <span>Garansi Tepat Waktu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            Kirim Paket Lebih Cepat, Pantau Posisi Tepat.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Layanan ekspedisi terpercaya dengan fitur pelacakan GPS real-time, estimasi biaya ongkir otomatis tanpa biaya tersembunyi, dan gratis penjemputan paket langsung ke rumah Anda.
          </p>

        </div>

        {/* Hero Interactive Console (Switcher between Tracking & Cek Ongkir) */}
        <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xl">
          
          {/* Segmented Controls / Mode switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => setActiveHeroTab('track')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeHeroTab === 'track'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-red-500" />
              <span>Pelacakan Resi Kilat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveHeroTab('rates');
                onGoToTab('calculator');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeHeroTab === 'rates'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-red-500" />
              <span>Cek Ongkos Kirim</span>
            </button>
          </div>

          {/* Quick Resi Input */}
          {activeHeroTab === 'track' && (
            <form onSubmit={handleHeroTrackSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={heroResi}
                    onChange={(e) => setHeroResi(e.target.value)}
                    placeholder="Ketik nomor resi Anda (cth: SAC-8829104-JKT)..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lacak Real-Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
                <span>Contoh resi aktif:</span>
                <button
                  type="button"
                  onClick={() => {
                    setHeroResi('SAC-8829104-JKT');
                    onSearchTracking('SAC-8829104-JKT');
                    onGoToTab('tracking');
                  }}
                  className="font-mono text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  SAC-8829104-JKT (Kurir OTW)
                </button>
              </div>
            </form>
          )}

        </div>

        {/* 4 Quantitative Proof Metrics Strip adjacent to the Hero */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              99.2%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tepat Waktu Sesuai SLA
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              500+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Titik Drop Point & Hub
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-red-600 dark:text-red-400">
              Rp 0
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pick-up Gratis Tanpa Syarat
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Garansi Uang Kembali
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
