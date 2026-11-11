import React from 'react';
import { X, Printer, Download, Check, Sparkles, Box } from 'lucide-react';
import { TrackingData } from '../types';

interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingData;
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({
  isOpen,
  onClose,
  tracking,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG barcode pattern based on tracking number
  const barcodeBars = Array.from(tracking.trackingNumber).map((char, idx) => {
    const code = char.charCodeAt(0);
    const width = (code % 3) + 1.5;
    return { width, space: (code % 2) + 1.2 };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Header Modal */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cetak Label Resi Thermal (10×15 cm)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Label Canvas View (Printable) */}
        <div className="p-6 flex justify-center bg-slate-100 dark:bg-slate-950/60 print:p-0 print:bg-white">
          <div className="w-full max-w-[380px] bg-white text-black p-5 border-2 border-black rounded-lg shadow-md font-sans text-xs space-y-3 print:shadow-none print:border-black print:rounded-none">
            
            {/* Top Brand & Sorting Code */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/aistudio/Screenshot_2026-11-04_215456_51f1aa62.png"
                  alt="Si Agak Cepat"
                  className="h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-black uppercase tracking-tight">SI AGAK CEPAT</div>
                  <div className="text-[9px] font-bold text-red-600">EXPRESS LOGISTICS</div>
                </div>
              </div>

              {/* Big Sorting Gateway code */}
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-600">HUB DEST</div>
                <div className="text-xl font-black font-mono leading-none">
                  {tracking.receiver.city.slice(0, 3).toUpperCase()}-01
                </div>
              </div>
            </div>

            {/* Service & Weight Banner */}
            <div className="flex items-center justify-between border-b-2 border-black py-1.5 px-2 bg-slate-100 font-mono">
              <span className="font-extrabold uppercase text-xs tracking-wider">
                {tracking.serviceName}
              </span>
              <span className="font-black text-sm">
                {tracking.packageDetails.weightKg} KG
              </span>
            </div>

            {/* COD vs NON-COD Payment Stamp (Authentic Logistics Thermal Waybill) */}
            <div className={`border-b-2 border-black py-2 px-3 text-center font-mono ${
              tracking.payment?.method === 'cod'
                ? 'bg-black text-white'
                : 'bg-slate-100 text-black'
            }`}>
              {tracking.payment?.method === 'cod' ? (
                <div>
                  <div className="text-[10px] tracking-widest font-black uppercase">
                    ★ TAGIHAN KURIR: CASH ON DELIVERY ★
                  </div>
                  <div className="text-base font-black tracking-wider">
                    COD: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tracking.payment?.amount || tracking.packageDetails.codAmount || 0)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    NON-COD / LUNAS (TF: {tracking.payment?.bankName || 'VA'})
                  </span>
                  <span className="text-xs font-black">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tracking.payment?.amount || 28000)}
                  </span>
                </div>
              )}
            </div>

            {/* Resi Barcode representation */}
            <div className="text-center py-2 border-b-2 border-black">
              {/* Simulated SVG Barcode */}
              <div className="flex items-center justify-center gap-[2px] h-12 w-full px-4 overflow-hidden">
                {barcodeBars.map((bar, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${bar.width * 2}px`, marginRight: `${bar.space * 1.5}px` }}
                  />
                ))}
              </div>
              <div className="font-mono font-black text-sm tracking-widest mt-1">
                {tracking.trackingNumber}
              </div>
            </div>

            {/* Consignee / Receiver Box (Big bold) */}
            <div className="border-b-2 border-black pb-2 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">PENERIMA:</div>
              <div className="font-black text-sm leading-tight">
                {tracking.receiver.name}
              </div>
              <div className="font-mono text-xs font-semibold">
                Telp: {tracking.receiver.phone}
              </div>
              <div className="text-xs leading-snug font-medium pt-0.5">
                {tracking.receiver.address}
              </div>
              <div className="font-bold text-xs uppercase pt-0.5">
                {tracking.receiver.district}, {tracking.receiver.city}
              </div>
            </div>

            {/* Shipper / Pengirim Box */}
            <div className="border-b-2 border-black pb-2 space-y-0.5 text-[11px]">
              <div className="text-[10px] font-bold text-slate-500 uppercase">PENGIRIM:</div>
              <div className="font-bold">
                {tracking.sender.name} ({tracking.sender.phone})
              </div>
              <div className="text-slate-700 truncate">
                {tracking.sender.address}, {tracking.sender.city}
              </div>
            </div>

            {/* Package Details & Notes */}
            <div className="grid grid-cols-2 gap-2 text-[10px] border-b-2 border-black pb-2">
              <div>
                <span className="text-slate-500 block">Isi Paket:</span>
                <span className="font-semibold line-clamp-1">{tracking.packageDetails.itemType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Instruksi:</span>
                <span className="font-bold text-red-600 truncate block">
                  {tracking.packageDetails.notes || 'HANDLE WITH CARE'}
                </span>
              </div>
            </div>

            {/* Bottom Bar: QR Code placeholder + Signature block */}
            <div className="flex items-center justify-between pt-1 text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 border-2 border-black p-0.5 grid grid-cols-3 gap-0.5">
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black"></div>
                </div>
                <div className="text-[9px] text-slate-500">
                  Scan QR untuk<br />validasi kurir
                </div>
              </div>

              <div className="text-right border-l-2 border-black pl-3">
                <div className="text-[9px] text-slate-500">Tanda Tangan Penerima:</div>
                <div className="h-8 w-28 border-b border-dashed border-black mt-1"></div>
                <div className="text-[8px] text-slate-400 mt-0.5">(Nama Terang)</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer print tip */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
          Didesain sesuai standar printer thermal ekspedisi ukuran 100mm × 150mm.
        </div>

      </div>
    </div>
  );
};
