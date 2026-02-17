import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAppStore } from '../../store/AppStore';
import { Event } from '../../types/models';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';

export const ManageParticipantsScreen = ({ event, onBack }: { event: Event; onBack: () => void }) => {
  const { users, inviteUsers, removeParticipant } = useAppStore();
  const [query, setQuery] = useState('');

  const currentIds = new Set(event.participants.map((participant) => participant.userId));
  const candidates = useMemo(
    () =>
      users.filter((user) => {
        if (user.id === event.hostUserId) return false;
        if (!query.trim()) return true;
        return user.displayName.toLowerCase().includes(query.trim().toLowerCase());
      }),
    [users, event.hostUserId, query]
  );

  return (
    <Screen>
      <Button label="Back" variant="secondary" onPress={onBack} />
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Manage Participants</Text>
      <Input placeholder="Search user" value={query} onChangeText={setQuery} />
      <Card>
        <Text style={{ fontWeight: '700' }}>Invite / Remove</Text>
        <View style={{ gap: 8 }}>
          {candidates.map((user) => {
            const inEvent = currentIds.has(user.id);
            return (
              <View key={user.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{user.displayName}</Text>
                {inEvent ? (
                  <Button label="Remove" variant="danger" onPress={() => removeParticipant(event.id, user.id)} />
                ) : (
                  <Button label="Invite" variant="secondary" onPress={() => inviteUsers(event.id, [user.id])} />
                )}
              </View>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
};
