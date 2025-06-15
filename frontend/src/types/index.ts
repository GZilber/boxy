export interface User {
  id: string;
  name: string;
  email: string;
}

// Import and re-export TimelineEvent
import { TimelineEvent } from './timeline';
export type { TimelineEvent };

// Base interface without index signature to avoid conflicts
interface BoxBase {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large' | 'xl';
  status: 'stored' | 'transit' | 'delivered' | 'processing' | 'in_transit';
  location: string;
  locationId: string;
  lastUpdated: string;
  createdAt: string;
  description: string;
  weight: number;
  value: number;
  trackingNumber: string;
  estimatedDelivery?: string;
  notes?: string;
  pickupTime?: string;
  timeline: TimelineEvent[];
}

// Extended interface with index signature
export interface Box extends BoxBase {
  [key: string]: any;
}

export type BoxInput = Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'> & {
  pickupTime: string;
};
