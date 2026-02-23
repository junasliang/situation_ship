import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { colors, spacing } from './theme';

type ScreenProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;   // Top-right button (settings/ lists/ filters...)
  children: React.ReactNode; // body contents
  scroll?: boolean;          // Scrollable body
  overlay?: React.ReactNode; // FABs
};

export const Screen = ({
  title,
  subtitle,
  right,
  children,
  scroll = true,
  overlay,
}: ScreenProps) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, padding: spacing.lg }}>
        {(title || subtitle || right) ? (
          <View style={{ gap: spacing.xs, paddingBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                {title ? <View>{title}</View> : null}
              </View>
              {right ? <View style={{ marginLeft: spacing.md }}>{right}</View> : null}
            </View>
            {subtitle ? <View>{subtitle}</View> : null}
          </View>
        ) : null}

        {scroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: spacing.md,
              paddingBottom: 120, // FABs, bottom contents
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, gap: spacing.md }}>{children}</View>
        )}

        {overlay ? <View style={{ position: 'absolute', right: 0, bottom: 0, left: 0, top: 0 }}>{overlay}</View> : null}
      </View>
    </SafeAreaView>
  );
};