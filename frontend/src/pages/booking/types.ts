import type { Box as MainBox } from '../../types/box';

export type Box = MainBox & {
  // Add any additional fields specific to the booking flow
  price?: number;
};

export interface TimeSlot {
  id: string;
  label: string;
}

export type BookingStep = 'service-flow' | 'box-selection' | 'details' | 'summary' | 'confirmation' | 'tracking';
