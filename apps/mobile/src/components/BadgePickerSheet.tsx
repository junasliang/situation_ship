import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Badge, User } from '../types/models';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

export const BadgePickerSheet = ({
  visible,
  onClose,
  participants,
  badges,
  onAssign,
}: {
  visible: boolean;
  onClose: () => void;
  participants: User[];
  badges: Badge[];
  onAssign: (participantUserId: string, badgeId: string) => void;
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(participants[0]?.id);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', padding: 20 }}>
        <Pressable>
          <Card>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>Assign Badge</Text>
            <Text style={{ fontWeight: '600' }}>Choose participant</Text>
            <View style={{ gap: 8 }}>
              {participants.map((participant) => (
                <Button
                  key={participant.id}
                  label={participant.displayName}
                  variant={selectedUserId === participant.id ? 'primary' : 'secondary'}
                  onPress={() => setSelectedUserId(participant.id)}
                />
              ))}
            </View>
            <Text style={{ marginTop: 6, fontWeight: '600' }}>Choose badge</Text>
            <View style={{ gap: 8 }}>
              {badges.map((badge) => (
                <Button
                  key={badge.id}
                  label={badge.label}
                  onPress={() => {
                    if (!selectedUserId) return;
                    onAssign(selectedUserId, badge.id);
                    onClose();
                  }}
                  variant="secondary"
                />
              ))}
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
