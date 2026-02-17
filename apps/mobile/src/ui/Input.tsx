import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { colors, spacing } from './theme';

export const Input = ({ style, ...rest }: TextInputProps) => {
  return (
    <TextInput
      {...rest}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 10,
          backgroundColor: '#fff',
          padding: spacing.md,
          color: colors.text,
        },
        style,
      ]}
      placeholderTextColor={colors.muted}
    />
  );
};
