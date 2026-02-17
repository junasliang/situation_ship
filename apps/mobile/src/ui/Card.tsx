import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, spacing } from './theme';

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.line,
        padding: spacing.lg,
        gap: spacing.sm,
        ...style,
      }}
    >
      {children}
    </View>
  );
};
