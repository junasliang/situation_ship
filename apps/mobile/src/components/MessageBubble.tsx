import React from 'react';
import { View } from 'react-native';
import { Message, User } from '../types/models';
import { Text } from '../ui/Text';
import { colors } from '../ui/theme';
import { formatTimeOnly } from '../utils/time';
import { Avatar } from '../ui/Avatar';

export const MessageBubble = ({
  message,
  sender,
  mine,
  showAvatar,
  showName,
  groupTop,
  groupBottom,
}: {
  message: Message;
  sender?: User;
  mine: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  groupTop?: boolean;
  groupBottom?: boolean;
}) => (
  <View
    style={{
      flexDirection: mine ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 8,

      marginTop: groupTop ? 12 : 2,
    }}
  >

    {/* Avatar slot */}
    {!mine ? (
      <View style={{ width: 36 }}>
        {showAvatar ? (
          <Avatar name={sender?.displayName ?? '?'} />
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
    ) : null}

    <View style={{ maxWidth: '75%' }}>

      {/* Name */}
      {!mine && showName ? (
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          {sender?.displayName}
        </Text>
      ) : null}

      <View
        style={{
          padding: 10,
          borderRadius: 16,
          backgroundColor: mine ? colors.primary : '#eef2ff',

          // bubble grouping shape
          borderTopLeftRadius: !mine && !groupTop ? 6 : 16,
          borderBottomLeftRadius: !mine && !groupBottom ? 6 : 16,

          borderTopRightRadius: mine && !groupTop ? 6 : 16,
          borderBottomRightRadius: mine && !groupBottom ? 6 : 16,
        }}
      >
        <Text style={{ color: mine ? '#fff' : colors.text }}>
          {message.text}
        </Text>
      </View>
    </View>
  </View>
);