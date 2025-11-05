export enum Page {
  Landing = 'LANDING',
  Slots = 'SLOTS',
  AllSlots = 'ALL_SLOTS',
  Reservation = 'RESERVATION',
  Profile = 'PROFILE',
  Dashboard = 'DASHBOARD',
}

export enum SlotStatus {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold',
  Locked = 'locked',
}

export interface Slot {
  id: number;
  price: number;
  status: SlotStatus;
  reservedUntil?: Date;     // ← NOUVEAU : date d'expiration de réservation
}

export interface Profile {
  slotId: number;
  fullName: string;
  birthDate: string;
  deathDate?: string;
  quote: string;
  biography: string;
  profileImage: string;
  gallery: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}