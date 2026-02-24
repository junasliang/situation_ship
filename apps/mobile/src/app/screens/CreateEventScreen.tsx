import React, { useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useAppStore } from '../../store/AppStore';
import { Event } from '../../types/models';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Screen } from '../../ui/Screen';
import { Text } from '../../ui/Text';
import { Ionicons } from '@expo/vector-icons';

export const CreateEventScreen = ({ 
  onCreated, 
  onBack, 
}: { 
  onCreated: (event: Event) => void; 
  onBack: () => void;
}) => {
  const { users, currentUser, createEvent } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTimeTBD, setIsTimeTBD] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const inviteCandidates = useMemo(() => users.filter((user) => user.id !== currentUser.id), [users, currentUser.id]);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((item) => item !== userId) : [...prev, userId]));
  };

  return (
    <Screen
      titleAlign="center"
      left={
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
      }
      title={<Text style={{ fontSize: 18, fontWeight: '800' }}>Create Event</Text>}
      // subtitle={<Text style={{ opacity: 0.8 }}>Fill in details and invite participants.</Text>}
      scroll
    >
      <Card>
        <Text style={{ fontWeight: '700' }}>Event Info</Text>
        <Input placeholder="Title (required)" value={title} onChangeText={setTitle} />
        <Input placeholder="Description" value={description} onChangeText={setDescription} multiline />
        <Button label={isTimeTBD ? 'Time: TBD' : 'Time: Scheduled'} onPress={() => setIsTimeTBD((value) => !value)} variant="secondary" />
        {!isTimeTBD ? (
          <View style={{ gap: 8 }}>
            <Input placeholder="Start (ISO, e.g. 2026-02-17T19:30:00.000Z)" value={startTime} onChangeText={setStartTime} />
            <Input placeholder="End (ISO)" value={endTime} onChangeText={setEndTime} />
          </View>
        ) : null}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Invite participants</Text>
        <View style={{ gap: 8 }}>
          {inviteCandidates.map((user) => {
            const selected = selectedUserIds.includes(user.id);
            return (
              <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Avatar name={user.displayName} />
                  <Text>{user.displayName}</Text>
                </View>
                <Button label={selected ? 'Invited' : 'Invite'} onPress={() => toggleUser(user.id)} variant={selected ? 'primary' : 'secondary'} />
              </View>
            );
          })}
        </View>
      </Card>

      <Button
        label="Post Event"
        onPress={async () => {
          if (!title.trim()) return;
          const event = await createEvent({
            title: title.trim(),
            description: description.trim(),
            isTimeTBD,
            startTime: isTimeTBD ? undefined : startTime,
            endTime: isTimeTBD ? undefined : endTime,
            invitedUserIds: selectedUserIds,
          });
          if (!event) return;
          setTitle('');
          setDescription('');
          setStartTime('');
          setEndTime('');
          setSelectedUserIds([]);
          onCreated(event);
        }}
      />
    </Screen>
  );
};
