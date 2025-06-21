export interface TimelineEvent {
  status: string;
  time: string;
  location: string;
  locationId?: string;
  details: string;
}

export interface Box {
  id: string;
  name?: string;
  size: string;
  status: 'stored' | 'transit' | 'delivered' | 'processing';
  pickupTime: string;
  lastUpdated: string;
  createdAt: string;
  ownerId: string;
  location?: string;
  currentLocation?: string;
  contents?: string;
  description: string;
  weight: number;
  value: number;
  trackingNumber: string;
  estimatedDelivery?: string;
  courier?: {
    name: string;
    rating: number;
    contact: string;
  };
  timeline: TimelineEvent[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PickupRequest {
  boxSize: string;
  pickupAddress: string;
  deliveryAddress: string;
}
