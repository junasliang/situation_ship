import React from 'react';
import { View } from 'react-native';
import { Event, EventStatus } from '../../types/models';
import { useAppStore } from '../../store/AppStore';
import { EventCard } from '../../components/EventCard';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const BoardScreen = ({ onOpenEvent }: { onOpenEvent: (event: Event) => void }) => {
  const { events, users, currentUser } = useAppStore();

  const list = events.filter((event) => [EventStatus.Posted, EventStatus.Ongoing].includes(event.status));

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Board</Text>
      <Text style={{ opacity: 0.8 }}>Posted and ongoing events.</Text>
      <View style={{ gap: 10 }}>
        {list.length ? list.map((event) => <EventCard key={event.id} event={event} users={users} currentUserId={currentUser.id} onPress={() => onOpenEvent(event)} />) : <Text>No events yet.</Text>}
      </View>
    </Screen>
  );
};
