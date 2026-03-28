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
import { fetchNetworks } from '../../services/appContentService';

const PLANS = ['500MB · 7 days', '1.5GB · 30 days', '3GB · 30 days', '10GB · 30 days'];

export default function InternetDataScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [networks, setNetworks] = useState([]);
  const [network, setNetwork] = useState('mtn');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState(PLANS[1]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchNetworks();
      if (!mounted) return;
      const list = Array.isArray(data) ? data : [];
      setNetworks(list);
      if (list.length) setNetwork((prev) => (list.some((n) => n.id === prev) ? prev : list[0].id));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const pay = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Phone number', 'Enter a valid Nigerian mobile number.');
      return;
    }
    Alert.alert('Data purchase', `You selected ${plan} for ${phone}. Payment will process when connected.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Internet / Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Buy mobile data bundles for any Nigerian line.
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Network</Text>
        <View style={styles.row}>
          {networks.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[
                styles.netChip,
                {
                  borderColor: network === n.id ? colors.primary : colors.border,
                  backgroundColor: network === n.id ? colors.primaryLight : colors.cardBackground,
                },
              ]}
              onPress={() => setNetwork(n.id)}
            >
              <Text style={[styles.netChipText, { color: network === n.id ? colors.primary : colors.textPrimary }]}>
                {n.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Phone number</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="0801 234 5678"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Bundle</Text>
        {PLANS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.planRow,
              {
                borderColor: plan === p ? colors.primary : colors.border,
                backgroundColor: colors.cardBackground,
              },
            ]}
            onPress={() => setPlan(p)}
          >
            <MaterialIcons
              name={plan === p ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={22}
              color={plan === p ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.planText, { color: colors.textPrimary }]}>{p}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.payBtn, { backgroundColor: colors.primary }]} onPress={pay} activeOpacity={0.9}>
          <Text style={styles.payBtnText}>Continue to pay</Text>
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
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  netChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  netChipText: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  planText: { fontSize: 15, fontWeight: '600', flex: 1 },
  payBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
