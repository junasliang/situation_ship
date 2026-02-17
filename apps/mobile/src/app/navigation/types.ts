import { Event } from '../../types/models';

export type TabName = 'Board' | 'Create' | 'Archive' | 'Profile';

export type BoardRoute =
  | { name: 'Board' }
  | { name: 'EventDetail'; eventId: string }
  | { name: 'Room'; eventId: string }
  | { name: 'ManageParticipants'; eventId: string };

export type CreateRoute =
  | { name: 'CreateEvent' }
  | { name: 'ManageParticipants'; eventId: string };

export type ArchiveRoute =
  | { name: 'Archive' }
  | { name: 'ArchiveDetail'; eventId: string };

export type ProfileRoute = { name: 'Profile' };

export const findEvent = (events: Event[], eventId: string) => events.find((event) => event.id === eventId);
