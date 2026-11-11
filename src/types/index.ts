export type PackageStatus = 
  | 'pickup_scheduled'
  | 'picked_up'
  | 'sorting_origin'
  | 'in_transit'
  | 'sorting_destination'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_attempted';

export interface TimelineEvent {
  id: string;
  timestamp: string; // e.g. "07 Nov 2026, 14:22 WIB"
  status: PackageStatus;
  title: string;
  description: string;
  location: string;
  actor?: string; // e.g. "Kurir: Ahmad Fauzi" or "Hub Transit Cakung"
}

export interface CourierInfo {
  name: string;
  phone: string;
  vehicle: string;
  vehiclePlate: string;
  photoUrl?: string;
  rating: number;
}

export interface DeliveryProof {
  receiverName: string;
  relation: string; // e.g. "Yang Bersangkutan", "Security / Resepsionis", "Keluarga Serumah"
  deliveredAt: string;
  photoUrl?: string;
  signatureSvg?: string;
}

export interface TrackingData {
  trackingNumber: string; // e.g. "SAC-8829104-JKT"
  status: PackageStatus;
  statusText: string;
  serviceType: 'kilat' | 'reguler' | 'super' | 'kargo';
  serviceName: string;
  bookingDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  
  sender: {
    name: string;
    city: string;
    district: string;
    address: string;
    phone: string;
  };
  
  receiver: {
    name: string;
    city: string;
    district: string;
    address: string;
    phone: string;
  };

  packageDetails: {
    itemType: string;
    weightKg: number;
    dimensions?: { length: number; width: number; height: number };
    declaredValue?: number;
    notes?: string;
    codAmount?: number;
  };

  courier?: CourierInfo;
  proof?: DeliveryProof;
  payment?: PaymentDetails;
  timeline: TimelineEvent[];
  routeProgress: number; // 0 to 100%
  originHub: { name: string; city: string; lat: number; lng: number };
  destinationHub: { name: string; city: string; lat: number; lng: number };
  currentLocationName: string;
}

export type PaymentMethod = 'cod' | 'transfer_va' | 'qris';
export type PaymentStatus = 'paid' | 'pending_payment' | 'pay_on_delivery';

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  bankName?: string;
  vaNumber?: string;
  codCollectionType?: 'shipping_only' | 'goods_and_shipping';
  goodsValue?: number;
  paidAt?: string;
}

export interface CityInfo {
  id: string;
  name: string;
  province: string;
  hubName: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface ServiceTier {
  id: 'kilat' | 'reguler' | 'super' | 'kargo';
  name: string;
  tagline: string;
  etd: string; // Estimasi Hari
  baseRatePerKg: number;
  minWeightKg: number;
  features: string[];
  recommended?: boolean;
}

export interface ShippingCalculationResult {
  service: ServiceTier;
  billableWeightKg: number;
  actualWeightKg: number;
  volumetricWeightKg: number;
  baseCost: number;
  insuranceCost: number;
  discount: number;
  totalCost: number;
  etdText: string;
  guaranteeText: string;
}

export interface DropPoint {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  operatingHours: string;
  services: string[];
  mapsUrl: string;
  is24Hours?: boolean;
}
