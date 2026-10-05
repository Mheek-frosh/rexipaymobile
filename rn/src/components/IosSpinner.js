import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function IosSpinner({ size = 38 }) {
  return (
    <Image
      source={require('../../assets/rexipay-r-green-orbit-loader.gif')}
      style={[styles.gif, { width: size, height: size }]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  gif: {
    backgroundColor: 'transparent',
  },
});
