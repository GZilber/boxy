export interface CourierRequest {
  id: string;
  status: 'pending' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  boxIds: string[];
  pickupAddress: string;
  deliveryAddress: string;
  scheduledDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  courierDetails?: {
    name?: string;
    phone?: string;
    trackingNumber?: string;
  };
}

export interface CreateCourierRequestInput {
  boxIds: string[];
  pickupAddress: string;
  deliveryAddress: string;
  scheduledDate: string;
  notes?: string;
}
