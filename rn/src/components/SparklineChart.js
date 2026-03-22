import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

/**
 * Normalized line chart from numeric series (e.g. CoinGecko sparkline).
 */
export default function SparklineChart({ data, width, height, color = '#2E63F6', strokeWidth = 1.5 }) {
  if (!data || !Array.isArray(data) || data.length < 2 || width <= 0 || height <= 0) {
    return <View style={{ width, height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}
