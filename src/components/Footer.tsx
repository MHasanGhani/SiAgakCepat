import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: 'tracking' | 'calculator' | 'droppoint' | 'services') => void;
  onRequestPickup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onRequestPickup }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/Screenshot_2026-11-04_215456_51f1aa62.png`}
                alt="Si Agak Cepat"
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  Si Agak Cepat
                </span>
                <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold tracking-wider">
                  EXPRESS COURIER
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Jasa pengiriman paket kilat dan kargo terpercaya dengan fitur pelacakan GPS real-time dan kalkulator ongkir otomatis ke seluruh Indonesia.
            </p>

            <div className="pt-1 text-xs text-slate-500 font-mono">
              PT Si Agak Cepat Nusantara Logistik
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Layanan & Fitur
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick('tracking')}
                  className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Pelacakan Resi Real-Time
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('calculator')}
                  className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Kalkulator Estimasi Ongkir
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('droppoint')}
                  className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Daftar Gerai & Drop Point
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('services')}
                  className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Paket Agak Kilat & Kargo
                </button>
              </li>
              <li>
                <button
                  onClick={onRequestPickup}
                  className="text-red-600 dark:text-red-400 font-semibold hover:underline cursor-pointer"
                >
                  + Jadwalkan Pick-up Gratis
                </button>
              </li>
            </ul>
          </div>

          {/* Hub & Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Jaringan Wilayah Utama
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mega Hub Jakarta Cakung · Hub Surabaya Waru · Hub Bandung Soekarno Hatta · Gateway Medan Amplas · Gateway Denpasar Bali · Gateway Makassar.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Standar SOP Keamanan Paket Terverifikasi</span>
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Bantuan Pelanggan 24/7
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="font-mono">Hotline: 021-5082-8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>support@siagakcepat.id</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Kantor Pusat: Gedung Sarinah Lt. 5, Jakarta</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Si Agak Cepat Express Logistics. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Syarat & Ketentuan Pengiriman</span>
            <span>·</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Kebijakan Asuransi & Klaim</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
