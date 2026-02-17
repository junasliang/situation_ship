import React from 'react';
import { Pressable } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from './theme';

export const Chip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) => {
  const body = (
    <Text style={{ color: selected ? colors.primaryText : colors.text, fontSize: 12, fontWeight: '600' }}>{label}</Text>
  );

  if (!onPress) {
    return (
      <Pressable
        style={{
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: 999,
          backgroundColor: selected ? colors.primary : colors.chipBg,
        }}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 999,
        backgroundColor: selected ? colors.primary : colors.chipBg,
      }}
    >
      {body}
    </Pressable>
  );
};
