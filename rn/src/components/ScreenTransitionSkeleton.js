import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
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

  const baseColor = colors.surfaceVariant;
  const highlightColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.72)';
  const cardColor = colors.cardBackground;
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
          paddingTop: insets.top + 12,
          bottom:
            Math.max(insets.bottom, 10) +
            COMPACT_TAB_BAR_HEIGHT +
            SKELETON_TAB_GAP,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading screen"
    >
      {routeName === 'Home' ? (
        <HomeSkeleton {...contentProps} />
      ) : routeName === 'Cards' ? (
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

function HomeSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <View style={styles.homeHeader}>
        <View style={styles.homeHeaderCopy}>
          <Block {...blockProps} style={styles.homeGreeting} />
          <Block {...blockProps} style={styles.homeName} />
        </View>
        <Block {...blockProps} style={styles.homeAvatar} />
        <Block {...blockProps} style={styles.homeAvatar} />
      </View>
      <View style={[styles.homeBalance, { backgroundColor: '#171717' }]}>
        <View style={styles.homeBalanceTop}>
          <Block {...blockProps} style={styles.homeChip} />
          <Block {...blockProps} style={styles.homeSwitch} />
        </View>
        <Block {...blockProps} style={styles.homeBalanceLabel} />
        <Block {...blockProps} style={styles.homeBalanceAmount} />
        <View style={styles.homePills}>
          <Block {...blockProps} style={styles.homePill} />
          <Block {...blockProps} style={styles.homePill} />
        </View>
      </View>
      <Block {...blockProps} style={styles.homePromo} />
      <View style={styles.homeActions}>
        {[0, 1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.homeAction}>
            <Block {...blockProps} style={styles.homeActionBubble} />
            <Block {...blockProps} style={styles.homeActionLabel} />
          </View>
        ))}
      </View>
      <View style={[styles.homeTxCard, { backgroundColor: cardColor, borderColor: blockProps.baseColor }]}>
        <View style={styles.homeTxHead}>
          <Block {...blockProps} style={styles.homeTxTitle} />
          <Block {...blockProps} style={styles.homeTxSee} />
        </View>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.homeTxRow}>
            <Block {...blockProps} style={styles.homeTxIcon} />
            <View style={styles.homeTxCopy}>
              <Block {...blockProps} style={styles.homeTxName} />
              <Block {...blockProps} style={styles.homeTxMeta} />
            </View>
            <Block {...blockProps} style={styles.homeTxAmount} />
          </View>
        ))}
      </View>
      <Block {...blockProps} style={styles.homeSection} />
      <View style={[styles.homeEarn, { backgroundColor: cardColor, borderColor: blockProps.baseColor }]}>
        {[0, 1].map((item) => (
          <View key={item} style={styles.homeEarnRow}>
            <Block {...blockProps} style={styles.homeEarnIcon} />
            <View style={styles.homeTxCopy}>
              <Block {...blockProps} style={styles.homeTxName} />
              <Block {...blockProps} style={styles.homeTxMeta} />
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

function CardsSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <Block {...blockProps} style={styles.chooseTitle} />
      <Block {...blockProps} style={styles.chooseSubtitle} />
      <View style={[styles.chooseCard, { backgroundColor: '#1A1A1A' }]}>
        <View style={styles.chooseCardTop}>
          <Block {...blockProps} style={styles.chooseLogo} />
          <Block {...blockProps} style={styles.chooseVisa} />
        </View>
        <Block {...blockProps} style={styles.chooseChip} />
      </View>
      <Block {...blockProps} style={styles.chooseSection} />
      {[0, 1].map((item) => (
        <View
          key={item}
          style={[styles.optionRowSkeleton, { backgroundColor: cardColor, borderColor: blockProps.baseColor }]}
        >
          <Block {...blockProps} style={styles.optionIconInner} />
          <View style={styles.optionTextSkeleton}>
            <Block {...blockProps} style={styles.optionTitleSkeleton} />
            <Block {...blockProps} style={styles.optionSubtitleSkeleton} />
          </View>
          <Block {...blockProps} style={styles.chooseArrow} />
        </View>
      ))}
      <View style={[styles.infoSkeleton, { backgroundColor: blockProps.baseColor }]}>
        <Block {...blockProps} style={styles.infoIconSkeleton} />
        <View style={styles.infoTextSkeleton}>
          <Block {...blockProps} style={styles.infoLineLong} />
          <Block {...blockProps} style={styles.infoLineShort} />
        </View>
      </View>
    </>
  );
}

function StatsSkeleton({ blockProps, cardColor }) {
  return (
    <>
      <View style={styles.historyTop}>
        <View>
          <Block {...blockProps} style={styles.balanceLabel} />
          <Block {...blockProps} style={styles.historyBalance} />
        </View>
        <Block {...blockProps} style={styles.historyDate} />
      </View>
      <View style={styles.ringWrap}>
        <View style={[styles.ring, { borderColor: blockProps.baseColor }]} />
        <View style={styles.ringCenter}>
          <Block {...blockProps} style={styles.ringLabel} />
          <Block {...blockProps} style={styles.ringAmount} />
        </View>
      </View>
      <View style={[styles.historyRanges, { backgroundColor: cardColor }]}>
        {[0, 1, 2, 3].map((item) => (
          <Block key={item} {...blockProps} style={styles.historyRange} />
        ))}
      </View>
      <View style={[styles.historySheet, { backgroundColor: cardColor, borderColor: blockProps.baseColor }]}>
        <View style={[styles.historyHandle, { backgroundColor: blockProps.baseColor }]} />
        <View style={styles.homeTxHead}>
          <Block {...blockProps} style={styles.homeTxTitle} />
          <Block {...blockProps} style={styles.homeTxSee} />
        </View>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.homeTxRow}>
            <Block {...blockProps} style={styles.homeTxIcon} />
            <View style={styles.homeTxCopy}>
              <Block {...blockProps} style={styles.homeTxName} />
              <Block {...blockProps} style={styles.homeTxMeta} />
            </View>
            <Block {...blockProps} style={styles.homeTxAmount} />
          </View>
        ))}
      </View>
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
  cardSkeleton: {
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 28,
    padding: 24,
    marginBottom: 28,
  },
  cardSkeletonTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardSkeletonLogo: {
    width: 120,
    height: 18,
    borderRadius: 9,
  },
  cardSkeletonBadge: {
    width: 72,
    height: 18,
    borderRadius: 9,
  },
  cardSkeletonChip: {
    width: 58,
    height: 40,
    borderRadius: 12,
    marginBottom: 28,
  },
  cardSkeletonNumber: {
    width: '88%',
    height: 20,
    borderRadius: 10,
    marginBottom: 18,
  },
  cardSkeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardSkeletonName: {
    width: '48%',
    height: 14,
    borderRadius: 7,
  },
  cardSkeletonExpiry: {
    width: '28%',
    height: 14,
    borderRadius: 7,
  },
  optionRowSkeleton: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIconSkeleton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconInner: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  optionTextSkeleton: {
    flex: 1,
  },
  optionTitleSkeleton: {
    width: '72%',
    height: 14,
    borderRadius: 7,
    marginBottom: 10,
  },
  optionSubtitleSkeleton: {
    width: '50%',
    height: 12,
    borderRadius: 6,
  },
  optionArrowSkeleton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 16,
  },
  infoSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginTop: 24,
  },
  infoIconSkeleton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 14,
  },
  infoTextSkeleton: {
    flex: 1,
  },
  infoLineLong: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  infoLineShort: {
    width: '70%',
    height: 12,
    borderRadius: 6,
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
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  homeHeaderCopy: { flex: 1 },
  homeGreeting: { width: 92, height: 12, borderRadius: 6, marginBottom: 8 },
  homeName: { width: 148, height: 26, borderRadius: 8 },
  homeAvatar: { width: 36, height: 36, borderRadius: 18 },
  homeBalance: { borderRadius: 22, padding: 14, marginBottom: 12 },
  homeBalanceTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  homeChip: { width: 132, height: 32, borderRadius: 16 },
  homeSwitch: { width: 86, height: 32, borderRadius: 16 },
  homeBalanceLabel: { width: 110, height: 12, borderRadius: 6, marginBottom: 10 },
  homeBalanceAmount: { width: 180, height: 28, borderRadius: 8, marginBottom: 16 },
  homePills: { flexDirection: 'row', gap: 10 },
  homePill: { flex: 1, height: 40, borderRadius: 20 },
  homePromo: { height: 58, borderRadius: 29, marginBottom: 16 },
  homeActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  homeAction: { width: '18%', alignItems: 'center' },
  homeActionBubble: { width: 46, height: 46, borderRadius: 23, marginBottom: 8 },
  homeActionLabel: { width: 36, height: 8, borderRadius: 4 },
  homeTxCard: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 6, marginBottom: 8 },
  homeTxHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  homeTxTitle: { width: 150, height: 16, borderRadius: 8 },
  homeTxSee: { width: 52, height: 12, borderRadius: 6 },
  homeTxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  homeTxIcon: { width: 36, height: 36, borderRadius: 18 },
  homeTxCopy: { flex: 1, marginLeft: 12 },
  homeTxName: { width: '70%', height: 12, borderRadius: 6, marginBottom: 6 },
  homeTxMeta: { width: '46%', height: 9, borderRadius: 5 },
  homeTxAmount: { width: 64, height: 12, borderRadius: 6 },
  homeSection: { width: 140, height: 18, borderRadius: 8, marginTop: 16, marginBottom: 12 },
  homeEarn: { borderRadius: 22, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  homeEarnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  homeEarnIcon: { width: 48, height: 48, borderRadius: 14 },
  chooseTitle: { width: 210, height: 26, borderRadius: 8, marginBottom: 8 },
  chooseSubtitle: { width: 220, height: 13, borderRadius: 7, marginBottom: 22 },
  chooseCard: { alignSelf: 'center', width: '80%', aspectRatio: 1 / 0.6, borderRadius: 18, padding: 16, marginBottom: 24 },
  chooseCardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  chooseLogo: { width: 110, height: 28, borderRadius: 8 },
  chooseVisa: { width: 48, height: 16, borderRadius: 6 },
  chooseChip: { width: 42, height: 30, borderRadius: 6, marginTop: 36 },
  chooseSection: { width: 110, height: 11, borderRadius: 6, marginBottom: 12 },
  chooseArrow: { width: 36, height: 36, borderRadius: 18 },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyBalance: { width: 120, height: 18, borderRadius: 8, marginTop: 8 },
  historyDate: { width: 108, height: 34, borderRadius: 17 },
  ringWrap: { width: 230, height: 230, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  ring: { width: 210, height: 210, borderRadius: 105, borderWidth: 26 },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringLabel: { width: 108, height: 12, borderRadius: 6, marginBottom: 8 },
  ringAmount: { width: 132, height: 26, borderRadius: 8 },
  historyRanges: { flexDirection: 'row', borderRadius: 14, padding: 4, gap: 6, marginBottom: 16 },
  historyRange: { flex: 1, height: 34, borderRadius: 10 },
  historySheet: { borderRadius: 28, borderWidth: 1, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  historyHandle: { width: 42, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
});
