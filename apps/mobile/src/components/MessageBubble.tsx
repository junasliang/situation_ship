import React from 'react';
import { View } from 'react-native';
import { Message, User } from '../types/models';
import { Text } from '../ui/Text';
import { colors } from '../ui/theme';
import { formatTimeOnly } from '../utils/time';

export const MessageBubble = ({
  message,
  sender,
  mine,
}: {
  message: Message;
  sender?: User;
  mine: boolean;
}) => (
  <View style={{ alignItems: mine ? 'flex-end' : 'flex-start' }}>
    <View
      style={{
        maxWidth: '85%',
        padding: 10,
        borderRadius: 12,
        backgroundColor: mine ? colors.primary : '#eef2ff',
      }}
    >
      {!mine ? <Text style={{ fontSize: 11, fontWeight: '700', marginBottom: 2 }}>{sender?.displayName ?? 'Unknown'}</Text> : null}
      <Text style={{ color: mine ? '#fff' : colors.text }}>{message.text}</Text>
      <Text style={{ marginTop: 4, fontSize: 10, color: mine ? '#d1fae5' : colors.muted }}>{formatTimeOnly(message.createdAt)}</Text>
    </View>
  </View>
);
