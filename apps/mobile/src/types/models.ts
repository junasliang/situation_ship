export enum EventStatus {
  Draft = 'Draft',
  Posted = 'Posted',
  Ongoing = 'Ongoing',
  Ended = 'Ended',
  Archived = 'Archived',
  Removed = 'Removed',
}

export enum JoinStatus {
  Going = 'Going',
  Maybe = 'Maybe',
  Watching = 'Watching',
}

export enum AttachmentType {
  Link = 'Link',
  Photo = 'Photo',
}

export interface User {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Participant {
  userId: string;
  status: JoinStatus;
  invited: boolean;
  joinedAt?: string;
}

export interface Attachment {
  id: string;
  eventId: string;
  type: AttachmentType;
  url: string;
  createdByUserId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  eventId: string;
  senderUserId: string;
  text: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  label: string;
}

export interface BadgeRecord {
  id: string;
  eventId: string;
  participantUserId: string;
  assignedByUserId: string;
  badgeId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  isTimeTBD: boolean;
  startTime?: string;
  endTime?: string;
  location?: string;
  hostUserId: string;
  visibility: 'public';
  status: EventStatus;
  participants: Participant[];
  attachments: Attachment[];
  badgeRecords: BadgeRecord[];
  removedAt?: string;
}
