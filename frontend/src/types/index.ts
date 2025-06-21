// Re-export all types from box.ts
export * from './box';

// Define other types that don't depend on Box
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

// Import Box and BoxStatus types for use in this file
type Box = import('./box').Box;
type BoxStatus = import('./box').BoxStatus;

// Define BoxInput type based on Box
export type BoxInput = Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'> & {
  pickupTime: string;
  status?: BoxStatus;
  location?: string;
  locationId?: string;
  ownerId?: string;
  description?: string;
  value?: number;
  weight?: number;
  trackingNumber?: string;
};
