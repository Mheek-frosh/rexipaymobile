import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';

const WATERMARKS = [
  { top: 18, left: -4, size: 76, rotate: '-8deg' },
  { top: 48, right: 22, size: 66, rotate: '7deg' },
  { top: 148, left: 106, size: 54, rotate: '-5deg' },
  { top: 260, right: -8, size: 78, rotate: '4deg' },
  { top: 370, left: 20, size: 64, rotate: '-7deg' },
  { top: 510, right: 86, size: 58, rotate: '8deg' },
  { top: 650, left: -12, size: 82, rotate: '5deg' },
  { top: 790, right: 8, size: 68, rotate: '-6deg' },
  { top: 930, left: 96, size: 60, rotate: '7deg' },
  { top: 1080, right: 72, size: 76, rotate: '-4deg' },
  { top: 1240, left: 6, size: 66, rotate: '6deg' },
];

function generateRef() {
  return `RXP${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function RexiLogoMark({ style }) {
  return (
    <Svg viewBox="0 0 442 460" style={style}>
      <Defs>
        <LinearGradient id="watermarkStripe" x1="71" y1="188" x2="205" y2="188">
          <Stop stopColor="#AFCBF8" />
          <Stop offset="1" stopColor="#9ABAF1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M324 0H118C52.8304 0 0 52.8304 0 118V342C0 407.17 52.8304 460 118 460H324C389.17 460 442 407.17 442 342V118C442 52.8304 389.17 0 324 0Z"
        fill="#172FC7"
      />
      <Path
        d="M158 94H274C330 94 366 131 366 186C366 233 341 266 299 279L362 361C370 372 365 374 356 374H312C302 374 296 370 290 362L216 267C207 256 208 244 216 235C223 227 231 225 242 225H269C292 225 305 211 305 188C305 166 290 153 269 153H144C133 153 128 147 131 138L144 105C147 98 151 94 158 94Z"
        fill="#FFFFFF"
      />
      <Path
        d="M106 252H182C192 252 198 260 195 269L193 275C191 281 186 283 178 283H103C92 283 87 274 90 266L92 260C94 255 98 252 106 252Z"
        fill="#FFFFFF"
      />
      <Path
        d="M87 188H192C203 188 208 197 204 207L202 212C200 217 195 219 187 219H85C74 219 69 211 72 203L75 195C77 190 80 188 87 188Z"
        fill="url(#watermarkStripe)"
      />
    </Svg>
  );
}

function WatermarkPattern({ isDark }) {
  return (
    <View pointerEvents="none" style={styles.watermarkLayer}>
      {WATERMARKS.map((item, index) => (
        <RexiLogoMark
          key={index}
          style={[
            styles.watermark,
            {
              top: item.top,
              left: item.left,
              right: item.right,
              width: item.size,
              height: item.size,
              opacity: isDark ? 0.075 : 0.05,
              transform: [{ rotate: item.rotate }],
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function PaymentSuccessScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { amount, recipient, type = 'transfer', ref: refParam, asset } = route.params || {};

  const transactionMeta = useRef({
    reference: refParam || generateRef(),
    transactionId: `TX${Date.now()}`,
    completedAt: new Date(),
  }).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const lottieRef = useRef(null);
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 7,
      }),
    ]).start();
  }, [contentOpacity, scaleAnim]);

  const isAddMoney = recipient === 'Add Money';
  const title =
    type === 'data'
      ? 'Data Purchase Successful!'
      : type === 'airtime'
        ? 'Airtime Purchase Successful!'
        : type === 'crypto'
          ? `${asset || 'Crypto'} Sent Successfully!`
          : isAddMoney
            ? 'Money Added Successfully!'
            : 'Transaction Successful!';

  const formattedAmount =
    type === 'crypto'
      ? `${amount || '0'} ${asset || ''}`.trim()
      : `₦${amount ? Number(amount).toLocaleString() : '0'}`;

  const description =
    type === 'data'
      ? `${recipient || 'Data'} plan purchased`
      : type === 'airtime'
        ? `Airtime sent to ${recipient || 'recipient'}`
        : type === 'crypto'
          ? `Sent to ${recipient || 'address'}`
          : isAddMoney
            ? 'Your wallet has been funded successfully'
            : `Sent to ${recipient || 'recipient'}`;

  const completedAt = formatDateTime(transactionMeta.completedAt);

  const handleDone = () => {
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title,
        message: [
          title,
          formattedAmount,
          description,
          `Reference: ${transactionMeta.reference}`,
          'Status: Completed',
          `Date & Time: ${completedAt}`,
          `Transaction ID: ${transactionMeta.transactionId}`,
        ].join('\n'),
      });
    } catch (error) {
      console.warn('Unable to share transaction receipt:', error);
    }
  };

  const detailRows = [
    { label: 'Reference Number', value: transactionMeta.reference },
    { label: 'Status', value: 'Completed', success: true },
    { label: 'Date & Time', value: completedAt },
    { label: 'Transaction ID', value: transactionMeta.transactionId },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WatermarkPattern isDark={isDark} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 18) + 14,
            paddingBottom: Math.max(insets.bottom, 24) + 116,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.successMarkWrap,
            {
              opacity: contentOpacity,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {!lottieError ? (
            <LottieView
              ref={lottieRef}
              source={require('../../../assets/success-done.json')}
              style={styles.lottie}
              loop={false}
              autoPlay
              onAnimationFailure={() => setLottieError(true)}
            />
          ) : (
            <View style={[styles.fallbackCircle, { backgroundColor: colors.success }]}>
              <MaterialIcons name="check" size={56} color="#FFFFFF" />
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.resultContent, { opacity: contentOpacity }]}>
          <Text style={[styles.title, { color: isDark ? colors.textPrimary : colors.primary }]}>
            {title}
          </Text>
          <Text style={[styles.amount, { color: colors.primary }]}>{formattedAmount}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>

          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: isDark ? colors.border : 'rgba(23, 47, 199, 0.05)',
              },
            ]}
          >
            {detailRows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.detailRow,
                  index < detailRows.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  {row.label}
                </Text>
                <Text
                  numberOfLines={2}
                  selectable
                  style={[
                    styles.detailValue,
                    { color: row.success ? colors.success : colors.textPrimary },
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={[
          styles.actions,
          {
            opacity: contentOpacity,
            paddingBottom: Math.max(insets.bottom, 18),
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={handleDone}
          activeOpacity={0.86}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton, { borderColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.86}
        >
          <MaterialIcons name="ios-share" size={25} color={colors.primary} />
          <Text style={[styles.shareText, { color: colors.primary }]}>Share</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  watermarkLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successMarkWrap: {
    width: 154,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  lottie: {
    width: 240,
    height: 240,
  },
  fallbackCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginTop: 22,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '800',
    textAlign: 'center',
  },
  amount: {
    marginTop: 18,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    marginTop: 36,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  detailRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
  },
  detailLabel: {
    flexShrink: 0,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    textAlign: 'right',
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 14,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    shadowColor: '#172FC7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    gap: 9,
    borderWidth: 2,
  },
  shareText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
