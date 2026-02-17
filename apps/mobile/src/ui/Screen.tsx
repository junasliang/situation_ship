import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { colors, spacing } from './theme';

export const Screen = ({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) => {
  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md }}>{children}</View>
    </SafeAreaView>
  );
};
