import React from 'react';
import { View } from 'react-native';
import { useAppStore, getMyArchiveEvents } from '../../store/AppStore';
import { Event } from '../../types/models';
import { BadgePill } from '../../ui/BadgePill';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';
import { formatDateTime } from '../../utils/time';

export const ArchiveScreen = ({ onOpen }: { onOpen: (event: Event) => void }) => {
  const { events, currentUser, badges } = useAppStore();

  const items = getMyArchiveEvents(events, currentUser.id);

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Archive</Text>
      <Text style={{ opacity: 0.8 }}>Ended rooms keep media and links here.</Text>
      <View style={{ gap: 10 }}>
        {items.map((event) => {
          const me = event.participants.find((participant) => participant.userId === currentUser.id);
          const myBadges = event.badgeRecords
            .filter((record) => record.participantUserId === currentUser.id)
            .map((record) => badges.find((badge) => badge.id === record.badgeId)?.label)
            .filter((label): label is string => !!label);

          return (
            <Card key={event.id}>
              <Text style={{ fontWeight: '700', fontSize: 17 }}>{event.title}</Text>
              <Text>{formatDateTime(event.startTime)}</Text>
              <Text>Your status: {me?.status ?? 'Unknown'}</Text>
              <Text>Attachments: {event.attachments.length}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {myBadges.length ? myBadges.map((label, idx) => <BadgePill key={`${event.id}-${label}-${idx}`} label={label} />) : <Text>No badges</Text>}
              </View>
              <Text style={{ color: '#0f766e', fontWeight: '600' }} onPress={() => onOpen(event)}>
                Open Archive Detail
              </Text>
            </Card>
          );
        })}
        {!items.length ? <Text>No archive items yet.</Text> : null}
      </View>
    </Screen>
  );
};
