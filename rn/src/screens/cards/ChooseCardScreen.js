import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Ellipse,
  Rect,
  Path,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// Card sized to fit nicely on any phone — 80% of screen width
const CARD_WIDTH = width * 0.80;
const CARD_HEIGHT = CARD_WIDTH * 0.60;

/* ─────────────────────────────────────────────
   Rexipay Logo embedded from logonew.svg paths
   Rendered at a given size centred in card top
───────────────────────────────────────────── */
function RexipayLogoMark({ size = 44 }) {
  // Original SVG viewBox: 0 0 724 738
  return (
    <Svg width={size} height={size} viewBox="0 0 724 738" fill="none">
      <Defs>
        <LinearGradient id="logoGrad" x1="173.543" y1="340.656" x2="342.752" y2="340.656" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D8E6FF" />
          <Stop offset="1" stopColor="#8BB3FB" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="362" cy="368.779" rx="362" ry="368.779" fill="rgba(255,255,255,0.18)" />
      <Path
        d="M321.601 340.656H194.694C183.013 340.656 173.543 349.959 173.543 361.434C173.543 372.909 183.013 382.211 194.694 382.211H321.601C333.282 382.211 342.752 372.909 342.752 361.434C342.752 349.959 333.282 340.656 321.601 340.656Z"
        fill="url(#logoGrad)"
      />
      <Path
        d="M311.989 419.992H216.617C205.572 419.992 196.619 428.787 196.619 439.636C196.619 450.486 205.572 459.281 216.617 459.281H311.989C323.033 459.281 331.986 450.486 331.986 439.636C331.986 428.787 323.033 419.992 311.989 419.992Z"
        fill="white"
      />
      <Path
        d="M284.04 225.062C272.492 225.062 263.253 231.107 258.634 242.44L248.625 271.151C244.005 285.506 253.244 297.595 268.642 297.595H425.701C449.568 297.595 468.045 316.484 468.045 340.661C468.045 364.083 450.337 385.239 425.701 385.239H384.126C364.879 385.239 352.561 404.883 363.339 420.749L452.647 553.726C458.806 562.792 468.045 568.081 479.594 568.081H518.088C535.026 568.081 545.035 549.193 535.026 536.348L474.204 454.749C518.088 435.105 545.035 392.794 545.035 340.661C545.035 275.684 494.222 225.062 426.471 225.062H284.04Z"
        fill="white"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   SVG card background (gradient + shine + arcs)
───────────────────────────────────────────── */
function CardBackground() {
  const cw = CARD_WIDTH;
  const ch = CARD_HEIGHT;
  return (
    <Svg width={cw} height={ch} viewBox={`0 0 ${cw} ${ch}`}>
      <Defs>
        <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2242E0" />
          <Stop offset="55%" stopColor="#172FC7" />
          <Stop offset="100%" stopColor="#0F1E8A" />
        </LinearGradient>
        <RadialGradient id="shineGrad" cx="76%" cy="38%" r="52%" fx="76%" fy="38%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.20" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        {/* Chip gradient */}
        <LinearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#D4C17A" />
          <Stop offset="50%" stopColor="#E8D98A" />
          <Stop offset="100%" stopColor="#B8A050" />
        </LinearGradient>
      </Defs>

      {/* Card body */}
      <Rect x={0} y={0} width={cw} height={ch} rx={18} ry={18} fill="url(#cardGrad)" />

      {/* Shine sweep */}
      <Ellipse cx={cw * 0.82} cy={ch * 0.35} rx={cw * 0.52} ry={ch * 0.72} fill="url(#shineGrad)" />

      {/* Arc decorations */}
      <Path
        d={`M ${cw * 0.48} ${-ch * 0.22} Q ${cw * 1.12} ${ch * 0.28} ${cw * 0.84} ${ch * 1.12}`}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="38"
        fill="none"
      />
      <Path
        d={`M ${cw * 0.42} ${-ch * 0.14} Q ${cw * 1.06} ${ch * 0.34} ${cw * 0.78} ${ch * 1.06}`}
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="26"
        fill="none"
      />

      {/* EMV Chip */}
      <Rect x={20} y={ch * 0.44} width={42} height={30} rx={5} ry={5} fill="url(#chipGrad)" />
      <Rect x={30} y={ch * 0.44} width={1.8} height={30} fill="rgba(0,0,0,0.14)" />
      <Rect x={36} y={ch * 0.44} width={1.8} height={30} fill="rgba(0,0,0,0.11)" />
      <Rect x={20} y={ch * 0.44 + 9} width={42} height={1.8} fill="rgba(0,0,0,0.11)" />
      <Rect x={20} y={ch * 0.44 + 19} width={42} height={1.8} fill="rgba(0,0,0,0.09)" />
      <Ellipse cx={41} cy={ch * 0.44 + 15} rx={7} ry={9} fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="1.4" />

      {/* NFC waves */}
      <Path d={`M 69 ${ch * 0.44 + 4} Q 77 ${ch * 0.44 + 15} 69 ${ch * 0.44 + 26}`} stroke="rgba(255,255,255,0.65)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d={`M 75 ${ch * 0.44 + 0} Q 86 ${ch * 0.44 + 15} 75 ${ch * 0.44 + 30}`} stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d={`M 81 ${ch * 0.44 - 4} Q 96 ${ch * 0.44 + 15} 81 ${ch * 0.44 + 34}`} stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   Full Card Visual (logo only, no text data)
───────────────────────────────────────────── */
function CardVisual() {
  return (
    <View style={[styles.cardOuter, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      {/* SVG background layer */}
      <CardBackground />

      {/* Overlay: logo top-left + VISA top-right only */}
      <View style={styles.cardOverlay}>
        {/* Rexipay logo mark + wordmark */}
        <View style={styles.cardHeader}>
          <View style={styles.cardLogoGroup}>
            <RexipayLogoMark size={38} />
            <Text style={styles.cardLogoText}>Rexipay</Text>
          </View>
          <Text style={styles.cardVisaText}>VISA</Text>
        </View>

        {/* Spacer pushes chip to middle — chip is drawn in SVG */}
        <View style={{ flex: 1 }} />

        {/* Bottom spacer so card has breathing room */}
        <View style={{ height: 16 }} />
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────────
   Option Row component
───────────────────────────────────────────── */
function CardOptionRow({ icon, title, subtitle, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.optionRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <View style={[styles.optionIconBox, { backgroundColor: colors.primaryLight }]}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <View style={[styles.arrowBtn, { backgroundColor: colors.primary }]}>
        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────
   Physical card placeholder thumbnail
───────────────────────────────────────────── */
function PhysicalCardPlaceholder({ colors }) {
  return (
    <View style={[styles.physicalPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
      <RexipayLogoMark size={30} />
    </View>
  );
}

/* ─────────────────────────────────────────────
   Main Screen — used as the Cards tab directly
───────────────────────────────────────────── */
export default function ChooseCardScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Choose your card</Text>
        <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
          Select the card that works for you
        </Text>

        {/* Card Visual */}
        <View style={styles.cardSection}>
          <CardVisual />
        </View>

        {/* Section label */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CARD OPTIONS</Text>

        {/* Virtual Card */}
        <CardOptionRow
          icon="credit-card"
          title="Virtual card"
          subtitle="Ready instantly"
          colors={colors}
          onPress={() => navigation.navigate('AddCard')}
        />

        {/* Physical Card — disabled */}
        <TouchableOpacity
          style={[styles.optionRowPhysical, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          activeOpacity={0.6}
          disabled
        >
          <PhysicalCardPlaceholder colors={colors} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Physical card</Text>
            <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>Not available yet</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>COMING SOON</Text>
          </View>
        </TouchableOpacity>

        {/* Info strip */}
        <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderColor: `${colors.primary}28` }]}>
          <MaterialIcons name="info-outline" size={15} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Virtual cards are created instantly and can be used for online purchases and subscriptions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 24,
  },

  /* ── Card ── */
  cardSection: {
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#172FC7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
  cardOuter: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLogoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  cardLogoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cardVisaText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },

  /* ── Section label ── */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  /* ── Option rows ── */
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    gap: 13,
  },
  optionRowPhysical: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    gap: 13,
    opacity: 0.72,
  },
  optionIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* ── Physical placeholder ── */
  physicalPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* ── Info box ── */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    borderRadius: 13,
    borderWidth: 1,
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
