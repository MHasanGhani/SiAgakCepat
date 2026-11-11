import React, { useState, useMemo } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  User, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Search,
  ArrowRight,
  ArrowLeft,
  Truck,
  Banknote,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { INDONESIAN_CITIES, SERVICE_TIERS } from '../data/mockData';
import { TrackingData, ServiceTier, PaymentMethod, PaymentStatus, PaymentDetails } from '../types';
import { calculateShippingRates, formatRupiah } from '../utils/rateCalculator';

interface PickupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: {
    originId?: string;
    destId?: string;
    weightKg?: number;
    serviceId?: ServiceTier['id'];
  };
  onShipmentCreated: (newTracking: TrackingData) => void;
  onOpenPrintModal: (tracking: TrackingData) => void;
}

export const PickupBookingModal: React.FC<PickupBookingModalProps> = ({
  isOpen,
  onClose,
  prefill,
  onShipmentCreated,
  onOpenPrintModal,
}) => {
  // Step state: 1 = Data Pengiriman, 2 = Pembayaran (COD / TF), 3 = Sukses Resi
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Form state
  const [senderName, setSenderName] = useState('CV Kurnia Mandiri Express');
  const [senderPhone, setSenderPhone] = useState('0812-8899-2233');
  const [senderCityId, setSenderCityId] = useState(prefill?.originId || 'jkt-pusat');
  const [senderAddress, setSenderAddress] = useState('Gedung Sarinah Lt. 5, Jl. M.H. Thamrin No. 11');

  const [receiverName, setReceiverName] = useState('Dr. Hendra Gunawan');
  const [receiverPhone, setReceiverPhone] = useState('0813-7722-1100');
  const [receiverCityId, setReceiverCityId] = useState(prefill?.destId || 'bdg');
  const [receiverAddress, setReceiverAddress] = useState('Jl. Ir. H. Juanda No. 84, Coblong');

  const [itemType, setItemType] = useState('Dokumen Kontrak & Sample Kain');
  const [weightKg, setWeightKg] = useState<number>(prefill?.weightKg || 1.5);
  const [serviceId, setServiceId] = useState<ServiceTier['id']>(prefill?.serviceId || 'kilat');
  const [pickupSlot, setPickupSlot] = useState('Hari Ini (Sesi Siang: 13:00 - 16:00 WIB)');
  const [notes, setNotes] = useState('Mohon hubungi sebelum sampai, ada di kantor lantai 5.');

  // Step 2: Payment state (COD vs TF)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer_va' | 'qris'>('cod');
  
  // COD specific options
  const [codType, setCodType] = useState<'shipping_only' | 'goods_and_shipping'>('shipping_only');
  const [codGoodsValue, setCodGoodsValue] = useState<number>(150000);
  const [codBankName, setCodBankName] = useState('BCA');
  const [codAccountNumber, setCodAccountNumber] = useState('8271928301');
  const [codAccountHolder, setCodAccountHolder] = useState('CV Kurnia Mandiri');

  // Transfer specific options
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'Mandiri' | 'BRI' | 'BNI'>('BCA');
  const [isSimulatedPaid, setIsSimulatedPaid] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  // Success state after booking
  const [createdTracking, setCreatedTracking] = useState<TrackingData | null>(null);

  // Calculate live price based on current form inputs
  const calculatedCost = useMemo(() => {
    const rates = calculateShippingRates({
      originId: senderCityId,
      destId: receiverCityId,
      weightKg: Math.max(0.1, weightKg || 1),
    });
    const found = rates.find(r => r.service.id === serviceId);
    return found ? found.totalCost : 18000;
  }, [senderCityId, receiverCityId, weightKg, serviceId]);

  // Dynamic VA number based on selected bank
  const virtualAccountNumbers: Record<string, string> = {
    BCA: '8801928374610291',
    Mandiri: '8902441099231827',
    BRI: '1280001948273910',
    BNI: '9881726155201928',
  };

  const currentVaNumber = virtualAccountNumbers[selectedBank] || '8801928374610291';

  // Calculate total payment needed
  const totalPaymentAmount = useMemo(() => {
    if (paymentMethod === 'cod' && codType === 'goods_and_shipping') {
      return calculatedCost + (codGoodsValue || 0);
    }
    return calculatedCost;
  }, [paymentMethod, codType, calculatedCost, codGoodsValue]);

  if (!isOpen) return null;

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(currentVaNumber);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleSimulateInstantPay = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsSimulatedPaid(true);
    }, 900);
  };

  const handleFinalizeShipment = (directPaymentStatus?: PaymentStatus) => {
    const originCity = INDONESIAN_CITIES.find(c => c.id === senderCityId) || INDONESIAN_CITIES[0];
    const destCity = INDONESIAN_CITIES.find(c => c.id === receiverCityId) || INDONESIAN_CITIES[9];
    const selectedService = SERVICE_TIERS.find(s => s.id === serviceId) || SERVICE_TIERS[0];

    // Generate unique resi number
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    const citySuffix = originCity.name.slice(0, 3).toUpperCase();
    const newResi = `SAC-${randomDigits}-${citySuffix}`;

    const now = new Date();
    const dateFormatted = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    // Determine final payment details
    const paymentStatus: PaymentStatus =
      directPaymentStatus ||
      (paymentMethod === 'cod'
        ? 'pay_on_delivery'
        : isSimulatedPaid
        ? 'paid'
        : 'pending_payment');

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      status: paymentStatus,
      amount: totalPaymentAmount,
      bankName: paymentMethod === 'transfer_va' ? selectedBank : paymentMethod === 'qris' ? 'QRIS Instan' : undefined,
      vaNumber: paymentMethod === 'transfer_va' ? currentVaNumber : undefined,
      codCollectionType: paymentMethod === 'cod' ? codType : undefined,
      goodsValue: paymentMethod === 'cod' && codType === 'goods_and_shipping' ? codGoodsValue : undefined,
      paidAt: paymentStatus === 'paid' ? dateFormatted : undefined,
    };

    const newTrackingRecord: TrackingData = {
      trackingNumber: newResi,
      status: 'pickup_scheduled',
      statusText: 'Menunggu Penjemputan Kurir',
      serviceType: serviceId,
      serviceName: selectedService.name,
      bookingDate: dateFormatted,
      estimatedDelivery: serviceId === 'super' ? 'Hari Ini (Sore)' : serviceId === 'kilat' ? 'Besok Siang' : '2-3 Hari ke Depan',
      sender: {
        name: senderName,
        city: originCity.name,
        district: 'Kecamatan Terdaftar',
        address: senderAddress,
        phone: senderPhone,
      },
      receiver: {
        name: receiverName,
        city: destCity.name,
        district: 'Kecamatan Tujuan',
        address: receiverAddress,
        phone: receiverPhone,
      },
      packageDetails: {
        itemType,
        weightKg,
        notes,
        declaredValue: 750000,
        codAmount: paymentMethod === 'cod' ? totalPaymentAmount : 0,
      },
      payment: paymentDetails,
      routeProgress: 10,
      originHub: {
        name: originCity.hubName,
        city: originCity.name,
        lat: originCity.lat,
        lng: originCity.lng,
      },
      destinationHub: {
        name: destCity.hubName,
        city: destCity.name,
        lat: destCity.lat,
        lng: destCity.lng,
      },
      currentLocationName: `Lokasi Pengirim (${originCity.name})`,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          timestamp: dateFormatted,
          status: 'pickup_scheduled',
          title: 'Permintaan Pick-up Gratis & Resi Diterbitkan',
          description: `Sistem Si Agak Cepat telah menerima request penjemputan paket untuk slot ${pickupSlot}. Pembayaran: ${
            paymentMethod === 'cod'
              ? `COD Bayar di Tempat (${formatRupiah(totalPaymentAmount)})`
              : `Transfer Bank ${selectedBank} VA (${paymentStatus === 'paid' ? 'LUNAS' : 'Menunggu Transfer'})`
          }.`,
          location: originCity.hubName,
          actor: 'Sistem Dispatch Si Agak Cepat',
        },
      ],
    };

    setCreatedTracking(newTrackingRecord);
    setStep(3);
    onShipmentCreated(newTrackingRecord);
  };

  const handleReset = () => {
    setCreatedTracking(null);
    setStep(1);
    setIsSimulatedPaid(false);
  };

  const originCityObj = INDONESIAN_CITIES.find(c => c.id === senderCityId);
  const destCityObj = INDONESIAN_CITIES.find(c => c.id === receiverCityId);
  const selectedServiceObj = SERVICE_TIERS.find(s => s.id === serviceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Header Modal with Step Indicators */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              {step === 1 ? <Package className="w-5 h-5" /> : step === 2 ? <CreditCard className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {step === 1 && '1. Isi Data Pengiriman & Penjemputan'}
                {step === 2 && '2. Pilih Metode Pembayaran (COD / Transfer)'}
                {step === 3 && '3. Pengiriman Berhasil Diterbitkan'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 1 && 'Gratis biaya jemput paket ke depan pintu tanpa minimum order'}
                {step === 2 && 'Pilih bayar saat paket tiba (COD) atau Transfer Bank (TF) instan'}
                {step === 3 && 'Nomor resi resmi aktif dan dapat langsung dilacak real-time'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          
          {/* STEP 1: FORM DATA PENGIRIMAN */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment} className="space-y-6">
              
              {/* Data Pengirim */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>1. Data Pengirim (Lokasi Penjemputan)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Nama Pengirim / Toko *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Kota Asal *
                    </label>
                    <select
                      value={senderCityId}
                      onChange={(e) => setSenderCityId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    >
                      {INDONESIAN_CITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Alamat Lengkap Penjemputan *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Data Penerima */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                  <span>2. Data Penerima (Tujuan)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Nama Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Nomor WhatsApp Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Kota Tujuan *
                    </label>
                    <select
                      value={receiverCityId}
                      onChange={(e) => setReceiverCityId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    >
                      {INDONESIAN_CITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Alamat Lengkap Pengantaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Paket & Layanan */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>3. Informasi Paket & Jadwal Pick-up</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Deskripsi Barang *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Estimasi Berat (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Pilihan Layanan Ekspedisi *
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value as ServiceTier['id'])}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-semibold"
                    >
                      {SERVICE_TIERS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.etd})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Waktu Penjemputan Kurir *
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    >
                      <option>Hari Ini (Sesi Siang: 13:00 - 16:00 WIB)</option>
                      <option>Hari Ini (Sesi Sore: 16:00 - 19:00 WIB)</option>
                      <option>Besok Pagi (Sesi Pagi: 09:00 - 12:00 WIB)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Catatan Khusus untuk Kurir (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titip di pos satpam jika tidak ada orang"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Bottom Estimation Bar & CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">Estimasi Tarif Ongkir ({selectedServiceObj?.name}):</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {formatRupiah(calculatedCost)}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      (Gratis Pick-up Rp 0)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* STEP 2: METODE PEMBAYARAN (COD ATAU TF) */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Order summary banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Ringkasan Tagihan Pengiriman
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {originCityObj?.name} → {destCityObj?.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedServiceObj?.name} · {weightKg} kg · {itemType}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total Tagihan</span>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatRupiah(totalPaymentAmount)}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tab (COD vs TF) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Pilih Metode Pembayaran:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: COD (Bayar di Tempat) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50/40 dark:bg-red-950/20 ring-2 ring-red-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      {paymentMethod === 'cod' && (
                        <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      COD (Cash on Delivery)
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      Bayar tunai atau QRIS ke kurir saat paket diantar ke alamat penerima.
                    </div>
                  </button>

                  {/* Option 2: Transfer Bank (TF) / VA & QRIS */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer_va')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      paymentMethod === 'transfer_va' || paymentMethod === 'qris'
                        ? 'border-red-600 bg-red-50/40 dark:bg-red-950/20 ring-2 ring-red-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      {(paymentMethod === 'transfer_va' || paymentMethod === 'qris') && (
                        <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      Transfer Bank (TF) / VA & QRIS
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      Transfer via BCA, Mandiri, BRI, BNI Virtual Account atau QRIS langsung.
                    </div>
                  </button>
                </div>
              </div>

              {/* DETAILS FOR COD */}
              {paymentMethod === 'cod' && (
                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    <span>Konfigurasi Penagihan COD</span>
                  </div>

                  {/* COD sub-type selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${
                      codType === 'shipping_only' 
                        ? 'bg-white dark:bg-slate-900 border-red-500 ring-1 ring-red-500' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="codType"
                        checked={codType === 'shipping_only'}
                        onChange={() => setCodType('shipping_only')}
                        className="mt-0.5 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">COD Biaya Ongkir Saja</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Penerima ({receiverName}) hanya membayar ongkir ({formatRupiah(calculatedCost)}).
                        </div>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${
                      codType === 'goods_and_shipping' 
                        ? 'bg-white dark:bg-slate-900 border-red-500 ring-1 ring-red-500' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="codType"
                        checked={codType === 'goods_and_shipping'}
                        onChange={() => setCodType('goods_and_shipping')}
                        className="mt-0.5 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">COD Nilai Barang + Ongkir</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Kurir menagih harga produk ke pembeli dan ditransfer ke rekening toko Anda.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* If goods + shipping, ask for goods value & bank account */}
                  {codType === 'goods_and_shipping' && (
                    <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Nominal Harga Barang yang Ditagih ke Penerima (Rp):
                        </label>
                        <input
                          type="number"
                          step="1000"
                          value={codGoodsValue}
                          onChange={(e) => setCodGoodsValue(parseFloat(e.target.value) || 0)}
                          className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono font-semibold"
                        />
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                          Rekening Pencairan Dana COD (Transfer Harian Otomatis):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Bank Tujuan</span>
                            <select
                              value={codBankName}
                              onChange={(e) => setCodBankName(e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs"
                            >
                              <option>BCA</option>
                              <option>Mandiri</option>
                              <option>BRI</option>
                              <option>BNI</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Nomor Rekening</span>
                            <input
                              type="text"
                              value={codAccountNumber}
                              onChange={(e) => setCodAccountNumber(e.target.value)}
                              className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Atas Nama Rekening</span>
                            <input
                              type="text"
                              value={codAccountHolder}
                              onChange={(e) => setCodAccountHolder(e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD summary box */}
                  <div className="p-3 bg-red-100/60 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>Kurir akan menagih total:</span>
                      <span className="font-mono font-bold text-sm">{formatRupiah(totalPaymentAmount)}</span>
                    </div>
                    <div className="text-[11px] opacity-90">
                      Penerima ({receiverName}) dapat membayar tunai atau menggunakan QRIS saat kurir menyerahkan paket.
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS FOR TRANSFER BANK (TF) / VA & QRIS */}
              {(paymentMethod === 'transfer_va' || paymentMethod === 'qris') && (
                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                  
                  {/* Channel switcher (Virtual Account Bank vs QRIS) */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 font-medium">Saluran Transfer:</span>
                    <div className="flex flex-wrap gap-1">
                      {(['BCA', 'Mandiri', 'BRI', 'BNI'] as const).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setPaymentMethod('transfer_va');
                            setSelectedBank(b);
                          }}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                            paymentMethod === 'transfer_va' && selectedBank === b
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {b} VA
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                          paymentMethod === 'qris'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QRIS</span>
                      </button>
                    </div>
                  </div>

                  {/* Virtual Account Box */}
                  {paymentMethod === 'transfer_va' && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nomor Virtual Account {selectedBank}:</span>
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Verifikasi Otomatis
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="font-mono text-lg font-extrabold text-slate-900 dark:text-white tracking-wider">
                          {currentVaNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyVA}
                          className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedVA ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin VA</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                        <div>
                          <span>Nama Rekening: </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">PT Si Agak Cepat Logistics</span>
                        </div>
                        <div>
                          <span>Batas Pembayaran: </span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">24 Jam</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QRIS Box */}
                  {paymentMethod === 'qris' && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Scan QRIS untuk Bayar Instan
                      </div>
                      
                      {/* Stylized QR Code Visual */}
                      <div className="w-40 h-40 mx-auto bg-white p-2 border-2 border-black rounded-xl shadow-sm flex items-center justify-center relative">
                        <div className="w-full h-full border border-black p-1 grid grid-cols-6 gap-0.5 bg-slate-900">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div
                              key={i}
                              className={`${
                                (i % 2 === 0 || i % 5 === 0) && i !== 14 && i !== 21
                                  ? 'bg-white'
                                  : 'bg-black'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white px-2 py-0.5 rounded shadow text-[9px] font-black border border-black">
                            QRIS
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Mendukung semua aplikasi e-Wallet (GoPay, OVO, DANA, ShopeePay) & Mobile Banking berlogo QRIS.
                      </p>
                    </div>
                  )}

                  {/* Instant Verification Simulation CTA */}
                  <div className="pt-2 flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900/50">
                    <div>
                      <div className="font-semibold text-blue-900 dark:text-blue-200 text-xs">
                        {isSimulatedPaid ? '✓ Pembayaran Telah Terverifikasi (Lunas)' : 'Uji Coba Pembayaran Langsung:'}
                      </div>
                      <div className="text-[11px] text-blue-700 dark:text-blue-300">
                        {isSimulatedPaid ? 'Paket langsung siap dijemput kurir.' : 'Klik tombol di samping untuk simulasi transfer sukses seketika.'}
                      </div>
                    </div>

                    {!isSimulatedPaid ? (
                      <button
                        type="button"
                        onClick={handleSimulateInstantPay}
                        disabled={isProcessingPayment}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
                      >
                        {isProcessingPayment ? 'Memverifikasi...' : 'Simulasi Bayar Sekarang'}
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg shrink-0">
                        LUNAS
                      </span>
                    )}
                  </div>

                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Data</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFinalizeShipment()}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'cod' 
                        ? 'Konfirmasi Pengiriman COD' 
                        : isSimulatedPaid 
                        ? 'Terbitkan Resi (Lunas)' 
                        : 'Konfirmasi & Terbitkan Resi'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: SUKSES VIEW */}
          {step === 3 && createdTracking && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Pesanan & Pembayaran Berhasil Diproses
                </span>
                <h4 className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                  {createdTracking.trackingNumber}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Kurir Si Agak Cepat dijadwalkan menjemput paket Anda pada <span className="font-semibold text-slate-800 dark:text-slate-200">{pickupSlot}</span>.
                </p>
              </div>

              {/* Payment Status Stamp */}
              <div className="inline-block p-3 rounded-xl border max-w-md mx-auto text-left text-xs bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between gap-6 mb-1">
                  <span className="text-slate-500">Metode Pembayaran:</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    {createdTracking.payment?.method === 'cod'
                      ? 'COD (Bayar di Tempat)'
                      : `Transfer ${createdTracking.payment?.bankName || 'VA'}`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-500">Status Pembayaran:</span>
                  <span className={`font-semibold font-mono ${
                    createdTracking.payment?.status === 'paid'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {createdTracking.payment?.status === 'paid'
                      ? '✓ LUNAS'
                      : createdTracking.payment?.method === 'cod'
                      ? `Menunggu Penagihan Kurir (${formatRupiah(createdTracking.payment?.amount || 0)})`
                      : 'Menunggu Transfer (Pending)'}
                  </span>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Layanan:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{createdTracking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rute:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{createdTracking.sender.city} → {createdTracking.receiver.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penerima:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{createdTracking.receiver.name} ({createdTracking.receiver.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Ongkir:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatRupiah(createdTracking.payment?.amount || 0)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Lacak Resi Ini Sekarang</span>
                </button>

                <button
                  onClick={() => {
                    onOpenPrintModal(createdTracking);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Label Thermal (10×15 cm)</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline"
                >
                  + Buat Pengiriman Baru Lagi
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
