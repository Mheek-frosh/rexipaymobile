import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function AddCardScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [showSheet, setShowSheet] = useState(false);
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Cards</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/addcard.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => setShowSheet(true)}
        >
          <MaterialIcons name="add" size={22} color="#FFF" />
          <Text style={styles.addButtonText}>Add Card</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSheet} transparent animationType="slide">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowSheet(false)}
        >
          <View
            style={[styles.sheet, { backgroundColor: colors.cardBackground }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeaderRow}>
              <View style={{ width: 24 }} />
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                Add New Card
              </Text>
              <TouchableOpacity onPress={() => setShowSheet(false)}>
                <MaterialIcons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.fieldGroup]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
                ]}
                placeholder="Enter Full Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Card Number</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
                ]}
                placeholder="****************"
                placeholderTextColor={colors.textSecondary}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Valid Thru</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
                  ]}
                  placeholder="**/**"
                  placeholderTextColor={colors.textSecondary}
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.fieldGroup, styles.rowItem]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>CVV</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
                  ]}
                  placeholder="***"
                  placeholderTextColor={colors.textSecondary}
                  value={cvv}
                  onChangeText={setCvv}
                  secureTextEntry
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.sheetAddButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
              onPress={() => setShowSheet(false)}
            >
              <Text style={styles.sheetAddText}>Add</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    width: 220,
    height: 220,
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  rowItem: {
    flex: 1,
  },
  sheetAddButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAddText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

