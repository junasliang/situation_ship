import { seedBadges, seedEvents, seedMessages, seedUsers } from './seed';
import { Badge, Event, Message, User } from '../types/models';

interface MockDB {
  users: User[];
  events: Event[];
  messages: Message[];
  badges: Badge[];
}

export const db: MockDB = {
  users: [...seedUsers],
  events: [...seedEvents],
  messages: [...seedMessages],
  badges: [...seedBadges],
};

export const resetDB = () => {
  db.users = [...seedUsers];
  db.events = [...seedEvents];
  db.messages = [...seedMessages];
  db.badges = [...seedBadges];
};
