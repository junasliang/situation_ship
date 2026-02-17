import React from 'react';
import { Pressable, View } from 'react-native';
import { Event, JoinStatus, User } from '../types/models';
import { formatDateTime } from '../utils/time';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Text } from '../ui/Text';

export const EventCard = ({
  event,
  users,
  currentUserId,
  onPress,
}: {
  event: Event;
  users: User[];
  currentUserId: string;
  onPress: () => void;
}) => {
  const host = users.find((user) => user.id === event.hostUserId);
  const myParticipant = event.participants.find((item) => item.userId === currentUserId);
  const joinedCount = event.participants.filter((item) => !!item.joinedAt).length;

  return (
    <Pressable onPress={onPress}>
      <Card>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>{event.title}</Text>
        <Text style={{ fontSize: 13, opacity: 0.8 }}>Host: {host?.displayName ?? 'Unknown'}</Text>
        <Text style={{ fontSize: 13 }}>{event.isTimeTBD ? 'Time: TBD' : `${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}`}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 12 }}>{joinedCount} joined</Text>
          {myParticipant ? <Chip label={myParticipant.status} selected={myParticipant.status === JoinStatus.Going} /> : <Chip label="Not joined" />}
        </View>
      </Card>
    </Pressable>
  );
};
