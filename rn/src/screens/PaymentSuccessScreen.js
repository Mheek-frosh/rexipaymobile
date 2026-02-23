import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

const { width } = Dimensions.get('window');

function generateRef() {
  return 'RXP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function PaymentSuccessScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    amount,
    recipient,
    type = 'transfer',
    ref: refParam,
    asset,
  } = route.params || {};

  const refNumber = refParam || generateRef();
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    try {
      lottieRef.current?.play?.();
    } catch (e) {
      setLottieError(true);
    }
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, []);

  const title =
    type === 'data'
      ? 'Data Purchase Successful!'
      : type === 'airtime'
        ? 'Airtime Purchase Successful!'
        : type === 'crypto'
          ? `${asset || 'Crypto'} Sent Successfully!`
          : 'Transaction Successful!';

  const formatAmount = () => {
    if (type === 'crypto') return `${amount} ${asset || ''}`;
    return `₦${amount ? Number(amount).toLocaleString() : '0'}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.lottieWrap}>
          {!lottieError ? (
            <LottieView
              ref={lottieRef}
              source={{ uri: 'https://lottie.host/a2297fec-ae6e-42bc-86bc-ee1d4e329f12/bkVDNz6hx4.lottie' }}
              style={styles.lottie}
              loop={false}
              autoPlay
            />
          ) : (
            <Animated.View
              style={[
                styles.fallbackCircle,
                { backgroundColor: colors.success, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <MaterialIcons name="check" size={64} color="#FFF" />
            </Animated.View>
          )}
        </View>

        <Animated.View style={[styles.textBlock, { opacity: contentOpacity }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.amount, { color: colors.primary }]}>{formatAmount()}</Text>
          <Text style={[styles.recipient, { color: colors.textSecondary }]}>
            {type === 'data'
              ? `${recipient || 'Data'} plan purchased`
              : type === 'airtime'
                ? `Airtime sent to ${recipient || 'recipient'}`
                : type === 'crypto'
                  ? `Sent to ${recipient || 'Address'}`
                  : `Sent to ${recipient || 'Recipient'}`}
          </Text>

          <View style={[styles.detailsCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Reference Number
              </Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{refNumber}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status</Text>
              <Text style={[styles.detailValue, { color: colors.success }]}>Completed</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date & Time</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {new Date().toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Transaction ID</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                TX{Date.now()}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.btnWrap, { opacity: contentOpacity }]}>
        <PrimaryButton
          text="Done"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
          }
          style={styles.btn}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between' },
  content: { alignItems: 'center', marginTop: 30 },
  lottieWrap: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 8,
  },
  lottie: { flex: 1, width: '100%', height: '100%' },
  fallbackCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { alignItems: 'center', width: '100%' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  amount: { fontSize: 28, fontWeight: '700', marginTop: 12 },
  recipient: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  detailsCard: {
    width: '100%',
    borderRadius: 16,
    marginTop: 24,
    padding: 16,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '600' },
  btnWrap: { marginBottom: 40 },
  btn: {},
});
