import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../theme/ThemeContext';

const formatNaira = (val) => `₦${(val / 1000000).toFixed(0)}M`;

export default function ChangeLimitScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [transactionLimit, setTransactionLimit] = useState(10);
  const [withdrawalLimit, setWithdrawalLimit] = useState(5);

  const maxTransaction = 50;
  const maxWithdrawal = 20;

  const handleSave = () => {
    Alert.alert('Success', 'Limits updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Change Limit</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Limit Per Transaction */}
        <View style={styles.sliderSection}>
          <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>
            Limit Per Transaction
          </Text>
          <View style={[styles.valueBox, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.valueText, { color: colors.textPrimary }]}>
              {formatNaira(transactionLimit * 1000000)}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={maxTransaction}
            value={transactionLimit}
            onValueChange={setTransactionLimit}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.minMaxText, { color: colors.textSecondary }]}>
              {formatNaira(1000000)}
            </Text>
            <Text style={[styles.minMaxText, { color: colors.textSecondary }]}>
              {formatNaira(maxTransaction * 1000000)}
            </Text>
          </View>
        </View>

        {/* Cash Withdrawal Limit */}
        <View style={[styles.sliderSection, { marginTop: 30 }]}>
          <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>
            Cash Withdrawal Limit
          </Text>
          <View style={[styles.valueBox, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.valueText, { color: colors.textPrimary }]}>
              {formatNaira(withdrawalLimit * 1000000)}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={maxWithdrawal}
            value={withdrawalLimit}
            onValueChange={setWithdrawalLimit}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.minMaxText, { color: colors.textSecondary }]}>
              {formatNaira(1000000)}
            </Text>
            <Text style={[styles.minMaxText, { color: colors.textSecondary }]}>
              {formatNaira(maxWithdrawal * 1000000)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  sliderSection: {},
  sliderLabel: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  valueBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  valueText: { fontSize: 18, fontWeight: '700' },
  slider: { width: '100%', height: 40 },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  minMaxText: { fontSize: 12 },
  saveBtn: {
    marginTop: 40,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
