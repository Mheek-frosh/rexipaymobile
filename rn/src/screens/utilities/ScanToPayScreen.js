import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import AppBackButton from '../../components/AppBackButton';
import TransactionPinBottomSheet from '../../components/TransactionPinBottomSheet';
import TransactionProcessingModal from '../../components/TransactionProcessingModal';
import { useTheme } from '../../theme/ThemeContext';
import { formatNairaBalance, useWallet } from '../../context/WalletContext';

const BARCODE_TYPES = [
  'qr',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'datamatrix',
];

const getQueryValue = (value, key) => {
  const match = String(value || '').match(new RegExp(`[?&]${key}=([^&]+)`, 'i'));
  if (!match) return '';
  try {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  } catch (_) {
    return match[1];
  }
};

const parsePaymentCode = (data, barcodeType) => {
  const rawValue = String(data || '').trim();
  let payload = null;

  try {
    payload = JSON.parse(rawValue);
  } catch (_) {
    payload = null;
  }

  const merchantName = payload?.merchantName
    || payload?.receiverName
    || payload?.recipient
    || payload?.name
    || getQueryValue(rawValue, 'merchant')
    || getQueryValue(rawValue, 'name')
    || 'Scanned merchant';
  const reference = payload?.merchantId
    || payload?.userId
    || payload?.accountNumber
    || payload?.reference
    || getQueryValue(rawValue, 'recipient')
    || getQueryValue(rawValue, 'reference')
    || rawValue;
  const encodedAmount = payload?.amount || getQueryValue(rawValue, 'amount');

  return {
    merchantName: String(merchantName),
    reference: String(reference),
    amount: String(encodedAmount || '').replace(/[^0-9.]/g, ''),
    barcodeType: String(barcodeType || 'code').replace(/_/g, ' ').toUpperCase(),
    rawValue,
  };
};

const compactReference = (reference) => {
  const value = String(reference || '');
  if (value.length <= 30) return value;
  return `${value.slice(0, 16)}…${value.slice(-10)}`;
};

