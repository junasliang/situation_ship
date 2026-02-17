import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { JoinStatus } from '../types/models';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { colors } from '../ui/theme';

const statuses = [JoinStatus.Going, JoinStatus.Maybe, JoinStatus.Watching];

export const JoinStatusSheet = ({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (status: JoinStatus) => void;
}) => (
  <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', padding: 20 }}>
      <Pressable>
        <Card>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Choose Join Status</Text>
          <Text style={{ color: colors.muted }}>Pick how you want to appear in this room.</Text>
          <View style={{ gap: 8 }}>
            {statuses.map((status) => (
              <Button key={status} label={status} onPress={() => onPick(status)} variant="secondary" />
            ))}
          </View>
        </Card>
      </Pressable>
    </Pressable>
  </Modal>
);
