import React from 'react';
import { Pressable } from 'react-native';
import { Event, EventStatus, JoinStatus } from '../../types/models';
import { useAppStore } from '../../store/AppStore';
import { EventCard } from '../../components/EventCard';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const BoardScreen = ({ 
  onOpenEvent,
  onCreateEvent,
}: { 
  onOpenEvent: (event: Event) => void;
  onCreateEvent: () => void;
}) => {
  const { events, users, currentUser } = useAppStore();

  // Event filter for board
  const list = events.filter((event) => {
    if (![EventStatus.Posted, EventStatus.Ongoing].includes(event.status)) return false;
    
    const me = event.participants.find((p) => p.userId === currentUser.id);

    const related = event.hostUserId === currentUser.id || !!me;
    if (!related) return false;

    if (me && (me.status === JoinStatus.Going || me.status === JoinStatus.Maybe)) {
      return false;
    }

    return true;
  });

  return (
    <Screen
      titleAlign="left"
      title={<Text style={{ fontSize: 24, fontWeight: '800' }}>Board</Text>}
      subtitle={<Text style={{ opacity: 0.8 }}>Posted and ongoing events.</Text>}
      overlay={
        <Pressable
          onPress={onCreateEvent}
          style={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#007AFF',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}
          hitSlop={12}
        >
          <Text style={{ color: 'white', fontSize: 28, lineHeight: 28 }}>+</Text>
        </Pressable>
      }
    >
      {list.length ? (
        list.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            users={users}
            currentUserId={currentUser.id}
            onPress={() => onOpenEvent(event)}
          />
        ))
      ) : (
        <Text>No events yet.</Text>
      )}
    </Screen>
  );
};