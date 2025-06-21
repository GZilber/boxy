// Define the BoxStatus type
export type BoxStatus = 'stored' | 'transit' | 'delivered' | 'processing';

// Define the TimelineEvent interface
export interface TimelineEvent {
  status: BoxStatus | string; // Allow any string for backward compatibility
  time: string;
  location: string;
  locationId?: string;
  details: string;
  // Add metadata for additional context
  metadata?: {
    coordinates?: {
      lat: number;
      lng: number;
    };
    handoffCode?: string;
    [key: string]: any; // Allow additional metadata
  };
}

// Main Box interface
export interface Box {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large' | 'xl' | string;
  status: BoxStatus;
  location: string;
  locationId: string;
  ownerId: string;
  description: string;
  contents: string | string[];
  value: number;
  weight: number;
  trackingNumber: string;
  insurance?: boolean;
  fragile?: boolean;
  timeline: TimelineEvent[];
  pickupTime: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  courier?: {
    name: string;
    rating: number;
    contact: string;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'in';
  };
  lastUpdated: string;
  createdAt: string;
  notes?: string;
  images?: string[];
  tags?: string[];
  isFragile?: boolean;
  isPerishable?: boolean;
  requiresSignature?: boolean;
  insuranceAmount?: number;
  customFields?: Record<string, any>;
}

// Type for creating a new box (without readonly fields)
export type CreateBoxInput = Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'>;

// Type for updating a box
export interface UpdateBoxInput extends Partial<Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'>> {
  id: string;
  // Allow timeline to be updated with new events
  timeline?: TimelineEvent[];
  // Make these fields explicitly updatable
  status?: BoxStatus;
  location?: string;
  locationId?: string;
  lastUpdated?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
  address?: string | null;
}

export interface BoxDimensions {
  width: number;
  height: number;
  depth: number;
  unit?: string;
}

export type HandoffStep = 'select' | 'confirm' | 'complete';

export interface HandoffBoxProps {
  // Add any props if needed
}
