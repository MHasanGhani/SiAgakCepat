import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrackingSection } from './components/TrackingSection';
import { ShippingCalculator } from './components/ShippingCalculator';
import { DropPointSection } from './components/DropPointSection';
import { ServicesShowcase } from './components/ServicesShowcase';
import { Footer } from './components/Footer';
import { PickupBookingModal } from './components/PickupBookingModal';
import { PrintLabelModal } from './components/PrintLabelModal';
import { ContactCourierModal } from './components/ContactCourierModal';
import { INITIAL_TRACKING_DATABASE } from './data/mockData';
import { TrackingData, ServiceTier } from './types';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'tracking' | 'calculator' | 'droppoint' | 'services'>('tracking');

  // Tracking Database state (persistent in localStorage if available)
  const [trackingDb, setTrackingDb] = useState<Record<string, TrackingData>>(() => {
    try {
      const saved = localStorage.getItem('siagakcepat_tracking_db');
      if (saved) {
        return { ...INITIAL_TRACKING_DATABASE, ...JSON.parse(saved) };
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_TRACKING_DATABASE;
  });

  // Current active tracking package (default to JKT-BDG in-transit)
  const [currentTracking, setCurrentTracking] = useState<TrackingData | null>(
    () => INITIAL_TRACKING_DATABASE['SAC-8829104-JKT'] || null
  );

  // Modals
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [pickupPrefill, setPickupPrefill] = useState<{
    originId?: string;
    destId?: string;
    weightKg?: number;
    serviceId?: ServiceTier['id'];
  }>({});

  const [printTracking, setPrintTracking] = useState<TrackingData | null>(null);
  const [courierTracking, setCourierTracking] = useState<TrackingData | null>(null);

  // Sync dark class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Read URL query parameter for resi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resiParam = params.get('resi');
    if (resiParam) {
      handleSearchTracking(resiParam);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSearchTracking = (resiNumber: string) => {
    const cleanResi = resiNumber.trim().toUpperCase();
    if (trackingDb[cleanResi]) {
      setCurrentTracking(trackingDb[cleanResi]);
      setActiveTab('tracking');
    } else {
      // Try fuzzy search or match
      const matchedKey = Object.keys(trackingDb).find(
        (key) => key.toUpperCase() === cleanResi || key.includes(cleanResi)
      );
      if (matchedKey) {
        setCurrentTracking(trackingDb[matchedKey]);
        setActiveTab('tracking');
      } else {
        // If not found in DB, check if user inputted an arbitrary string formatted as resi or create a live lookup
        if (cleanResi.startsWith('SAC-')) {
          // Dynamic simulated record for newly typed resi
          const newSimulated: TrackingData = {
            trackingNumber: cleanResi,
            status: 'in_transit',
            statusText: 'Dalam Pengiriman Menuju Kota Tujuan',
            serviceType: 'kilat',
            serviceName: 'Agak Kilat (Next Day)',
            bookingDate: '07 Nov 2026, 08:30 WIB',
            estimatedDelivery: '08 Nov 2026 (Besok)',
            sender: {
              name: 'Pengirim Mitra Resmi',
              city: 'Jakarta Pusat',
              district: 'Gambir',
              address: 'Jl. Merdeka Barat No. 10',
              phone: '0812-3456-7890',
            },
            receiver: {
              name: 'Pelanggan Terhormat',
              city: 'Surabaya',
              district: 'Tegalsari',
              address: 'Jl. Basuki Rahmat No. 45',
              phone: '0813-9876-5432',
            },
            packageDetails: {
              itemType: 'Paket Reguler Terdaftar',
              weightKg: 1.0,
            },
            routeProgress: 55,
            originHub: { name: 'Jakarta Hub', city: 'Jakarta Pusat', lat: -6.1805, lng: 106.8284 },
            destinationHub: { name: 'Surabaya Hub', city: 'Surabaya', lat: -7.2575, lng: 112.7521 },
            currentLocationName: 'Hub Transit Antar Kota Cirebon',
            timeline: [
              {
                id: 'dyn-2',
                timestamp: '07 Nov 2026, 11:45 WIB',
                status: 'in_transit',
                title: 'Paket Dalam Perjalanan Truk Ekspedisi',
                description: 'Paket melintasi jalur tol Trans Jawa menuju hub kota tujuan.',
                location: 'Hub Transit Antar Kota Cirebon',
              },
              {
                id: 'dyn-1',
                timestamp: '07 Nov 2026, 08:30 WIB',
                status: 'picked_up',
                title: 'Paket Telah Diterima oleh Si Agak Cepat',
                description: 'Barang telah dipindai di drop point asal.',
                location: 'Jakarta Pusat',
              },
            ],
          };

          setTrackingDb((prev) => {
            const next = { ...prev, [cleanResi]: newSimulated };
            try {
              localStorage.setItem('siagakcepat_tracking_db', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
          setCurrentTracking(newSimulated);
          setActiveTab('tracking');
        } else {
          setCurrentTracking(null);
          setActiveTab('tracking');
        }
      }
    }
  };

  const handleOpenPrintModal = (tracking: TrackingData) => {
    setPrintTracking(tracking);
  };

  const handleOpenCourierModal = (tracking: TrackingData) => {
    setCourierTracking(tracking);
  };

  const handleSelectServiceToBook = (params: {
    originId: string;
    destId: string;
    weightKg: number;
    serviceId: ServiceTier['id'];
  }) => {
    setPickupPrefill(params);
    setIsPickupModalOpen(true);
  };

  const handleShipmentCreated = (newTracking: TrackingData) => {
    setTrackingDb((prev) => {
      const next = { ...prev, [newTracking.trackingNumber]: newTracking };
      try {
        localStorage.setItem('siagakcepat_tracking_db', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setCurrentTracking(newTracking);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white transition-colors duration-200">
      
      {/* Header with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestPickup={() => {
          setPickupPrefill({});
          setIsPickupModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onSearchTracking={handleSearchTracking}
          onGoToTab={setActiveTab}
          onRequestPickup={() => {
            setPickupPrefill({});
            setIsPickupModalOpen(true);
          }}
        />

        {/* Dynamic Section Tabs Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          
          {/* Segmented Tab Bar for quick feature switching */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'tracking'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Pelacakan Resi Real-Time
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'calculator'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2. Estimasi Ongkir Otomatis
              </button>
              <button
                onClick={() => setActiveTab('droppoint')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'droppoint'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                3. Gerai & Drop Point
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                4. Jenis Layanan & SLA
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'tracking' && (
            <TrackingSection
              currentTracking={currentTracking}
              onSearchTracking={handleSearchTracking}
              onOpenPrintModal={handleOpenPrintModal}
              onOpenCourierModal={handleOpenCourierModal}
              allTrackingDatabase={trackingDb}
            />
          )}

          {activeTab === 'calculator' && (
            <ShippingCalculator
              onSelectServiceToBook={handleSelectServiceToBook}
            />
          )}

          {activeTab === 'droppoint' && (
            <DropPointSection />
          )}

          {activeTab === 'services' && (
            <ServicesShowcase
              onGoToCalculator={() => setActiveTab('calculator')}
              onRequestPickup={() => {
                setPickupPrefill({});
                setIsPickupModalOpen(true);
              }}
            />
          )}

        </div>

      </main>

      {/* Footer */}
      <Footer
        onNavClick={setActiveTab}
        onRequestPickup={() => {
          setPickupPrefill({});
          setIsPickupModalOpen(true);
        }}
      />

      {/* Modals */}
      <PickupBookingModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        prefill={pickupPrefill}
        onShipmentCreated={handleShipmentCreated}
        onOpenPrintModal={handleOpenPrintModal}
      />

      {printTracking && (
        <PrintLabelModal
          isOpen={Boolean(printTracking)}
          onClose={() => setPrintTracking(null)}
          tracking={printTracking}
        />
      )}

      {courierTracking && (
        <ContactCourierModal
          isOpen={Boolean(courierTracking)}
          onClose={() => setCourierTracking(null)}
          tracking={courierTracking}
        />
      )}

    </div>
  );
}
