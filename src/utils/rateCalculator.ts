import { INDONESIAN_CITIES, SERVICE_TIERS } from '../data/mockData';
import { ShippingCalculationResult } from '../types';

export function calculateDistanceMultiplier(originCityId: string, destCityId: string): { multiplier: number; distanceKm: number } {
  const origin = INDONESIAN_CITIES.find(c => c.id === originCityId) || INDONESIAN_CITIES[0];
  const dest = INDONESIAN_CITIES.find(c => c.id === destCityId) || INDONESIAN_CITIES[9]; // default Bandung

  if (origin.id === dest.id) {
    return { multiplier: 0.75, distanceKm: 15 };
  }

  // Haversine formula approximation
  const R = 6371; // km
  const dLat = (dest.lat - origin.lat) * (Math.PI / 180);
  const dLon = (dest.lng - origin.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(origin.lat * (Math.PI / 180)) *
      Math.cos(dest.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  let multiplier = 1.0;
  if (distanceKm < 40) {
    multiplier = 0.8;
  } else if (distanceKm < 180) {
    multiplier = 1.0; // e.g. JKT - BDG
  } else if (distanceKm < 500) {
    multiplier = 1.35; // e.g. JKT - SMG / JOG
  } else if (distanceKm < 900) {
    multiplier = 1.55; // e.g. JKT - SUB
  } else if (distanceKm < 1500) {
    multiplier = 1.95; // e.g. JKT - DPS or JKT - PLM
  } else {
    multiplier = 2.6; // e.g. JKT - MDN or JKT - UPG
  }

  return { multiplier, distanceKm };
}

export interface CalculationOptions {
  originId: string;
  destId: string;
  weightKg: number;
  dimensions?: { length: number; width: number; height: number };
  declaredValue?: number;
  hasInsurance?: boolean;
  promoCode?: string;
}

export function calculateShippingRates(options: CalculationOptions): ShippingCalculationResult[] {
  const { originId, destId, weightKg, dimensions, declaredValue = 0, hasInsurance = false, promoCode = '' } = options;

  const { multiplier, distanceKm } = calculateDistanceMultiplier(originId, destId);

  // Volumetric weight = (L * W * H) / 6000
  let volumetricWeight = 0;
  if (dimensions && dimensions.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
    volumetricWeight = Math.round(((dimensions.length * dimensions.width * dimensions.height) / 6000) * 10) / 10;
  }

  const billableRaw = Math.max(weightKg, volumetricWeight);
  // Rounded up to nearest 0.5 kg for consumer fairness
  const standardBillable = Math.max(1, Math.ceil(billableRaw * 2) / 2);

  return SERVICE_TIERS.map(service => {
    // Kargo has minimum weight of 5kg
    const billableWeight = Math.max(service.minWeightKg, standardBillable);

    // Same day is only viable for nearby distances (< 100km or same city)
    if (service.id === 'super' && distanceKm > 120) {
      // Not available for long distance
      // Still show with notice or higher air priority
    }

    let baseRate = Math.round(service.baseRatePerKg * multiplier);

    // Kargo special wholesale curve: cheaper rate if > 15kg
    if (service.id === 'kargo' && billableWeight > 15) {
      baseRate = Math.round(baseRate * 0.85);
    }

    const baseCost = Math.round(baseRate * billableWeight);

    // Insurance calculation: 0.2% of declared value if chosen
    let insuranceCost = 0;
    if (hasInsurance && declaredValue > 0) {
      insuranceCost = Math.max(2500, Math.round(declaredValue * 0.002));
    }

    // Promo code discount
    let discount = 0;
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'HEMATCEPAT') {
      discount = Math.min(25000, Math.round(baseCost * 0.2));
    } else if (cleanCode === 'AGAKCEPAT10') {
      discount = Math.min(baseCost, 10000);
    } else if (cleanCode === 'GRATISONGKIR' && baseCost >= 25000) {
      discount = 15000;
    }

    const totalCost = Math.max(5000, baseCost + insuranceCost - discount);

    // Dynamic ETD wording based on distance
    let etdText = service.etd;
    if (distanceKm > 1000) {
      if (service.id === 'kilat') etdText = '1 - 2 Hari (Via Udara)';
      if (service.id === 'reguler') etdText = '3 - 4 Hari';
      if (service.id === 'kargo') etdText = '4 - 6 Hari';
    }

    return {
      service,
      billableWeightKg: billableWeight,
      actualWeightKg: weightKg,
      volumetricWeightKg: volumetricWeight,
      baseCost,
      insuranceCost,
      discount,
      totalCost,
      etdText,
      guaranteeText: service.id === 'kilat' ? 'Garansi Ongkir Kembali 100% Jika Terlambat' : 'Standar Garansi Keamanan & Perlindungan',
    };
  });
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
