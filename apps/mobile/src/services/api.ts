import { db } from '../mock/db';
import {
  AttachmentType,
  BadgeRecord,
  Event,
  EventStatus,
  JoinStatus,
  Message,
  Participant,
} from '../types/models';
import { BadgesAPI, ChatAPI, EventsAPI, ProfileAPI } from './contracts';

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const cloneEvent = (event: Event) => ({ ...event, participants: [...event.participants], attachments: [...event.attachments], badgeRecords: [...event.badgeRecords] });

export const mockEventsAPI: EventsAPI = {
  async listEvents() {
    await wait();
    return db.events.map(cloneEvent);
  },
  async createEvent(input) {
    await wait();
    const participants: Participant[] = [
      { userId: input.hostUserId, status: JoinStatus.Going, invited: true, joinedAt: new Date().toISOString() },
      ...input.invitedUserIds
        .filter((userId) => userId !== input.hostUserId)
        .map((userId) => ({ userId, status: JoinStatus.Watching, invited: true })),
    ];

    const event: Event = {
      id: id('e'),
      title: input.title,
      description: input.description,
      isTimeTBD: input.isTimeTBD,
      startTime: input.startTime,
      endTime: input.endTime,
      hostUserId: input.hostUserId,
      visibility: 'public',
      status: EventStatus.Posted,
      participants,
      attachments: [],
      badgeRecords: [],
    };

    db.events = [event, ...db.events];
    return cloneEvent(event);
  },
  async getEvent(eventId) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    return event ? cloneEvent(event) : undefined;
  },
  async joinEvent(eventId, userId, status) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;

    const existing = event.participants.find((item) => item.userId === userId);
    if (existing) {
      existing.status = status;
      if (!existing.joinedAt) existing.joinedAt = new Date().toISOString();
    } else {
      event.participants.push({ userId, status, invited: false, joinedAt: new Date().toISOString() });
    }

    return cloneEvent(event);
  },
  async inviteUsers(eventId, userIds) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;

    userIds.forEach((userId) => {
      if (!event.participants.some((item) => item.userId === userId)) {
        event.participants.push({ userId, status: JoinStatus.Watching, invited: true });
      }
    });

    return cloneEvent(event);
  },
  async removeParticipant(eventId, userId) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;
    event.participants = event.participants.filter((item) => item.userId !== userId);
    return cloneEvent(event);
  },
  async endEvent(eventId) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;
    event.status = EventStatus.Removed;
    event.removedAt = new Date().toISOString();
    return cloneEvent(event);
  },
};

export const mockChatAPI: ChatAPI = {
  async listMessages(eventId) {
    await wait();
    return db.messages.filter((item) => item.eventId === eventId).map((item) => ({ ...item }));
  },
  async sendMessage(eventId, senderUserId, text) {
    await wait();
    const message: Message = {
      id: id('m'),
      eventId,
      senderUserId,
      text,
      createdAt: new Date().toISOString(),
    };
    db.messages.push(message);
    return { ...message };
  },
  async addAttachment(eventId, createdByUserId, type, url) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;
    event.attachments.push({
      id: id('a'),
      eventId,
      type: type === 'Photo' ? AttachmentType.Photo : AttachmentType.Link,
      url,
      createdByUserId,
      createdAt: new Date().toISOString(),
    });
    return cloneEvent(event);
  },
};

export const mockProfileAPI: ProfileAPI = {
  async getMe(userId) {
    await wait();
    const user = db.users.find((entry) => entry.id === userId);
    return user ? { ...user } : undefined;
  },
  async updateProfile(userId, update) {
    await wait();
    const index = db.users.findIndex((entry) => entry.id === userId);
    if (index === -1) return undefined;
    db.users[index] = { ...db.users[index], ...update };
    return { ...db.users[index] };
  },
};

export const mockBadgesAPI: BadgesAPI = {
  async listBadges() {
    await wait();
    return db.badges.map((item) => ({ ...item }));
  },
  async assignBadge(eventId, participantUserId, assignedByUserId, badgeId) {
    await wait();
    const event = db.events.find((entry) => entry.id === eventId);
    if (!event) return undefined;

    const record: BadgeRecord = {
      id: id('br'),
      eventId,
      participantUserId,
      assignedByUserId,
      badgeId,
      createdAt: new Date().toISOString(),
    };

    event.badgeRecords.push(record);
    return { ...record };
  },
};
