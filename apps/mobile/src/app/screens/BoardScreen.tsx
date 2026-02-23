import React from 'react';
import { Pressable } from 'react-native';
import { Event, EventStatus } from '../../types/models';
import { useAppStore } from '../../store/AppStore';
import { EventCard } from '../../components/EventCard';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const BoardScreen = ({ onOpenEvent }: { onOpenEvent: (event: Event) => void }) => {
  const { events, users, currentUser } = useAppStore();

  const list = events.filter((event) =>
    [EventStatus.Posted, EventStatus.Ongoing].includes(event.status)
  );

  return (
    <Screen
      title={<Text style={{ fontSize: 24, fontWeight: '800' }}>Board</Text>}
      subtitle={<Text style={{ opacity: 0.8 }}>Posted and ongoing events.</Text>}
      overlay={
        <Pressable
          onPress={() => {}}
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