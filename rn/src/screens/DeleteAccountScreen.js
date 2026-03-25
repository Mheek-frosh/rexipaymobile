import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

const DELETE_PHRASE = 'DELETE';

export default function DeleteAccountScreen() {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');

  const canDelete = understood && confirmText.trim() === DELETE_PHRASE;

  const handleDelete = () => {
    if (!canDelete) return;
    Alert.alert(
      'Delete account permanently?',
      'This cannot be undone. All access to RexiPay services for this profile will end.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            // In production: POST /account/delete with reason; then:
            logout();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16), borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.headerBack}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Delete account</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.warnBanner, { backgroundColor: '#EF444415', borderColor: '#EF444433' }]}>
            <MaterialIcons name="warning" size={22} color="#EF4444" />
            <Text style={[styles.warnText, { color: '#B91C1C' }]}>
              Deleting your account is permanent. You will lose access to balances, cards, savings goals, and
              transaction history tied to this profile.
            </Text>
          </View>

          <Text style={[styles.bulletTitle, { color: colors.textPrimary }]}>Before you continue</Text>
          {[
            'Any pending transfers or scheduled payments may be cancelled.',
            'Download or request statements you need before deleting.',
            'You may need to sign up again with a new verification if you return.',
          ].map((line) => (
            <View key={line} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{line}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setUnderstood(!understood)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: understood ? colors.primary : colors.border,
                  backgroundColor: understood ? colors.primary : 'transparent',
                },
              ]}
            >
              {understood && <MaterialIcons name="check" size={18} color="#FFF" />}
            </View>
            <Text style={[styles.checkLabel, { color: colors.textPrimary }]}>
              I understand my account and data will be removed as described above.
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Type <Text style={{ fontWeight: '800' }}>{DELETE_PHRASE}</Text> to confirm
          </Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            placeholder={DELETE_PHRASE}
            placeholderTextColor={colors.textSecondary}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Text style={[styles.label, { color: colors.textPrimary, marginTop: 16 }]}>
            Reason (optional)
          </Text>
          <TextInput
            style={[styles.inputMultiline, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            placeholder="Tell us why you are leaving"
            placeholderTextColor={colors.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <PrimaryButton
            text="Delete my account"
            onPress={handleDelete}
            disabled={!canDelete}
            style={[styles.deleteBtn, canDelete && styles.deleteBtnActive]}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerBack: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20 },
  warnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  warnText: { flex: 1, fontSize: 14, lineHeight: 20 },
  bulletTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', marginBottom: 8, paddingRight: 8 },
  bullet: { fontSize: 16, marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 20, marginBottom: 20 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  inputMultiline: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
  },
  deleteBtn: { marginTop: 20 },
  deleteBtnActive: { backgroundColor: '#EF4444' },
});
