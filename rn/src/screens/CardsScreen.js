import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function CardsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCardDetails, setShowCardDetails] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Virtual Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tab Switch */}
        <View style={[styles.tabSwitch, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={[
              styles.tabOption,
              selectedTab === 0 && { backgroundColor: colors.primary },
              selectedTab !== 0 && { borderWidth: 1, borderColor: colors.primary },
            ]}
            onPress={() => setSelectedTab(0)}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 0 ? '#FFF' : colors.primary },
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabOption,
              selectedTab === 1 && { backgroundColor: colors.primary },
              selectedTab !== 1 && { borderWidth: 1, borderColor: colors.primary },
            ]}
            onPress={() => setSelectedTab(1)}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 1 ? '#FFF' : colors.primary },
              ]}
            >
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.balance, { color: colors.textPrimary }]}>Bal: ₦250,000</Text>

        {/* Virtual Card */}
        <View style={styles.cardContainer}>
          <View style={[styles.virtualCard, { backgroundColor: '#2E63F6' }]}>
            <View style={styles.cardTop}>
              <Text style={styles.cardDebit}>Debit.</Text>
              <Text style={styles.cardBrand}>Rexipay</Text>
            </View>
            <View style={styles.cardChip}>
              <View style={styles.chipRect} />
            </View>
            <Text style={styles.cardNumber}>
              {showCardDetails ? '5355  4200  1234  5678' : '5355  ****  ****  ****'}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.validLabel}>VALID{'\n'}THRU</Text>
              </View>
              <Text style={styles.validValue}>**/**</Text>
              <Text style={styles.cardName}>USIDAMEN OZELUAH MIKE</Text>
              <Text style={styles.verve}>Verve</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tapHint}
          onPress={() => setShowCardDetails(!showCardDetails)}
        >
          <Text style={[styles.tapHintText, { color: colors.textSecondary }]}>
            Tap to see card details
          </Text>
        </TouchableOpacity>

        {/* Limit Settings */}
        <View style={[styles.limitCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.limitHeader}>
            <Text style={[styles.limitTitle, { color: colors.textPrimary }]}>Limit Settings</Text>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('ChangeLimit')}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.limitDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.limitRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.limitLabel, { color: colors.textSecondary }]}>
              Limit Per Transaction
            </Text>
            <Text style={[styles.limitValue, { color: colors.textPrimary }]}>₦10M</Text>
          </View>
          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.textSecondary }]}>
              Cash Withdrawal Limit
            </Text>
            <Text style={[styles.limitValue, { color: colors.textPrimary }]}>₦5M</Text>
          </View>
        </View>
      </ScrollView>
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
  tabSwitch: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    gap: 15,
  },
  tabOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, fontWeight: '600' },
  balance: { fontSize: 18, fontWeight: '700', marginTop: 30 },
  cardContainer: { marginTop: 20 },
  virtualCard: {
    width: width - 40,
    height: 200,
    padding: 20,
    borderRadius: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDebit: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  cardBrand: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  cardChip: { marginTop: 10 },
  chipRect: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 24,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  validLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 8 },
  validValue: { color: '#FFF', fontSize: 14 },
  cardName: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  verve: {
    color: '#E53935',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  tapHint: { alignItems: 'center', marginTop: 15 },
  tapHintText: { fontSize: 12, fontWeight: '500' },
  limitCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitTitle: { fontSize: 16, fontWeight: '700' },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  limitDivider: { height: 1, marginTop: 20 },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  limitLabel: { fontSize: 14 },
  limitValue: { fontSize: 14, fontWeight: '700' },
});
