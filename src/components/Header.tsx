import React, { useState } from 'react';
import { Package, Search, Calculator, MapPin, Truck, Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'tracking' | 'calculator' | 'droppoint' | 'services';
  setActiveTab: (tab: 'tracking' | 'calculator' | 'droppoint' | 'services') => void;
  onRequestPickup: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRequestPickup,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'tracking' as const, label: 'Lacak Resi', icon: Search },
    { id: 'calculator' as const, label: 'Cek Ongkir', icon: Calculator },
    { id: 'droppoint' as const, label: 'Drop Point', icon: MapPin },
    { id: 'services' as const, label: 'Layanan', icon: Truck },
  ];

  const handleNavClick = (tab: 'tracking' | 'calculator' | 'droppoint' | 'services') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav links) — Zone 3 (Primary Action) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark & Official Logo */}
          <button
            onClick={() => handleNavClick('tracking')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="relative flex items-center justify-center h-12 w-auto">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/Screenshot_2026-11-04_215456_51f1aa62.png`}
                alt="Si Agak Cepat Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                Si Agak Cepat
              </span>
              <p className="text-[11px] font-medium text-red-600 dark:text-red-400 tracking-wider">
                EXPRESS COURIER & LOGISTICS
              </p>
            </div>
          </button>

          {/* Zone 2: Clean single-line text nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onRequestPickup}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Request Pick-up Gratis</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in slide-in-from-top duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-red-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestPickup();
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                <Package className="w-4 h-4" />
                <span>Request Pick-up Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
