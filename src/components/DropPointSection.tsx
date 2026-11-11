import React, { useState } from 'react';
import { MapPin, Search, Clock, Phone, ExternalLink, Check, Navigation } from 'lucide-react';
import { DROP_POINTS } from '../data/mockData';

export const DropPointSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = ['all', 'Jakarta Pusat', 'Jakarta Barat', 'Bandung Kota', 'Surabaya', 'Denpasar / Badung', 'Yogyakarta'];

  const filteredDropPoints = DROP_POINTS.filter((dp) => {
    const matchesCity = selectedCity === 'all' || dp.city === selectedCity;
    const matchesQuery =
      dp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dp.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Title & Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Temukan Drop Point & Gerai Terdekat
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Kunjungi lebih dari 500+ titik cabang resmi Si Agak Cepat di seluruh kota untuk drop-off paket, packing aman, dan cetak resi gratis.
          </p>
        </div>

        {/* Filter controls */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama gerai, jalan, atau kota..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* City filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCity === c
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c === 'all' ? 'Semua Wilayah' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drop Points List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDropPoints.map((dp) => (
          <div
            key={dp.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  {dp.city}
                </span>
                {dp.is24Hours && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    24 JAM
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {dp.name}
              </h3>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{dp.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{dp.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{dp.phone}</span>
                </div>
              </div>

              {/* Service amenities */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Fasilitas & Layanan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dp.services.map((svc, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Maps Link */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={dp.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-red-500" />
                <span>Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
