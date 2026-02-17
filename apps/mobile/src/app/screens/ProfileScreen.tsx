import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useAppStore } from '../../store/AppStore';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => {
  const { currentUser, events, badges, switchUser, users } = useAppStore();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((event) => {
      event.badgeRecords
        .filter((record) => record.participantUserId === currentUser.id)
        .forEach((record) => {
          map[record.badgeId] = (map[record.badgeId] ?? 0) + 1;
        });
    });
    return map;
  }, [currentUser.id, events]);

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Profile</Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Avatar name={currentUser.displayName} size={52} />
          <View>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{currentUser.displayName}</Text>
            <Text>{currentUser.bio || 'No bio yet.'}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Badge Stats</Text>
        <View style={{ gap: 8 }}>
          {badges.map((badge) => (
            <View key={badge.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{badge.label}</Text>
              <Text>{counts[badge.id] ?? 0}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Settings (mock)</Text>
        <Button label="Theme Toggle (Stub)" variant="secondary" onPress={() => {}} />
        <Text style={{ marginTop: 8, fontWeight: '600' }}>Switch demo user</Text>
        <View style={{ gap: 8 }}>
          {users.map((user) => (
            <Button
              key={user.id}
              label={user.displayName}
              variant={user.id === currentUser.id ? 'primary' : 'secondary'}
              onPress={() => switchUser(user.id)}
            />
          ))}
        </View>
        <Button label="Logout to Demo Gate" variant="danger" onPress={onLogout} />
      </Card>
    </Screen>
  );
};
