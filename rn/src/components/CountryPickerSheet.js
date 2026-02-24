import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { COUNTRIES } from '../data/countries';

const { height } = Dimensions.get('window');

export default function CountryPickerSheet({ visible, onClose, onSelect, selectedCountry }) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      setSearch('');
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (country) => {
    onSelect(country);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.sheetTouch}>
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: colors.background },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Select country
            </Text>
            <View style={[styles.searchWrap, { backgroundColor: colors.cardBackground }]}>
              <MaterialIcons name="search" size={22} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search country or code..."
                placeholderTextColor={colors.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const isSelected =
                  selectedCountry && selectedCountry.dialCode === item.dialCode;
                return (
                  <TouchableOpacity
                    style={[
                      styles.row,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.flag}>{item.flag}</Text>
                    <Text style={[styles.countryName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.dialCode, { color: colors.textSecondary }]}>
                      {item.dialCode}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check-circle" size={22} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetTouch: { width: '100%' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: height * 0.75,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
    minHeight: 48,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 10 },
  list: { flexGrow: 0 },
  listContent: { paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    gap: 14,
  },
  flag: { fontSize: 24 },
  countryName: { flex: 1, fontSize: 16, fontWeight: '500' },
  dialCode: { fontSize: 15, fontWeight: '600' },
});
