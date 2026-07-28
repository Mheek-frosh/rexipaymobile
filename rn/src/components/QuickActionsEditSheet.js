import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const { height } = Dimensions.get('window');

export default function QuickActionsEditSheet({
  visible,
  onClose,
  quickActions,
  onSaveOrder,
}) {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (visible) {
      setItems([...quickActions]);
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
  }, [visible, quickActions]);

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const setPosition = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  const handleSave = () => {
    onSaveOrder(items);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{ width: '100%' }}
        >
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.handleBar, { backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }]} />

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Customize Quick Actions</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Reorder items to adjust their positions on Home Screen</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? '#2C2F3A' : '#F3F4F6' }]}>
                <MaterialIcons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.list}>
              {items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: isDark ? '#2C2F3A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' },
                  ]}
                >
                  <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: isDark ? `${item.color}33` : item.bg }]}>
                      <MaterialIcons name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={styles.itemTextCol}>
                      <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                      <Text style={styles.posBadge}>Slot {index + 1}</Text>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    {/* Move Up / Down Buttons */}
                    <View style={styles.arrowGroup}>
                      <TouchableOpacity
                        style={[styles.arrowBtn, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }, index === 0 && styles.disabledBtn]}
                        onPress={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <MaterialIcons name="keyboard-arrow-up" size={20} color={index === 0 ? '#9CA3AF' : colors.textPrimary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.arrowBtn, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }, index === items.length - 1 && styles.disabledBtn]}
                        onPress={() => moveDown(index)}
                        disabled={index === items.length - 1}
                      >
                        <MaterialIcons name="keyboard-arrow-down" size={20} color={index === items.length - 1 ? '#9CA3AF' : colors.textPrimary} />
                      </TouchableOpacity>
                    </View>

                    {/* Slot Position Buttons (1, 2, 3, 4) */}
                    <View style={styles.slotsRow}>
                      {[0, 1, 2, 3].map((pos) => (
                        <TouchableOpacity
                          key={pos}
                          style={[
                            styles.slotBtn,
                            { backgroundColor: isDark ? '#1F222B' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' },
                            index === pos && { backgroundColor: '#172FC7', borderColor: '#172FC7' },
                          ]}
                          onPress={() => setPosition(index, pos)}
                        >
                          <Text
                            style={[
                              styles.slotBtnText,
                              { color: index === pos ? '#FFF' : colors.textSecondary },
                            ]}
                          >
                            {pos + 1}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Arrangement</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  list: {
    gap: 12,
    marginBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextCol: {
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  posBadge: {
    fontSize: 11,
    color: '#172FC7',
    fontWeight: '600',
    marginTop: 2,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrowGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  slotBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#172FC7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#172FC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
