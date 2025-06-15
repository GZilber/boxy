export interface TimelineEvent {
  status: string;
  time: string;
  location: string;
  locationId?: string;
  details: string;
} // Make location required to match the actual usage
