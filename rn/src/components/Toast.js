import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Toast({ visible, message, onHide }) {
  useEffect(() => {
    if (!visible || !onHide) return;
    const t = setTimeout(onHide, 2000);
    return () => clearTimeout(t);
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
    zIndex: 9999,
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  text: { color: '#FFF', fontSize: 14, fontWeight: '500' },
});
