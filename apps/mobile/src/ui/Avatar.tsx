import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { colors } from './theme';

export const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => {
  const initials = name
    .split(' ')
    .map((item) => item[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dbeafe',
      }}
    >
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: Math.max(11, size / 3) }}>{initials}</Text>
    </View>
  );
};
