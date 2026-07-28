import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const COMPACT_TAB_BAR_HEIGHT = 64;
const SKELETON_TAB_GAP = 8;

function Block({ style, baseColor, highlightColor, translateX }) {
  return (
    <View style={[styles.block, { backgroundColor: baseColor }, style]}>
      <Animated.View
        style={[
          styles.highlight,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX }, { skewX: '-18deg' }],
          },
        ]}
      />
    </View>
  );
}

export default function ScreenTransitionSkeleton({ routeName }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef(null);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!mounted || reduceMotion) return;
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.delay(150),
        ])
      );
      animation.current.start();
    });

    return () => {
      mounted = false;
      animation.current?.stop();
    };
  }, [progress]);

  const baseColor = isDark ? '#242832' : '#E9ECF2';
  const highlightColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.72)';
  const cardColor = isDark ? '#181B22' : '#FFFFFF';
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100],
  });
  const blockProps = { baseColor, highlightColor, translateX };
  const contentProps = { blockProps, cardColor };

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 54,
          bottom:
            Math.max(insets.bottom, 10) +
            COMPACT_TAB_BAR_HEIGHT +
            SKELETON_TAB_GAP,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading screen"
    >
      {routeName === 'Cards' ? (
        <CardsSkeleton {...contentProps} />
      ) : routeName === 'Stats' ? (
        <StatsSkeleton {...contentProps} />
      ) : routeName === 'More' ? (
        <MoreSkeleton {...contentProps} />
      ) : (
        <DefaultSkeleton {...contentProps} />
      )}
    </View>
  );
}

function CenteredHeader({ blockProps, action = false }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />
      <Block {...blockProps} style={styles.headerTitle} />
      {action ? <Block {...blockProps} style={styles.headerAction} /> : <View style={styles.headerSpacer} />}
    </View>
  );
}

function CardsSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <CenteredHeader blockProps={blockProps} />
      <View
        style={[
          styles.emptyCardSkeleton,
          { backgroundColor: cardColor, borderColor: blockProps.baseColor },
        ]}
      >
        <Block {...blockProps} style={styles.emptyCardArtwork} />
        <Block {...blockProps} style={styles.emptyCardHeading} />
        <Block {...blockProps} style={styles.emptyCardCopyLong} />
        <Block {...blockProps} style={styles.emptyCardCopyShort} />
        <Block {...blockProps} style={styles.emptyCardButton} />
      </View>
    </>
  );
}

function StatsSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <CenteredHeader blockProps={blockProps} />
      <Block {...blockProps} style={styles.balanceLabel} />
      <Block {...blockProps} style={styles.balanceAmount} />
      <View style={styles.rangeRow}>
        {[0, 1, 2, 3, 4].map((item) => (
          <Block key={item} {...blockProps} style={styles.rangePill} />
        ))}
      </View>
      <View style={[styles.chartCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.chartTitle} />
        <View style={styles.chartMeta}>
          <Block {...blockProps} style={styles.chartMetaLeft} />
          <Block {...blockProps} style={styles.chartMetaRight} />
        </View>
        <View style={styles.chartBars}>
          {[72, 112, 88, 154, 126, 176].map((height, index) => (
            <Block key={index} {...blockProps} style={[styles.chartBar, { height }]} />
          ))}
        </View>
        <View style={styles.chartLegend}>
          {[0, 1, 2].map((item) => (
            <Block key={item} {...blockProps} style={styles.legendItem} />
          ))}
        </View>
      </View>
      <View style={styles.sectionHeadingSecondary}>
        <Block {...blockProps} style={styles.sectionTitleShort} />
      </View>
      {[0, 1].map((item) => (
        <SkeletonRow key={item} blockProps={blockProps} cardColor={cardColor} />
      ))}
    </>
  );
}

function MoreSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <CenteredHeader blockProps={blockProps} />
      <View style={[styles.profileCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.profileAvatar} />
        <View style={styles.profileCopy}>
          <Block {...blockProps} style={styles.profileName} />
          <Block {...blockProps} style={styles.profileDetail} />
          <Block {...blockProps} style={styles.profileDetailShort} />
        </View>
      </View>
      <View style={[styles.menuCard, { backgroundColor: cardColor }]}>
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.menuRow}>
            <Block {...blockProps} style={styles.menuIcon} />
            <Block {...blockProps} style={styles.menuTitle} />
            <Block {...blockProps} style={styles.menuAction} />
          </View>
        ))}
      </View>
    </>
  );
}

function SkeletonRow({ blockProps, cardColor }) {
  return (
    <View style={[styles.rowCard, { backgroundColor: cardColor }]}>
      <Block {...blockProps} style={styles.rowIcon} />
      <View style={styles.rowCopy}>
        <Block {...blockProps} style={styles.rowTitle} />
        <Block {...blockProps} style={styles.rowSubtitle} />
      </View>
      <Block {...blockProps} style={styles.rowValue} />
    </View>
  );
}

function DefaultSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <View style={styles.header}>
        <Block {...blockProps} style={styles.backButton} />
        <Block {...blockProps} style={styles.headerTitle} />
        <View style={styles.headerSpacer} />
      </View>
      <View style={[styles.heroCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.heroEyebrow} />
        <Block {...blockProps} style={styles.heroTitle} />
        <Block {...blockProps} style={styles.heroSubtitle} />
      </View>
      <View style={styles.sectionHeading}>
        <Block {...blockProps} style={styles.sectionTitle} />
        <Block {...blockProps} style={styles.sectionAction} />
      </View>
      {[0, 1, 2].map((item) => (
        <SkeletonRow key={item} blockProps={blockProps} cardColor={cardColor} />
      ))}
      <View style={styles.sectionHeadingSecondary}>
        <Block {...blockProps} style={styles.sectionTitleShort} />
      </View>
      <View style={[styles.detailCard, { backgroundColor: cardColor }]}>
        <Block {...blockProps} style={styles.detailLineLong} />
        <Block {...blockProps} style={styles.detailLine} />
        <Block {...blockProps} style={styles.detailButton} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
    elevation: 10000,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  block: {
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 72,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerTitle: {
    width: 126,
    height: 18,
    borderRadius: 9,
  },
  headerSpacer: {
    width: 38,
  },
  headerAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 5,
  },
  emptyCardSkeleton: {
    minHeight: 590,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 38,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 28,
  },
  emptyCardArtwork: {
    width: '82%',
    height: 230,
    borderRadius: 80,
    marginBottom: 24,
  },
  emptyCardHeading: {
    width: 188,
    height: 22,
    borderRadius: 11,
    marginBottom: 17,
  },
  emptyCardCopyLong: {
    width: 260,
    height: 13,
    borderRadius: 7,
    marginBottom: 9,
  },
  emptyCardCopyShort: {
    width: 176,
    height: 13,
    borderRadius: 7,
  },
  emptyCardButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginTop: 34,
  },
  tabSwitch: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 4,
    borderRadius: 25,
  },
  tabPill: {
    flex: 1,
    height: 42,
    borderRadius: 21,
  },
  cardsBalance: {
    width: 112,
    height: 18,
    borderRadius: 9,
    marginTop: 30,
    marginBottom: 20,
  },
  virtualCardSkeleton: {
    height: 200,
    borderRadius: 20,
    padding: 20,
  },
  virtualCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  virtualCardSmall: {
    width: 58,
    height: 12,
    borderRadius: 6,
  },
  virtualCardChip: {
    width: 40,
    height: 30,
    borderRadius: 5,
    marginTop: 18,
  },
  virtualCardNumber: {
    width: '82%',
    height: 21,
    borderRadius: 7,
    marginTop: 22,
  },
  virtualCardName: {
    width: '52%',
    height: 12,
    borderRadius: 6,
    marginTop: 25,
  },
  tapHint: {
    width: 126,
    height: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 15,
  },
  limitCardSkeleton: {
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitTitle: {
    width: 108,
    height: 15,
    borderRadius: 8,
  },
  limitEdit: {
    width: 62,
    height: 34,
    borderRadius: 17,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  limitLabel: {
    width: 142,
    height: 11,
    borderRadius: 6,
  },
  limitValue: {
    width: 44,
    height: 11,
    borderRadius: 6,
  },
  balanceLabel: {
    width: 102,
    height: 11,
    borderRadius: 6,
    marginBottom: 8,
  },
  balanceAmount: {
    width: 148,
    height: 28,
    borderRadius: 9,
    marginBottom: 20,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  rangePill: {
    width: '18%',
    height: 34,
    borderRadius: 17,
  },
  chartCard: {
    height: 338,
    borderRadius: 20,
    padding: 18,
  },
  chartTitle: {
    width: 132,
    height: 15,
    borderRadius: 8,
  },
  chartMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chartMetaLeft: {
    width: 70,
    height: 10,
    borderRadius: 5,
  },
  chartMetaRight: {
    width: 116,
    height: 10,
    borderRadius: 5,
  },
  chartBars: {
    height: 192,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  chartBar: {
    width: 28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  legendItem: {
    width: '29%',
    height: 10,
    borderRadius: 5,
  },
  profileCard: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileCopy: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    width: '72%',
    height: 16,
    borderRadius: 8,
    marginBottom: 11,
  },
  profileDetail: {
    width: '90%',
    height: 11,
    borderRadius: 6,
    marginBottom: 9,
  },
  profileDetailShort: {
    width: '68%',
    height: 11,
    borderRadius: 6,
  },
  menuCard: {
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  menuRow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  menuTitle: {
    width: '46%',
    height: 13,
    borderRadius: 7,
  },
  menuAction: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: 'auto',
  },
  heroCard: {
    height: 156,
    borderRadius: 22,
    padding: 20,
    marginBottom: 26,
  },
  heroEyebrow: {
    width: 88,
    height: 10,
    borderRadius: 5,
    marginBottom: 14,
  },
  heroTitle: {
    width: '72%',
    height: 25,
    borderRadius: 8,
    marginBottom: 12,
  },
  heroSubtitle: {
    width: '48%',
    height: 12,
    borderRadius: 6,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeadingSecondary: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    width: 124,
    height: 16,
    borderRadius: 8,
  },
  sectionTitleShort: {
    width: 96,
    height: 16,
    borderRadius: 8,
  },
  sectionAction: {
    width: 52,
    height: 12,
    borderRadius: 6,
  },
  rowCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 12,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    width: '68%',
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  rowSubtitle: {
    width: '45%',
    height: 9,
    borderRadius: 5,
  },
  rowValue: {
    width: 54,
    height: 12,
    borderRadius: 6,
  },
  detailCard: {
    borderRadius: 20,
    padding: 18,
  },
  detailLineLong: {
    width: '84%',
    height: 13,
    borderRadius: 7,
    marginBottom: 12,
  },
  detailLine: {
    width: '58%',
    height: 11,
    borderRadius: 6,
    marginBottom: 24,
  },
  detailButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
  },
});
