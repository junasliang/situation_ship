import {
  AttachmentType,
  Badge,
  Event,
  EventStatus,
  JoinStatus,
  Message,
  User,
} from '../types/models';

const now = Date.now();

export const seedUsers: User[] = [
  { id: 'u1', displayName: 'Alex Host', bio: 'Always organizing plans.' },
  { id: 'u2', displayName: 'Mina Guest', bio: 'Maybe means maybe.' },
  { id: 'u3', displayName: 'Jay Watcher', bio: 'Observing from the sidelines.' },
  { id: 'u4', displayName: 'Noah Helper', bio: 'Here to help.' },
];

export const seedBadges: Badge[] = [
  { id: 'b1', label: 'Spilled Drink' },
  { id: 'b2', label: 'Asked Silly Question' },
  { id: 'b3', label: 'MVP Helper' },
  { id: 'b4', label: 'Custom (Stub)' },
];

export const seedEvents: Event[] = [
  {
    id: 'e1',
    title: 'Downtown Coffee Run',
    description: 'Quick meetup before work.',
    isTimeTBD: false,
    startTime: new Date(now + 60 * 60 * 1000).toISOString(),
    endTime: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
    hostUserId: 'u1',
    visibility: 'public',
    status: EventStatus.Posted,
    participants: [
      { userId: 'u1', status: JoinStatus.Going, invited: true, joinedAt: new Date(now - 10000).toISOString() },
      { userId: 'u2', status: JoinStatus.Maybe, invited: true, joinedAt: new Date(now - 8000).toISOString() },
      { userId: 'u3', status: JoinStatus.Watching, invited: true },
    ],
    attachments: [],
    badgeRecords: [],
  },
  {
    id: 'e2',
    title: 'Board Game Night',
    description: 'Bring one game each.',
    isTimeTBD: true,
    hostUserId: 'u2',
    visibility: 'public',
    status: EventStatus.Posted,
    participants: [{ userId: 'u2', status: JoinStatus.Going, invited: true, joinedAt: new Date(now - 12000).toISOString() }],
    attachments: [],
    badgeRecords: [],
  },
  {
    id: 'e3',
    title: 'Past Sushi Meetup',
    description: 'Already wrapped. Archive sample.',
    isTimeTBD: false,
    startTime: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    hostUserId: 'u1',
    visibility: 'public',
    status: EventStatus.Removed,
    participants: [
      { userId: 'u1', status: JoinStatus.Going, invited: true, joinedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString() },
      { userId: 'u4', status: JoinStatus.Going, invited: true, joinedAt: new Date(now - 7 * 60 * 60 * 1000).toISOString() },
    ],
    attachments: [
      {
        id: 'a1',
        eventId: 'e3',
        type: AttachmentType.Link,
        url: 'https://example.com/photos',
        createdByUserId: 'u4',
        createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'a2',
        eventId: 'e3',
        type: AttachmentType.Photo,
        url: 'placeholder://photo-1',
        createdByUserId: 'u1',
        createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      },
    ],
    badgeRecords: [
      {
        id: 'br1',
        eventId: 'e3',
        participantUserId: 'u4',
        assignedByUserId: 'u1',
        badgeId: 'b3',
        createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
    removedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const seedMessages: Message[] = [
  {
    id: 'm1',
    eventId: 'e1',
    senderUserId: 'u1',
    text: 'Who wants cappuccino?',
    createdAt: new Date(now - 300000).toISOString(),
  },
  {
    id: 'm2',
    eventId: 'e1',
    senderUserId: 'u2',
    text: 'Maybe me. Save me a seat.',
    createdAt: new Date(now - 200000).toISOString(),
  },
];
