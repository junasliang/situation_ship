import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { spacing } from './theme';

export const BadgePill = ({ label }: { label: string }) => (
  <View
    style={{
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: '#fef3c7',
      borderRadius: 999,
      alignSelf: 'flex-start',
    }}
  >
    <Text style={{ fontSize: 12, fontWeight: '600', color: '#92400e' }}>{label}</Text>
  </View>
);
