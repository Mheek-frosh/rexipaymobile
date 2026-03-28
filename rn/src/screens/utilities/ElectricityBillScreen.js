import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { fetchDiscos } from '../../services/appContentService';

export default function ElectricityBillScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [discos, setDiscos] = useState([]);
  const [disco, setDisco] = useState('');
  const [meter, setMeter] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchDiscos();
      if (!mounted) return;
      const list = Array.isArray(data) ? data : [];
      setDiscos(list);
      if (list.length) setDisco((prev) => (list.includes(prev) ? prev : list[0]));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const pay = () => {
    if (meter.trim().length < 5) {
      Alert.alert('Meter number', 'Enter a valid prepaid meter number.');
      return;
    }
    if (!amount.trim() || Number(amount) < 1000) {
      Alert.alert('Amount', 'Minimum top-up is ₦1,000.');
      return;
    }
    Alert.alert('Electricity', `Top-up ₦${amount} for ${meter} (${disco}) — confirm when payment is live.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Electricity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Recharge prepaid meters instantly. Postpaid coming soon.
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Disco</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoRow}>
          {discos.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.discoChip,
                {
                  borderColor: disco === d ? colors.primary : colors.border,
                  backgroundColor: disco === d ? colors.primaryLight : colors.cardBackground,
                },
              ]}
              onPress={() => setDisco(d)}
            >
              <Text style={[styles.discoText, { color: disco === d ? colors.primary : colors.textPrimary }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Meter number</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="Prepaid meter number"
          placeholderTextColor={colors.textSecondary}
          value={meter}
          onChangeText={setMeter}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Amount (₦)</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="5000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={[styles.hint, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name="info-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Verify meter number on your device before paying.
          </Text>
        </View>

        <TouchableOpacity style={[styles.payBtn, { backgroundColor: colors.primary }]} onPress={pay} activeOpacity={0.9}>
          <Text style={styles.payBtnText}>Pay electricity</Text>
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
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  discoRow: { gap: 8, paddingBottom: 4 },
  discoChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  discoText: { fontSize: 13, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  hint: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 12, marginTop: 16 },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },
  payBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
