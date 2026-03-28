import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function BankStatementSuccessScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { periodLabel, email } = route.params || {};

  const handleDone = () => {
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 24) }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
          <MaterialIcons name="mark-email-read" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Request received</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Your bank statement for{' '}
          <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{periodLabel || 'the selected period'}</Text>{' '}
          will be sent to{' '}
          <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{email || 'your email'}</Text>{' '}
          as a PDF shortly. You will also get a notification when it is ready.
        </Text>
      </View>
      <PrimaryButton text="Done" onPress={handleDone} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 24, justifyContent: 'center' },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  btn: { marginTop: 8 },
});
