import React from 'react';
import { View } from 'react-native';
import { useAppStore } from '../../store/AppStore';
import { AttachmentType, Event } from '../../types/models';
import { BadgePill } from '../../ui/BadgePill';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const ArchiveDetailScreen = ({ event, onBack }: { event: Event; onBack: () => void }) => {
  const { currentUser, badges } = useAppStore();

  const links = event.attachments.filter((item) => item.type === AttachmentType.Link);
  const photos = event.attachments.filter((item) => item.type === AttachmentType.Photo);
  const myBadges = event.badgeRecords
    .filter((item) => item.participantUserId === currentUser.id)
    .map((item) => badges.find((badge) => badge.id === item.badgeId)?.label)
    .filter((label): label is string => !!label);

  return (
    <Screen>
      <Button label="Back" variant="secondary" onPress={onBack} />
      <Text style={{ fontSize: 24, fontWeight: '800' }}>{event.title}</Text>
      <Text>{event.description || 'No event description'}</Text>

      <Card>
        <Text style={{ fontWeight: '700' }}>Links</Text>
        <View style={{ gap: 6 }}>
          {links.length ? links.map((link) => <Text key={link.id} style={{ color: '#0f766e' }}>{link.url}</Text>) : <Text>No links</Text>}
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Photos (placeholder)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {photos.length
            ? photos.map((photo, idx) => (
                <View key={photo.id} style={{ width: 92, height: 92, borderRadius: 10, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Photo {idx + 1}</Text>
                </View>
              ))
            : <Text>No photos</Text>}
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Badges Received</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {myBadges.length ? myBadges.map((label, idx) => <BadgePill key={`${label}-${idx}`} label={label} />) : <Text>No badges</Text>}
        </View>
      </Card>
    </Screen>
  );
};
