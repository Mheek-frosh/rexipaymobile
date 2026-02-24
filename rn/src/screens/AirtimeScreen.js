import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../theme/ThemeContext';
import PinEntryModal from '../components/PinEntryModal';

const DATA_PLANS = [
  { name: '500MB', price: '₦500', validity: '30 days' },
  { name: '1GB', price: '₦1,000', validity: '30 days' },
  { name: '2GB', price: '₦2,000', validity: '30 days' },
  { name: '5GB', price: '₦5,000', validity: '30 days' },
  { name: '10GB', price: '₦10,000', validity: '30 days' },
];

const NETWORKS = [
  { name: 'MTN', code: 'MTN' },
  { name: 'Airtel', code: 'AIRTEL' },
  { name: 'Glo', code: 'GLO' },
  { name: '9mobile', code: '9MOBILE' },
];

export default function AirtimeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const phoneDigits = (phone || '').replace(/\D/g, '');
  const isValidPhone = phoneDigits.length >= 10 && phoneDigits.length <= 11;

  const handleBuy = () => {
    if (selectedTab === 0) {
      if (!phone || !amount) return;
      if (!isValidPhone) {
        Alert.alert('Error', 'Please put correct phone number.');
        return;
      }
    } else {
      if (!phone || !selectedPlan) return;
      if (!isValidPhone) {
        Alert.alert('Error', 'Please put correct phone number.');
        return;
      }
    }
    setShowSummaryModal(true);
  };

  const handleConfirmFromSummary = async () => {
    setShowSummaryModal(false);
    const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const canUseBiometrics = hasBiometrics && enrolled;

    if (canUseBiometrics) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm purchase with Face ID',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        proceedToSuccess();
      } else {
        setShowPinModal(true);
      }
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    proceedToSuccess();
  };

  const proceedToSuccess = () => {
    const amt = selectedTab === 0 ? amount : selectedPlan?.price?.replace(/[^\d]/g, '') || '0';
    const recipient =
      selectedTab === 0 ? phone : `${selectedPlan?.name} - ${phone}`;
    navigation.navigate('PaymentSuccess', {
      amount: amt,
      recipient,
      type: selectedTab === 0 ? 'airtime' : 'data',
    });
  };

  const summaryAmount = selectedTab === 0 ? amount : selectedPlan?.price;
  const summaryLabel =
    selectedTab === 0 ? 'Airtime' : `${selectedPlan?.name} Data`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Airtime & Data
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.tabToggle, { backgroundColor: colors.surfaceVariant }]}>
          <TouchableOpacity
            style={[
              styles.tabOption,
              selectedTab === 0 && { backgroundColor: colors.cardBackground },
            ]}
            onPress={() => setSelectedTab(0)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === 0 ? colors.textPrimary : colors.textSecondary,
                  fontWeight: '600',
                },
              ]}
            >
              Airtime
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabOption,
              selectedTab === 1 && { backgroundColor: colors.cardBackground },
            ]}
            onPress={() => setSelectedTab(1)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === 1 ? colors.textPrimary : colors.textSecondary,
                  fontWeight: '600',
                },
              ]}
            >
              Data
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.networkRow}>
          <View style={styles.networkCol}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Network</Text>
            <TouchableOpacity
              style={[styles.networkSelect, { borderColor: colors.border }]}
              onPress={() => setShowNetworkModal(true)}
            >
              <Text style={[styles.networkText, { color: colors.textPrimary }]}>
                {selectedNetwork}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.phoneCol}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Contact</Text>
            <TextInput
              style={[styles.phoneInput, styles.phoneInputField, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Phone number"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {selectedTab === 0 ? (
          <View style={styles.amountSection}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Enter amount
            </Text>
            <TextInput
              style={[
                styles.amountInput,
                { color: colors.textPrimary, borderColor: colors.border },
              ]}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
            />
            <Text style={[styles.currency, { color: colors.textSecondary }]}>
              NGN
            </Text>
          </View>
        ) : (
          <View style={styles.planSection}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Select Data Plan
            </Text>
            <View style={styles.planGrid}>
              {DATA_PLANS.map((plan, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor:
                        selectedPlan?.name === plan.name
                          ? colors.primary
                          : colors.border,
                      borderWidth: selectedPlan?.name === plan.name ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Text style={[styles.planName, { color: colors.textPrimary }]}>
                    {plan.name}
                  </Text>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.planValidity, { color: colors.textSecondary }]}>
                    {plan.validity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: colors.primary }]}
          onPress={handleBuy}
          disabled={
            selectedTab === 0 ? !phone || !amount : !phone || !selectedPlan
          }
        >
          <Text style={styles.buyBtnText}>
            {selectedTab === 0 ? 'Buy Airtime' : 'Buy Data'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Summary Modal */}
      <Modal visible={showSummaryModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSummaryModal(false)}
        >
          <View
            style={[styles.summaryModal, { backgroundColor: colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
              Confirm Purchase
            </Text>
            <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Type
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {summaryLabel}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Network
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {selectedNetwork}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Phone
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {phone}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowLast]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Amount
                </Text>
                <Text style={[styles.summaryAmount, { color: colors.primary }]}>
                  {summaryAmount}
                </Text>
              </View>
            </View>
            <View style={styles.summaryActions}>
              <TouchableOpacity
                style={[styles.summaryCancel, { borderColor: colors.border }]}
                onPress={() => setShowSummaryModal(false)}
              >
                <Text style={[styles.summaryCancelText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.summaryConfirm, { backgroundColor: colors.primary }]}
                onPress={handleConfirmFromSummary}
              >
                <Text style={styles.summaryConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <PinEntryModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinModal(false)}
        title="Enter 4-digit PIN to confirm"
      />

      <Modal visible={showNetworkModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNetworkModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Select Network
            </Text>
            {NETWORKS.map((n) => (
              <TouchableOpacity
                key={n.code}
                style={[styles.modalOption, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedNetwork(n.name);
                  setShowNetworkModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>
                  {n.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  tabToggle: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 12,
    marginBottom: 30,
  },
  tabOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: { fontSize: 14 },
  networkRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  networkCol: { flex: 0, width: 100, minWidth: 100 },
  phoneCol: { flex: 1, minWidth: 0 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  networkSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  networkText: { fontSize: 16 },
  phoneInput: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  phoneInputField: { flex: 1 },
  amountSection: { marginBottom: 40 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginTop: 12,
  },
  currency: { fontSize: 14, marginTop: 8 },
  planSection: { marginBottom: 40 },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  planCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
  },
  planName: { fontSize: 16, fontWeight: '600' },
  planPrice: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  planValidity: { fontSize: 12, marginTop: 4 },
  buyBtn: {
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: { fontSize: 16 },
  summaryModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  summaryTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 16, fontWeight: '600' },
  summaryAmount: { fontSize: 20, fontWeight: '700' },
  summaryActions: { flexDirection: 'row', gap: 12 },
  summaryCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryCancelText: { fontSize: 16 },
  summaryConfirm: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryConfirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
