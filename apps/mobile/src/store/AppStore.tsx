import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../mock/db';
import { mockBadgesAPI, mockChatAPI, mockEventsAPI } from '../services/api';
import {
  AttachmentType,
  Badge,
  Event,
  EventStatus,
  JoinStatus,
  Message,
  User,
} from '../types/models';

interface AppStoreValue {
  currentUser: User;
  users: User[];
  events: Event[];
  badges: Badge[];
  messagesByEvent: Record<string, Message[]>;
  switchUser: (userId: string) => void;
  createEvent: (input: {
    title: string;
    description?: string;
    isTimeTBD: boolean;
    startTime?: string;
    endTime?: string;
    invitedUserIds: string[];
  }) => Promise<Event | undefined>;
  joinEvent: (eventId: string, status: JoinStatus) => Promise<void>;
  inviteUsers: (eventId: string, userIds: string[]) => Promise<void>;
  removeParticipant: (eventId: string, userId: string) => Promise<void>;
  endEvent: (eventId: string) => Promise<void>;
  sendMessage: (eventId: string, text: string) => Promise<void>;
  ensureMessagesLoaded: (eventId: string) => Promise<void>;
  addAttachment: (eventId: string, type: AttachmentType, url: string) => Promise<void>;
  assignBadge: (eventId: string, participantUserId: string, badgeId: string) => Promise<void>;
}

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState(db.users[0]?.id ?? '');
  const [users] = useState<User[]>(db.users);
  const [badges, setBadges] = useState<Badge[]>(db.badges);
  const [events, setEvents] = useState<Event[]>([]);
  const [messagesByEvent, setMessagesByEvent] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    mockEventsAPI.listEvents().then(setEvents);
    mockBadgesAPI.listBadges().then(setBadges);
  }, []);

  const currentUser = useMemo(() => {
    return users.find((user) => user.id === currentUserId) ?? users[0];
  }, [currentUserId, users]);

  const refreshEvent = (updated?: Event) => {
    if (!updated) return;
    setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const value: AppStoreValue = {
    currentUser,
    users,
    badges,
    events,
    messagesByEvent,
    switchUser: (userId) => setCurrentUserId(userId),
    createEvent: async (input) => {
      if (!currentUser) return undefined;
      const created = await mockEventsAPI.createEvent({ ...input, hostUserId: currentUser.id });
      setEvents((prev) => [created, ...prev]);
      return created;
    },
    joinEvent: async (eventId, status) => {
      if (!currentUser) return;
      const updated = await mockEventsAPI.joinEvent(eventId, currentUser.id, status);
      refreshEvent(updated);
    },
    inviteUsers: async (eventId, userIds) => {
      const updated = await mockEventsAPI.inviteUsers(eventId, userIds);
      refreshEvent(updated);
    },
    removeParticipant: async (eventId, userId) => {
      const updated = await mockEventsAPI.removeParticipant(eventId, userId);
      refreshEvent(updated);
    },
    endEvent: async (eventId) => {
      const updated = await mockEventsAPI.endEvent(eventId);
      refreshEvent(updated);
    },
    sendMessage: async (eventId, text) => {
      if (!currentUser || !text.trim()) return;
      const newMessage = await mockChatAPI.sendMessage(eventId, currentUser.id, text.trim());
      setMessagesByEvent((prev) => ({
        ...prev,
        [eventId]: [...(prev[eventId] ?? []), newMessage],
      }));
    },
    ensureMessagesLoaded: async (eventId) => {
      if (messagesByEvent[eventId]) return;
      const messages = await mockChatAPI.listMessages(eventId);
      setMessagesByEvent((prev) => ({ ...prev, [eventId]: messages }));
    },
    addAttachment: async (eventId, type, url) => {
      if (!currentUser || !url.trim()) return;
      const updated = await mockChatAPI.addAttachment(eventId, currentUser.id, type, url.trim());
      refreshEvent(updated);
    },
    assignBadge: async (eventId, participantUserId, badgeId) => {
      if (!currentUser) return;
      const created = await mockBadgesAPI.assignBadge(eventId, participantUserId, currentUser.id, badgeId);
      if (!created) return;
      setEvents((prev) =>
        prev.map((item) =>
          item.id !== eventId
            ? item
            : {
                ...item,
                badgeRecords: [...item.badgeRecords, created],
              }
        )
      );
    },
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return context;
};

export const getMyArchiveEvents = (events: Event[], userId: string) =>
  events.filter(
    (event) =>
      [EventStatus.Ended, EventStatus.Archived, EventStatus.Removed].includes(event.status) &&
      event.participants.some((participant) => participant.userId === userId)
  );
