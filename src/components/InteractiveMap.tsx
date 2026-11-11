import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Navigation, Clock, ShieldCheck, Radio } from 'lucide-react';
import { TrackingData } from '../types';

interface InteractiveMapProps {
  tracking: TrackingData;
  isLiveUpdating?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ tracking, isLiveUpdating }) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

  // Derive stations along the journey
  const waypoints = [
    { label: tracking.originHub.city, sub: 'Hub Asal', code: 'ORIGIN', done: tracking.routeProgress >= 20 },
    { label: 'Sortir Hub Utama', sub: 'Pemeriksaan Muatan', code: 'SORTING', done: tracking.routeProgress >= 40 },
    { label: 'Gateway Antar Kota', sub: 'Truk Ekspedisi', code: 'TRANSIT', done: tracking.routeProgress >= 60 },
    { label: tracking.destinationHub.city, sub: 'Hub Drop Point', code: 'DEST_HUB', done: tracking.routeProgress >= 80 },
    { label: tracking.receiver.city, sub: 'Tiba di Alamat', code: 'FINAL', done: tracking.routeProgress >= 100 },
  ];

  const currentPercent = Math.min(100, Math.max(8, tracking.routeProgress));

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Map Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-red-400">
                Peta Perjalanan Real-Time
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                GPS Terhubung
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{tracking.originHub.city}</span>
              <span className="text-slate-500">→</span>
              <span>{tracking.destinationHub.city}</span>
            </h4>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300">Posisi:</span>
            <span className="text-white font-medium truncate max-w-[170px] sm:max-w-xs">
              {tracking.currentLocationName}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Canvas / SVG Interactive Schematic */}
      <div className="relative z-10 py-8 px-2 sm:px-6">
        {/* Animated Progress Path */}
        <div className="relative mb-6">
          {/* Background track line */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-700 ease-out relative"
              style={{ width: `${currentPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Animated Truck Carrier along the progress line */}
          <div 
            className="absolute -top-3.5 -ml-4 transition-all duration-700 ease-out z-20"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="relative group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white transform hover:scale-110 transition-transform">
                <Truck className="w-4 h-4" />
              </div>
              {/* Radar pulse ring */}
              <div className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping -z-10" />
              
              {/* Floating Tooltip */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[11px] py-1 px-2.5 rounded-md whitespace-nowrap shadow-xl border border-slate-700 opacity-90 pointer-events-none">
                {tracking.statusText} ({currentPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Journey Waypoints */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {waypoints.map((wp, idx) => {
            const isCompleted = wp.done;
            const isCurrent = (idx === 0 && currentPercent < 30) ||
              (idx === 1 && currentPercent >= 30 && currentPercent < 50) ||
              (idx === 2 && currentPercent >= 50 && currentPercent < 70) ||
              (idx === 3 && currentPercent >= 70 && currentPercent < 95) ||
              (idx === 4 && currentPercent >= 95);

            return (
              <button
                key={wp.code}
                onClick={() => setActiveNodeIndex(idx)}
                className={`text-left p-3 rounded-xl border transition-all text-xs focus:outline-none ${
                  isCurrent
                    ? 'bg-red-950/40 border-red-500/50 text-white shadow-lg shadow-red-950/20'
                    : isCompleted
                    ? 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:border-slate-600'
                    : 'bg-slate-800/20 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-slate-400">{wp.code}</span>
                  {isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="font-semibold text-slate-100 truncate">{wp.label}</div>
                <div className="text-[11px] text-slate-400 truncate">{wp.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Bottom Telemetry Bar */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Estimasi Tiba (ETA)</span>
          <span className="font-semibold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{tracking.estimatedDelivery}</span>
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Layanan Pengiriman</span>
          <span className="font-semibold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>{tracking.serviceName}</span>
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Kurir Penanggung Jawab</span>
          <span className="font-semibold text-slate-100 truncate block mt-0.5">
            {tracking.courier ? `${tracking.courier.name} (${tracking.courier.vehiclePlate})` : 'Tim Ekspedisi Hub'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Pembaruan Terakhir</span>
          <span className="font-mono text-emerald-400 block mt-0.5">
            {isLiveUpdating ? 'Sinkronisasi...' : 'Live Real-time'}
          </span>
        </div>
      </div>
    </div>
  );
};
