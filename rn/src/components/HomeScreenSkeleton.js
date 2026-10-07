import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const SIDE = 20;
const CONTENT_WIDTH = width - SIDE * 2;

function SkeletonBlock({ style, baseColor, highlightColor, shimmerTranslate }) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.block, { backgroundColor: baseColor }, style]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX: shimmerTranslate }, { skewX: '-18deg' }],
          },
        ]}
      />
    </View>
  );
}

export default function HomeScreenSkeleton() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const shimmerProgress = useRef(new Animated.Value(0)).current;
  const shimmerAnimation = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startAnimation = async () => {
      const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      if (!mounted || reduceMotion) return;

      shimmerAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerProgress, {
            toValue: 1,
            duration: 1150,
            useNativeDriver: true,
          }),
          Animated.delay(180),
        ])
      );
      shimmerAnimation.current.start();
    };

    startAnimation();

    return () => {
      mounted = false;
      shimmerAnimation.current?.stop();
    };
  }, [shimmerProgress]);

  const baseColor = colors.surfaceVariant;
  const highlightColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.72)';
  const cardColor = colors.cardBackground;
  const shimmerTranslate = shimmerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-110, CONTENT_WIDTH + 110],
  });
  const blockProps = { baseColor, highlightColor, shimmerTranslate };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 10),
            paddingBottom: Math.max(insets.bottom, 100),
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <SkeletonBlock {...blockProps} style={styles.greetingLine} />
            <SkeletonBlock {...blockProps} style={styles.nameLine} />
          </View>
          <SkeletonBlock {...blockProps} style={styles.avatar} />
          <SkeletonBlock {...blockProps} style={styles.notification} />
        </View>

        <View style={[styles.walletCard, { backgroundColor: '#171717' }]}>
          <View style={styles.walletTop}>
            <SkeletonBlock {...blockProps} style={styles.walletSelector} />
            <SkeletonBlock {...blockProps} style={styles.walletSwitch} />
          </View>
          <SkeletonBlock {...blockProps} style={styles.balanceLabel} />
          <SkeletonBlock {...blockProps} style={styles.balanceAmount} />
          <View style={styles.walletActions}>
            <SkeletonBlock {...blockProps} style={styles.walletPill} />
            <SkeletonBlock {...blockProps} style={styles.walletPill} />
          </View>
        </View>

        <SkeletonBlock {...blockProps} style={styles.promo} />

        <View style={styles.quickActionsCard}>
          {[0, 1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.quickAction}>
              <SkeletonBlock {...blockProps} style={styles.quickActionIcon} />
              <SkeletonBlock {...blockProps} style={styles.quickActionLabel} />
            </View>
          ))}
        </View>

        <View style={[styles.txCard, { backgroundColor: cardColor, borderColor: baseColor }]}>
          <View style={styles.sectionHeading}>
            <SkeletonBlock {...blockProps} style={styles.headingLineLong} />
            <SkeletonBlock {...blockProps} style={styles.headingAction} />
          </View>
          {[0, 1, 2].map((item) => (
            <View key={item} style={styles.transaction}>
              <SkeletonBlock {...blockProps} style={styles.transactionIcon} />
              <View style={styles.transactionDetails}>
                <SkeletonBlock {...blockProps} style={styles.transactionTitle} />
                <SkeletonBlock {...blockProps} style={styles.transactionMeta} />
              </View>
              <SkeletonBlock {...blockProps} style={styles.transactionAmount} />
            </View>
          ))}
        </View>

        <SkeletonBlock {...blockProps} style={styles.headingLine} />
        <View style={[styles.txCard, { backgroundColor: cardColor, borderColor: baseColor }]}>
          {[0, 1].map((item) => (
            <View key={item} style={styles.transaction}>
              <SkeletonBlock {...blockProps} style={styles.earnIcon} />
              <View style={styles.transactionDetails}>
                <SkeletonBlock {...blockProps} style={styles.transactionTitle} />
                <SkeletonBlock {...blockProps} style={styles.transactionMeta} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SIDE,
  },
  block: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 76,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerCopy: { flex: 1 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  greetingLine: {
    width: 92,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  nameLine: {
    width: 150,
    height: 24,
    borderRadius: 8,
  },
  notification: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  walletCard: {
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  promo: {
    height: 58,
    borderRadius: 29,
    marginBottom: 16,
  },
  txCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    marginBottom: 8,
  },
  earnIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 12,
  },
  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletSelector: {
    width: 118,
    height: 26,
    borderRadius: 8,
  },
  walletSwitch: {
    width: 72,
    height: 26,
    borderRadius: 13,
  },
  balanceLabel: {
    width: 104,
    height: 10,
    borderRadius: 5,
    marginBottom: 7,
  },
  balanceAmount: {
    width: 180,
    height: 27,
    borderRadius: 8,
    marginBottom: 18,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletPill: {
    width: 102,
    height: 31,
    borderRadius: 10,
  },
  walletPillWide: {
    width: 126,
    height: 31,
    borderRadius: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headingLine: {
    width: 104,
    height: 16,
    borderRadius: 8,
  },
  headingLineShort: {
    width: 92,
    height: 14,
    borderRadius: 7,
  },
  headingLineLong: {
    width: 142,
    height: 14,
    borderRadius: 7,
  },
  headingAction: {
    width: 48,
    height: 12,
    borderRadius: 6,
  },
  quickActionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 28,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginBottom: 8,
  },
  quickActionLabel: {
    width: 42,
    height: 10,
    borderRadius: 5,
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '23.5%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  serviceIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    marginBottom: 6,
  },
  serviceLabel: {
    width: '62%',
    height: 8,
    borderRadius: 4,
  },
  transactionList: {
    marginBottom: 8,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    width: '76%',
    height: 12,
    borderRadius: 6,
    marginBottom: 7,
  },
  transactionMeta: {
    width: '48%',
    height: 9,
    borderRadius: 5,
  },
  transactionValue: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    width: 82,
    height: 12,
    borderRadius: 6,
    marginBottom: 7,
  },
  transactionStatus: {
    width: 62,
    height: 18,
    borderRadius: 8,
  },
  rewardBanner: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    marginBottom: 14,
  },
});
