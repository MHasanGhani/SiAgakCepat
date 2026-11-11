import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowLeftRight, 
  Scale, 
  Box, 
  Shield, 
  Tag, 
  Check, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Clock,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { INDONESIAN_CITIES, SERVICE_TIERS } from '../data/mockData';
import { calculateShippingRates, formatRupiah } from '../utils/rateCalculator';
import { ServiceTier, ShippingCalculationResult } from '../types';

interface ShippingCalculatorProps {
  onSelectServiceToBook: (params: {
    originId: string;
    destId: string;
    weightKg: number;
    serviceId: ServiceTier['id'];
  }) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  onSelectServiceToBook,
}) => {
  const [originId, setOriginId] = useState('jkt-barat');
  const [destId, setDestId] = useState('bdg');
  const [weightKg, setWeightKg] = useState<number>(1.5);
  
  // Volumetric dimensions
  const [showVolume, setShowVolume] = useState(false);
  const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 });

  // Insurance & declared value
  const [hasInsurance, setHasInsurance] = useState(false);
  const [declaredValue, setDeclaredValue] = useState<number>(500000);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Swap origin and destination
  const handleSwap = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  // Promo handling
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'HEMATCEPAT') {
      setAppliedPromo(clean);
      setPromoMessage({ text: 'Kupon HEMATCEPAT aktif: Diskon 20% (Maks. Rp 25.000)', success: true });
    } else if (clean === 'AGAKCEPAT10') {
      setAppliedPromo(clean);
      setPromoMessage({ text: 'Kupon AGAKCEPAT10 aktif: Potongan Rp 10.000', success: true });
    } else if (clean === 'GRATISONGKIR') {
      setAppliedPromo(clean);
      setPromoMessage({ text: 'Kupon GRATISONGKIR aktif: Potongan Ongkir Rp 15.000', success: true });
    } else {
      setPromoMessage({ text: 'Kode promo tidak valid atau telah kedaluwarsa.', success: false });
    }
  };

  // Automatic Calculation Results
  const results = useMemo(() => {
    return calculateShippingRates({
      originId,
      destId,
      weightKg: Math.max(0.1, weightKg || 1),
      dimensions: showVolume ? dimensions : undefined,
      hasInsurance,
      declaredValue,
      promoCode: appliedPromo,
    });
  }, [originId, destId, weightKg, showVolume, dimensions, hasInsurance, declaredValue, appliedPromo]);

  const originCity = INDONESIAN_CITIES.find(c => c.id === originId);
  const destCity = INDONESIAN_CITIES.find(c => c.id === destId);

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Kalkulator Estimasi Ongkos Kirim Otomatis
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Dapatkan transparansi tarif ekspedisi terstandar ke seluruh Indonesia secara instan tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Form controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Origin & Destination Bar with Swap button */}
          <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-center">
            {/* Asal */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Kota / Area Asal Penjemputan</span>
                <span className="text-[11px] font-normal text-slate-500">{originCity?.hubName}</span>
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {INDONESIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-5 md:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                title="Tukar Asal dan Tujuan"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-transform hover:rotate-180 duration-200 cursor-pointer shadow-sm"
              >
                <ArrowLeftRight className="w-4 h-4 text-red-500" />
              </button>
            </div>

            {/* Tujuan */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Kota / Area Tujuan Paket</span>
                <span className="text-[11px] font-normal text-slate-500">{destCity?.hubName}</span>
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {INDONESIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight & Dimension Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Weight Input & Quick Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-red-500" />
                  <span>Berat Paket (Kilogram)</span>
                </label>
                <span className="text-xs font-mono text-slate-500">
                  {Math.round(weightKg * 1000)} gram
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <span className="text-sm font-medium text-slate-500">kg</span>

                {/* Quick weight buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  {[1, 2, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors ${
                        weightKg === preset
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {preset} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Volumetric toggle & inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-blue-500" />
                  <span>Perhitungan Dimensi Volumetrik</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowVolume(!showVolume)}
                  className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1"
                >
                  <span>{showVolume ? 'Sembunyikan' : '+ Tambah Ukuran (P×L×T)'}</span>
                  {showVolume ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showVolume ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="P (cm)"
                      value={dimensions.length || ''}
                      onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-0.5">Panjang</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="L (cm)"
                      value={dimensions.width || ''}
                      onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-0.5">Lebar</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="T (cm)"
                      value={dimensions.height || ''}
                      onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-0.5">Tinggi</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Paket standar (tanpa beban volumetrik khusus).</span>
                  <span className="text-[11px] text-slate-400">Rumus: P×L×T / 6000</span>
                </div>
              )}
            </div>
          </div>

          {/* Insurance and Promo Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Insurance Checkbox */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <input
                type="checkbox"
                id="ins-check"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 h-4 w-4 border-slate-300"
              />
              <label htmlFor="ins-check" className="space-y-1 cursor-pointer">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Proteksi Asuransi Nilai Barang</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] leading-tight">
                  Ganti rugi 100% jika terjadi kehilangan/kerusakan fisik (Premi 0.2%).
                </span>
                {hasInsurance && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-300">Nilai Barang: Rp</span>
                    <input
                      type="number"
                      step="50000"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(parseFloat(e.target.value) || 0)}
                      className="w-28 px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                    />
                  </div>
                )}
              </label>
            </div>

            {/* Promo Code Input */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-red-500" />
                <span>Punya Kode Promo / Voucher?</span>
              </div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Cth: HEMATCEPAT"
                  className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-lg"
                >
                  Gunakan
                </button>
              </form>
              {promoMessage && (
                <div className={`mt-2 text-[11px] font-medium ${promoMessage.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                  {promoMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Rates Grid (4 Tiers) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pilihan Layanan Pengiriman
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tarif dihitung otomatis untuk rute <span className="font-semibold text-slate-800 dark:text-slate-200">{originCity?.name}</span> menuju <span className="font-semibold text-slate-800 dark:text-slate-200">{destCity?.name}</span>.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            Berat Dihitung: {results[0]?.billableWeightKg || 1} kg
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((res) => {
            const isRec = res.service.recommended;
            return (
              <div
                key={res.service.id}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isRec
                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Clean Recommended label (no pill candy) */}
                {isRec && (
                  <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Rekomendasi Terbaik</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {res.service.name}
                    </h4>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {res.etdText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {res.service.tagline}
                  </p>

                  {/* Price display */}
                  <div className="my-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400">Total Biaya Ongkir</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        {formatRupiah(res.totalCost)}
                      </span>
                      {res.discount > 0 && (
                        <span className="text-xs font-mono line-through text-slate-400">
                          {formatRupiah(res.baseCost + res.insuranceCost)}
                        </span>
                      )}
                    </div>
                    {res.discount > 0 && (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        Hemat {formatRupiah(res.discount)}
                      </span>
                    )}
                  </div>

                  {/* Service features */}
                  <div className="space-y-2 py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {res.service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking CTA Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() =>
                      onSelectServiceToBook({
                        originId,
                        destId,
                        weightKg: res.billableWeightKg,
                        serviceId: res.service.id,
                      })
                    }
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isRec
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span>Kirim Pakai Layanan Ini</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
