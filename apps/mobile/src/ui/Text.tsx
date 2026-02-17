import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { colors } from './theme';

export const Text = ({ style, ...rest }: TextProps) => {
  return <RNText {...rest} style={[{ color: colors.text }, style]} />;
};
