import React, { useState } from 'react';
import { X, Phone, MessageSquare, Send, Check, ShieldCheck, MapPin } from 'lucide-react';
import { TrackingData } from '../types';

interface ContactCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingData;
}

export const ContactCourierModal: React.FC<ContactCourierModalProps> = ({
  isOpen,
  onClose,
  tracking,
}) => {
  const [customMsg, setCustomMsg] = useState(
    `Halo Pak ${tracking.courier?.name || 'Kurir'}, saya penerima paket resi ${tracking.trackingNumber}. Saya ada di lokasi, mohon konfirmasi jika sudah dekat ya. Terima kasih!`
  );
  const [msgSent, setMsgSent] = useState(false);

  if (!isOpen || !tracking.courier) return null;

  const handleSendWA = () => {
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hubungi Kurir Pengantar
              </h3>
              <p className="text-[11px] text-slate-500">
                Resi: <span className="font-mono font-semibold">{tracking.trackingNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Courier profile */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
              {tracking.courier.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-0.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {tracking.courier.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {tracking.courier.vehiclePlate} · {tracking.courier.vehicle}
              </p>
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className="text-amber-500 font-semibold">★ {tracking.courier.rating}</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Kurir Aktif di Rute</span>
              </div>
            </div>
          </div>

          {/* Quick Message Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Kirim Pesan WhatsApp Langsung:</span>
            </label>
            <textarea
              rows={3}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSendWA}
              disabled={msgSent}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {msgSent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Pesan Terkirim ke WhatsApp Kurir!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan WhatsApp ({tracking.courier.phone})</span>
                </>
              )}
            </button>

            <a
              href={`tel:${tracking.courier.phone.replace(/[^0-9]/g, '')}`}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Telepon Reguler ({tracking.courier.phone})</span>
            </a>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Demi keselamatan di jalan, kurir hanya akan membalas saat armada berhenti aman.
          </div>
        </div>

      </div>
    </div>
  );
};
