import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { colors, spacing } from './theme';

export const Button = ({
  label,
  onPress,
  style,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'danger';
}) => {
  const background = variant === 'secondary' ? '#e5e7eb' : variant === 'danger' ? colors.danger : colors.primary;
  const color = variant === 'secondary' ? colors.text : colors.primaryText;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: background,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 10,
        alignItems: 'center',
        ...style,
      }}
    >
      <Text style={{ color, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
};
