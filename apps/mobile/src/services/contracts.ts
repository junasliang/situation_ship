import { Badge, BadgeRecord, Event, JoinStatus, Message, User } from '../types/models';

export interface EventsAPI {
  listEvents(): Promise<Event[]>;
  createEvent(input: {
    title: string;
    description?: string;
    isTimeTBD: boolean;
    startTime?: string;
    endTime?: string;
    hostUserId: string;
    invitedUserIds: string[];
  }): Promise<Event>;
  getEvent(eventId: string): Promise<Event | undefined>;
  joinEvent(eventId: string, userId: string, status: JoinStatus): Promise<Event | undefined>;
  inviteUsers(eventId: string, userIds: string[]): Promise<Event | undefined>;
  removeParticipant(eventId: string, userId: string): Promise<Event | undefined>;
  endEvent(eventId: string): Promise<Event | undefined>;
}

export interface ChatAPI {
  listMessages(eventId: string): Promise<Message[]>;
  sendMessage(eventId: string, senderUserId: string, text: string): Promise<Message>;
  addAttachment(eventId: string, createdByUserId: string, type: 'Link' | 'Photo', url: string): Promise<Event | undefined>;
}

export interface ProfileAPI {
  getMe(userId: string): Promise<User | undefined>;
  updateProfile(userId: string, update: Partial<User>): Promise<User | undefined>;
}

export interface BadgesAPI {
  listBadges(): Promise<Badge[]>;
  assignBadge(eventId: string, participantUserId: string, assignedByUserId: string, badgeId: string): Promise<BadgeRecord | undefined>;
}