export default function ScanToPayScreen() {
  const { colors } = useTheme();
  const { debitNgn, ngnBalance } = useWallet();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [paymentCode, setPaymentCode] = useState(null);
  const [amount, setAmount] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [processing, setProcessing] = useState(false);
  const scanLockedRef = React.useRef(false);

  const handleBarcodeScanned = ({ data, type }) => {
    if (scanLockedRef.current || !data) return;
    scanLockedRef.current = true;
    const parsedCode = parsePaymentCode(data, type);
    setPaymentCode(parsedCode);
    setAmount(parsedCode.amount);
    setTorchEnabled(false);
  };

  const scanAgain = () => {
    scanLockedRef.current = false;
    setPaymentCode(null);
    setAmount('');
    setTorchEnabled(false);
  };

  const continuePayment = () => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid payment amount.');
      return;
    }
    setShowPin(true);
  };

  const completePayment = async () => {
    setShowPin(false);
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const debitResult = await debitNgn(amount);
    setProcessing(false);

    if (!debitResult.success) {
      Alert.alert('Payment failed', debitResult.error);
      return;
    }

    navigation.navigate('PaymentSuccess', {
      amount,
      recipient: paymentCode?.merchantName || 'Scanned merchant',
      type: 'transfer',
      ref: `SCAN${Date.now()}`,
    });
  };

  const renderPermissionState = () => {
    if (!permission) {
      return (
        <View style={styles.permissionCard}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      );
    }

    if (!permission.granted) {
      const cannotAskAgain = permission.canAskAgain === false;
      return (
        <View style={[styles.permissionCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.permissionIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name="photo-camera" size={30} color={colors.primary} />
          </View>
          <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>Camera access needed</Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>Allow camera access to scan payment codes.</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={cannotAskAgain ? Linking.openSettings : requestPermission}
          >
            <Text style={styles.permissionButtonText}>
              {cannotAskAgain ? 'Open Settings' : 'Allow Camera'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!isFocused) return null;

    return (
      <View style={styles.cameraCard}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchEnabled}
          barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <View pointerEvents="none" style={styles.cameraShade} />
        <View pointerEvents="none" style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityLabel={torchEnabled ? 'Turn flash off' : 'Turn flash on'}
          accessibilityRole="button"
          style={[styles.torchButton, torchEnabled && { backgroundColor: colors.primary }]}
          onPress={() => setTorchEnabled((current) => !current)}
        >
          <MaterialIcons
            name={torchEnabled ? 'flash-on' : 'flash-off'}
            size={23}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Scan to Pay</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!paymentCode ? (
          <>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Scan payment code</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Align a merchant QR or barcode inside the frame.</Text>
            {renderPermissionState()}
          </>
        ) : (
          <View style={styles.paymentContent}>
            <View style={[styles.successIcon, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name="check" size={30} color={colors.primary} />
            </View>
            <Text style={[styles.detectedLabel, { color: colors.textSecondary }]}>Payment code detected</Text>
            <Text style={[styles.merchantName, { color: colors.textPrimary }]} numberOfLines={2}>
              {paymentCode.merchantName}
            </Text>

            <View
              style={[
                styles.codeCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.codeRow}>
                <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>Code</Text>
                <Text style={[styles.codeType, { color: colors.primary }]}>{paymentCode.barcodeType}</Text>
              </View>
              <Text style={[styles.codeValue, { color: colors.textPrimary }]} numberOfLines={1}>
                {compactReference(paymentCode.reference)}
              </Text>
            </View>

            <Text style={[styles.amountLabel, { color: colors.textPrimary }]}>Amount</Text>
            <View
              style={[
                styles.amountInputWrap,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.currency, { color: colors.textPrimary }]}>₦</Text>
              <TextInput
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                style={[styles.amountInput, { color: colors.textPrimary }]}
              />
            </View>
            <Text style={[styles.balanceText, { color: colors.textSecondary }]}>Available: {formatNairaBalance(ngnBalance)}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.payButton, { backgroundColor: colors.primary }]}
              onPress={continuePayment}
            >
              <Text style={styles.payButtonText}>
                Pay {amount ? formatNairaBalance(amount) : 'now'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.scanAgainButton} onPress={scanAgain}>
              <MaterialIcons name="qr-code-scanner" size={18} color={colors.primary} />
              <Text style={[styles.scanAgainText, { color: colors.primary }]}>Scan again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TransactionPinBottomSheet
        visible={showPin}
        title={`Confirm ${amount ? formatNairaBalance(amount) : 'payment'}`}
        amount={amount ? formatNairaBalance(amount) : '₦0'}
        recipient={paymentCode?.merchantName || 'Scanned merchant'}
        onSuccess={completePayment}
        onCancel={() => setShowPin(false)}
      />
      <TransactionProcessingModal
        visible={processing}
        label="Processing payment..."
        subtext="Please wait while we complete your scanned payment securely."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSpacer: { width: 40 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 36 },
  title: { fontSize: 24, lineHeight: 31, fontWeight: '700', marginTop: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 20 },
  cameraCard: {
    height: 410,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#05070D',
    position: 'relative',
  },
  cameraShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  scanFrame: {
    width: 236,
    height: 190,
    position: 'absolute',
    alignSelf: 'center',
    top: 90,
  },
  corner: {
    width: 42,
    height: 42,
    position: 'absolute',
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: { left: 0, top: 0, borderLeftWidth: 4, borderTopWidth: 4, borderTopLeftRadius: 16 },
  cornerTopRight: { right: 0, top: 0, borderRightWidth: 4, borderTopWidth: 4, borderTopRightRadius: 16 },
  cornerBottomLeft: { left: 0, bottom: 0, borderLeftWidth: 4, borderBottomWidth: 4, borderBottomLeftRadius: 16 },
  cornerBottomRight: { right: 0, bottom: 0, borderRightWidth: 4, borderBottomWidth: 4, borderBottomRightRadius: 16 },
  torchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    position: 'absolute',
    bottom: 22,
  },
  permissionCard: {
    minHeight: 330,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  permissionTitle: { fontSize: 18, fontWeight: '700' },
  permissionText: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 6 },
  permissionButton: {
    minHeight: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 22,
  },
  permissionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  paymentContent: { alignItems: 'center', paddingTop: 18 },
  successIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedLabel: { fontSize: 13, marginTop: 13 },
  merchantName: { fontSize: 23, lineHeight: 29, fontWeight: '700', textAlign: 'center', marginTop: 3 },
  codeCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 22,
  },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeLabel: { fontSize: 12 },
  codeType: { fontSize: 11, fontWeight: '700' },
  codeValue: { fontSize: 15, lineHeight: 21, fontWeight: '600', marginTop: 7 },
  amountLabel: { width: '100%', fontSize: 14, fontWeight: '600', marginTop: 22, marginBottom: 9 },
  amountInputWrap: {
    width: '100%',
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: { fontSize: 24, fontWeight: '700', marginRight: 7 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: '700', paddingVertical: 14 },
  balanceText: { width: '100%', fontSize: 12, marginTop: 7 },
  payButton: {
    width: '100%',
    minHeight: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  scanAgainButton: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  scanAgainText: { fontSize: 14, fontWeight: '700' },
});
