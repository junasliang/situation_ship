import React from 'react';
import { Event, EventStatus, JoinStatus } from '../../types/models';
import { useAppStore } from '../../store/AppStore';
import { EventCard } from '../../components/EventCard';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const ChatScreen = ({
  onOpenChat,
}: {
  onOpenChat: (event: Event) => void;
}) => {
  const { events, users, currentUser } = useAppStore();

  // FIXME: only joined and maybe join
  const chatEvents = events.filter((event) => {
    if (![EventStatus.Posted, EventStatus.Ongoing].includes(event.status)) return false;

    const me = event.participants.find((p) => p.userId === currentUser.id);
    if (!me) return false;

    return me.status === JoinStatus.Going || me.status === JoinStatus.Maybe;
  });

  return (
    <Screen
      titleAlign="left"
      title={<Text style={{ fontSize: 24, fontWeight: '800' }}>Chat</Text>}
      subtitle={<Text style={{ opacity: 0.8 }}>Events you joined.</Text>}
    >
      {chatEvents.length ? (
        chatEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            users={users}
            currentUserId={currentUser.id}
            onPress={() => onOpenChat(event)}
          />
        ))
      ) : (
        <Text style={{ opacity: 0.8 }}>No joined events yet.</Text>
      )}
    </Screen>
  );
};