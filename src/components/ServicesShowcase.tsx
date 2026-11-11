import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Scale, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { SERVICE_TIERS } from '../data/mockData';

interface ServicesShowcaseProps {
  onGoToCalculator: () => void;
  onRequestPickup: () => void;
}

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  onGoToCalculator,
  onRequestPickup,
}) => {
  const serviceCards = [
    {
      title: 'Agak Kilat (Next Day)',
      subtitle: 'Tiba 1 Hari Pasti Sampai',
      desc: 'Layanan prioritas express nomor satu dengan alokasi armada penerbangan dan jalur ekspres jalan tol utama. Cocok untuk paket penting bisnis dan dokumen.',
      highlight: 'Garansi Ongkir Kembali 100% jika terlambat',
      features: ['Prioritas sortir pertama di gerai', 'Notifikasi SMS & WhatsApp kurir', 'Asuransi nilai barang s/d Rp 10 Juta', 'Gratis pick-up kapan saja'],
    },
    {
      title: 'Agak Reguler',
      subtitle: 'Ekonomis & Menjangkau Seluruh RI',
      desc: 'Solusi pengiriman paling populer untuk belanja online, e-commerce, dan kebutuhan personal dengan jaringan luas menjangkau hingga pelosok desa di seluruh Indonesia.',
      highlight: 'Tarif bersahabat mulai dari Rp 8.000/kg',
      features: ['Jangkauan 100% wilayah Indonesia', 'Sistem pelacakan real-time 24 jam', 'Bisa bayar di tempat (COD)', 'Kompensasi tepat waktu'],
    },
    {
      title: 'Agak Super (Same Day)',
      subtitle: 'Tiba Sore Ini dalam 6-8 Jam',
      desc: 'Khusus pengiriman dalam satu wilayah kota dan wilayah aglomerasi tetangga. Kurir khusus langsung menuju alamat penerima.',
      highlight: 'Sangat cocok untuk makanan fresh, obat, & dokumen vital',
      features: ['Dedicated kurir pengantaran langsung', 'Live chat kurir langsung via aplikasi', 'Konfirmasi foto penerimaan', 'Waktu pickup fleksibel'],
    },
    {
      title: 'Agak Kargo',
      subtitle: 'Muatan Besar & Grosir (Min 5kg)',
      desc: 'Pengiriman muatan logistik besar, material pabrik, mesin, dan stok jualan grosir dengan armada truk box, cdd, dan wingbox berkapasitas besar.',
      highlight: 'Makin berat kiriman, tarif per kg makin murah',
      features: ['Layanan muat & bongkar muatan', 'Penyediaan pallet & wrapping kayu', 'Asuransi kargo terpadu', 'Door-to-door cargo delivery'],
    },
  ];

  const guarantees = [
    {
      icon: Clock,
      title: '99.2% Ketepatan Waktu',
      desc: 'Didukung sistem routing algoritma cerdas yang meminimalisir waktu transit antar hub sortir.',
    },
    {
      icon: Truck,
      title: 'Gratis Jemput Paket (Rp 0)',
      desc: 'Cukup jadwalkan pick-up lewat web, kurir kami jemput langsung ke depan pintu tanpa minimal kiriman.',
    },
    {
      icon: ShieldCheck,
      title: 'Garansi Uang Kembali 100%',
      desc: 'Jika kiriman layanan kilat kami mengalami keterlambatan di luar kondisi kahar, ongkir kembali penuh.',
    },
    {
      icon: CreditCard,
      title: 'Layanan COD Terpercaya',
      desc: 'Penerima dapat membayar tunai atau QRIS saat barang sampai di tempat dengan pencairan dana harian cepat.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Intro section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Layanan Ekspedisi Menyesuaikan Kebutuhan Anda
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Dari paket dokumen kilat hingga logistik muatan kargo kontainer, Si Agak Cepat memberikan keandalan standar tertinggi untuk setiap pengiriman.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoToCalculator}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Hitung Estimasi Biaya Ongkir
          </button>
          <button
            onClick={onRequestPickup}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Jadwalkan Pick-up Gratis Sekarang
          </button>
        </div>
      </div>

      {/* Services Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceCards.map((svc, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  {svc.subtitle}
                </span>
                <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {svc.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {svc.desc}
              </p>

              <div className="p-3 bg-red-50/70 dark:bg-red-950/30 rounded-xl border border-red-200/60 dark:border-red-900/40 text-xs font-semibold text-red-700 dark:text-red-300 mb-4">
                ★ {svc.highlight}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {svc.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Pick-up gratis & asuransi</span>
              <button
                onClick={onRequestPickup}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Pesan Layanan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Trust & Guarantee Strip */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400">
            Standar Kualitas Si Agak Cepat
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Mengapa Jutaan Pengirim Mempercayakan Paketnya Kepada Kami?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="space-y-2 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
