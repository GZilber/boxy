export interface Box {
  id: string;
  name: string;
  size: string;
}

export interface TimeSlot {
  id: string;
  label: string;
}

export type BookingStep = 'box-selection' | 'details' | 'summary' | 'confirmation' | 'tracking';
