import React from 'react';
import { View } from 'react-native';
import { JoinStatus, User } from '../types/models';
import { Avatar } from '../ui/Avatar';
import { Chip } from '../ui/Chip';
import { Text } from '../ui/Text';

export const ParticipantRow = ({
  user,
  status,
  right,
}: {
  user: User;
  status: JoinStatus;
  right?: React.ReactNode;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Avatar name={user.displayName} size={28} />
      <View>
        <Text style={{ fontWeight: '600' }}>{user.displayName}</Text>
        <Chip label={status} />
      </View>
    </View>
    {right}
  </View>
);
