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
import { useAuth } from '../../context/AuthContext';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Ellipse,
  Rect,
  Path,
  G,
  Circle,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.62;

/* ────────────────────────────────────
   Inline SVG Credit Card graphic
   (based on cardcreate.svg design cues)
──────────────────────────────────── */
function RexipayCardSvg({ name = 'KABEER', expiry = '08/29', last4 = '4821' }) {
  const cw = CARD_WIDTH;
  const ch = CARD_HEIGHT;

  return (
    <Svg width={cw} height={ch} viewBox={`0 0 ${cw} ${ch}`}>
      <Defs>
        {/* Card body gradient */}
        <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2242E0" />
          <Stop offset="60%" stopColor="#172FC7" />
          <Stop offset="100%" stopColor="#0F1E8A" />
        </LinearGradient>
        {/* Shine arc */}
        <RadialGradient id="shineGrad" cx="75%" cy="45%" r="55%" fx="75%" fy="45%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        {/* Chip gradient */}
        <LinearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#D4C17A" />
          <Stop offset="50%" stopColor="#E8D98A" />
          <Stop offset="100%" stopColor="#B8A050" />
        </LinearGradient>
      </Defs>

      {/* Card background */}
      <Rect x={0} y={0} width={cw} height={ch} rx={20} ry={20} fill="url(#cardGrad)" />

      {/* Radial shine effect (top-right sweep) */}
      <Ellipse cx={cw * 0.82} cy={ch * 0.38} rx={cw * 0.55} ry={ch * 0.7} fill="url(#shineGrad)" />

      {/* Subtle arc line decoration */}
      <Path
        d={`M ${cw * 0.5} ${-ch * 0.2} Q ${cw * 1.1} ${ch * 0.3} ${cw * 0.85} ${ch * 1.1}`}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="40"
        fill="none"
      />
      <Path
        d={`M ${cw * 0.45} ${-ch * 0.15} Q ${cw * 1.05} ${ch * 0.35} ${cw * 0.8} ${ch * 1.05}`}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="28"
        fill="none"
      />

      {/* ── HEADER ROW ── */}
      {/* Rexipay logo mark (R in rounded square) */}
      <Rect x={20} y={20} width={34} height={34} rx={9} ry={9} fill="rgba(255,255,255,0.18)" />
      <Path
        d="M29 27 h8 a5 5 0 0 1 0 10 h-8 z M37 37 l6 9"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* VISA text */}
      <Path
        // Simplified VISA wordmark path (custom drawn approximation)
        d="M 0 0"
        fill="none"
      />
      {/* We use Text-as-SVG via foreignObject alternative — render via plain styled letters */}

      {/* ── CHIP ── */}
      <Rect x={20} y={ch * 0.42} width={46} height={34} rx={6} ry={6} fill="url(#chipGrad)" />
      {/* Chip lines */}
      <Rect x={31} y={ch * 0.42} width={2} height={34} fill="rgba(0,0,0,0.15)" />
      <Rect x={38} y={ch * 0.42} width={2} height={34} fill="rgba(0,0,0,0.12)" />
      <Rect x={20} y={ch * 0.42 + 11} width={46} height={2} fill="rgba(0,0,0,0.12)" />
      <Rect x={20} y={ch * 0.42 + 21} width={46} height={2} fill="rgba(0,0,0,0.10)" />
      {/* Centre oval on chip */}
      <Ellipse cx={43} cy={ch * 0.42 + 17} rx={8} ry={10} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />

      {/* NFC waves */}
      <Path d={`M ${76} ${ch * 0.42 + 6} Q ${84} ${ch * 0.42 + 17} ${76} ${ch * 0.42 + 28}`} stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d={`M ${82} ${ch * 0.42 + 2} Q ${93} ${ch * 0.42 + 17} ${82} ${ch * 0.42 + 32}`} stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d={`M ${88} ${ch * 0.42 - 2} Q ${103} ${ch * 0.42 + 17} ${88} ${ch * 0.42 + 36}`} stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/* ────────────────────────────────────
   Card number row with bullets + last4
──────────────────────────────────── */
function CardNumberRow({ last4 }) {
  return (
    <View style={styles.cardNumberRow}>
      {[0, 1, 2].map((g) => (
        <View key={g} style={styles.cardNumberGroup}>
          {[0, 1, 2, 3].map((d) => (
            <View key={d} style={styles.cardNumberDot} />
          ))}
        </View>
      ))}
      <Text style={styles.cardNumberLast4}>{last4}</Text>
    </View>
  );
}

/* ────────────────────────────────────
   The full-card visual composite
──────────────────────────────────── */
function CardVisual({ name, expiry, last4 }) {
  return (
    <View style={[styles.cardVisualOuter, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      {/* SVG background */}
      <RexipayCardSvg name={name} expiry={expiry} last4={last4} />

      {/* Overlaid text content (positioned absolutely over the SVG) */}
      <View style={styles.cardOverlay}>
        {/* Header: logo + VISA */}
        <View style={styles.cardHeader}>
          <View style={styles.cardLogoGroup}>
            <View style={styles.cardLogoBox}>
              <Text style={styles.cardLogoR}>R</Text>
            </View>
            <Text style={styles.cardLogoName}>Rexipay</Text>
          </View>
          <Text style={styles.cardVisaText}>VISA</Text>
        </View>

        {/* Spacer — SVG draws chip here */}
        <View style={{ height: CARD_HEIGHT * 0.22 }} />

        {/* Card Number */}
        <CardNumberRow last4={last4} />

        {/* Footer: holder + expiry */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardFieldLabel}>CARD HOLDER</Text>
            <Text style={styles.cardFieldValue}>{name}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardFieldLabel}>EXPIRES</Text>
            <Text style={styles.cardFieldValue}>{expiry}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ────────────────────────────────────
   Option rows (Virtual / Physical)
──────────────────────────────────── */
function CardOptionRow({ icon, title, subtitle, badge, onPress, colors }) {
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
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{badge}</Text>
        </View>
      ) : (
        <View style={[styles.arrowBtn, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ────────────────────────────────────
   Physical card faded placeholder
──────────────────────────────────── */
function PhysicalCardPlaceholder({ colors }) {
  return (
    <View style={[styles.physicalPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
      <View style={[styles.physicalLogoBox, { backgroundColor: colors.border }]}>
        <Text style={[styles.physicalLogoR, { color: colors.textSecondary }]}>R</Text>
      </View>
    </View>
  );
}

/* ────────────────────────────────────
   Main Screen
──────────────────────────────────── */
export default function ChooseCardScreen() {
  const { colors, isDark } = useTheme();
  const { userName } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const displayName = (userName || 'KABEER').toUpperCase().split(' ')[0];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

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
          <CardVisual name={displayName} expiry="08/29" last4="4821" />
        </View>

        {/* Virtual Card Option */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CARD OPTIONS</Text>

        <CardOptionRow
          icon="credit-card"
          title="Virtual card"
          subtitle="Ready instantly"
          colors={colors}
          onPress={() => navigation.navigate('AddCard')}
        />

        {/* Physical Card Option */}
        <TouchableOpacity
          style={[styles.optionRowPhysical, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          activeOpacity={0.65}
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

        {/* Info note */}
        <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderColor: `${colors.primary}30` }]}>
          <MaterialIcons name="info-outline" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Virtual cards are created instantly and can be used for online purchases and subscriptions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ────────────────────────────────────
   Styles
──────────────────────────────────── */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 28,
  },

  /* Card Visual */
  cardSection: {
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#172FC7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  cardVisualOuter: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLogoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLogoBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLogoR: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cardLogoName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardVisaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    fontStyle: 'italic',
  },

  /* Card Number */
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  cardNumberGroup: {
    flexDirection: 'row',
    gap: 5,
  },
  cardNumberDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cardNumberLast4: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },

  /* Card Footer */
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardFieldLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  cardFieldValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 4,
  },

  /* Option rows */
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  optionRowPhysical: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
    opacity: 0.75,
  },
  optionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  arrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Physical card placeholder thumbnail */
  physicalPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  physicalLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  physicalLogoR: {
    fontSize: 18,
    fontWeight: '800',
  },

  /* Info box */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
