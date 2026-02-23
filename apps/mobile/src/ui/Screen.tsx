import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { colors, spacing } from './theme';

type ScreenProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleAlign?: 'left' | 'center';

  right?: React.ReactNode; // Top-right button (settings/ lists/ filters...)
  left?: React.ReactNode;  // Top-left back button

  children: React.ReactNode; // body contents
  scroll?: boolean;          // Scrollable body
  overlay?: React.ReactNode; // FABs
};

const HEADER_SIDE_W = 44; // close to iOS back hit area width

export const Screen = ({
  title,
  subtitle,
  titleAlign = 'left',
  left,
  right,
  children,
  scroll = true,
  overlay,
}: ScreenProps) => {
  const hasHeader = !!(title || subtitle || left || right);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* positioning context for overlay */}
      <View style={{ flex: 1, padding: spacing.lg, position: 'relative' }}>
        {hasHeader ? (
          <View style={{ paddingBottom: spacing.md }}>
            {/* Header row */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {titleAlign === 'center' ? (
                <>
                  {/* Left slot keeps title truly centered */}
                  <View style={{ width: HEADER_SIDE_W, alignItems: 'flex-start' }}>
                    {left ? left : null}
                  </View>

                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {title ? <View>{title}</View> : null}
                  </View>

                  <View style={{ width: HEADER_SIDE_W, alignItems: 'flex-end' }}>
                    {right ? right : null}
                  </View>
                </>
              ) : (
                <>
                  {/* Left-aligned title (root pages) */}
                  {left ? <View style={{ marginRight: spacing.md }}>{left}</View> : null}

                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    {title ? <View>{title}</View> : null}
                  </View>

                  {right ? <View style={{ marginLeft: spacing.md }}>{right}</View> : null}
                </>
              )}
            </View>

            {/* Subtitle under header */}
            {subtitle ? <View style={{ marginTop: spacing.xs }}>{subtitle}</View> : null}
          </View>
        ) : null}

        {/* Body */}
        {scroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: spacing.md,
              paddingBottom: 120, // reserve for FAB / bottom overlay
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, gap: spacing.md }}>{children}</View>
        )}

        {/* Overlay (FAB etc.) */}
        {overlay ? (
          <View
            pointerEvents="box-none"
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          >
            {overlay}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};