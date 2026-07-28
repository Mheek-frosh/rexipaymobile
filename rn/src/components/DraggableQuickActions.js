import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 12;
const CONTAINER_WIDTH = width - 40;
const SLOT_WIDTH = (CONTAINER_WIDTH - CONTAINER_PADDING * 2) / 4;

export default function DraggableQuickActions({
  quickActions,
  setQuickActions,
  isEditing,
  setIsEditing,
  isDark,
  colors,
  navigation,
}) {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const dragX = useRef(new Animated.Value(0)).current;

  const currentActionsRef = useRef(quickActions);
  currentActionsRef.current = quickActions;

  const draggingIndexRef = useRef(null);
  draggingIndexRef.current = draggingIndex;

  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;

  const createPanResponder = (index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => isEditingRef.current,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        isEditingRef.current && Math.abs(gestureState.dx) > 5,
      onPanResponderGrant: () => {
        if (!isEditingRef.current) return;
        setDraggingIndex(index);
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {}
        dragX.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        dragX.setValue(gestureState.dx);

        const currentIdx = draggingIndexRef.current;
        if (currentIdx === null) return;

        const offsetSlots = Math.round(gestureState.dx / SLOT_WIDTH);
        const targetIdx = Math.max(
          0,
          Math.min(currentActionsRef.current.length - 1, index + offsetSlots)
        );

        if (targetIdx !== currentIdx) {
          try {
            Haptics.selectionAsync();
          } catch (e) {}
          const updated = [...currentActionsRef.current];
          const [movedItem] = updated.splice(currentIdx, 1);
          updated.splice(targetIdx, 0, movedItem);
          setQuickActions(updated);
          setDraggingIndex(targetIdx);
        }
      },
      onPanResponderRelease: () => {
        setDraggingIndex(null);
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }).start();
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {}
      },
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        dragX.setValue(0);
      },
    });

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
        <TouchableOpacity
          style={[
            styles.editBtn,
            isEditing && { backgroundColor: '#172FC7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
          ]}
          onPress={() => {
            setIsEditing(!isEditing);
            setDraggingIndex(null);
          }}
        >
          <Text style={[styles.editText, isEditing && { color: '#FFF' }]}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
          <MaterialIcons
            name={isEditing ? 'check' : 'edit'}
            size={13}
            color={isEditing ? '#FFF' : '#172FC7'}
          />
        </TouchableOpacity>
      </View>

      {isEditing && (
        <View style={styles.reorderHintBar}>
          <MaterialIcons name="touch-app" size={14} color="#172FC7" />
          <Text style={[styles.reorderHintText, { color: colors.textSecondary }]}>
            Drag any icon left or right to reorder slots
          </Text>
        </View>
      )}

      <View
        style={[
          styles.quickActionsRow,
          { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' },
          isEditing && { borderWidth: 1.5, borderColor: '#172FC766' },
        ]}
      >
        {quickActions.map((action, index) => {
          const isDragging = draggingIndex === index;
          const panResponder = createPanResponder(index);

          return (
            <Animated.View
              key={action.id}
              {...panResponder.panHandlers}
              style={[
                styles.actionBtnContainer,
                isDragging && {
                  transform: [
                    { translateX: dragX },
                    { scale: 1.15 },
                  ],
                  zIndex: 999,
                  elevation: 10,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  if (!isEditing) {
                    navigation.navigate(action.route || 'AllServices');
                  }
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.actionIconBox,
                    { backgroundColor: isDark ? `${action.color}33` : action.bg },
                    isDragging && {
                      borderWidth: 2.5,
                      borderColor: '#172FC7',
                      shadowColor: '#172FC7',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.35,
                      shadowRadius: 8,
                    },
                    isEditing && !isDragging && styles.jiggleBorder,
                  ]}
                >
                  <MaterialIcons name={action.icon} size={21} color={action.color} />
                </View>
                <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>{action.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    color: '#172FC7',
    fontSize: 12,
    fontWeight: '600',
  },
  reorderHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 6,
  },
  reorderHintText: {
    fontSize: 11,
    fontWeight: '500',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    padding: CONTAINER_PADDING,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  actionBtnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  jiggleBorder: {
    borderWidth: 1.5,
    borderColor: 'rgba(23, 47, 199, 0.25)',
  },
});
