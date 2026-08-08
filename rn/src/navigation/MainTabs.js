import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Mask, Path, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Card, Chart2, More } from 'iconsax-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import ChooseCardScreen from '../screens/cards/ChooseCardScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function ExactHomeIcon({ color, size = 26, isFocused }) {
  if (isFocused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Mask
          id="home-active-cutout"
          x="0"
          y="0"
          width="24"
          height="24"
          maskUnits="userSpaceOnUse"
        >
          <Rect width="24" height="24" fill="#FFFFFF" />
          <Path
            d="M 12 15.2 L 12 18.5"
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </Mask>
        <Path
          d="M 12 3.2 C 11.2 3.2 10.5 3.6 10 4.1 L 3.8 10 C 2.9 10.9 2.4 12.1 2.4 13.4 L 2.4 18.5 C 2.4 20.7 4.2 22.5 6.4 22.5 L 17.6 22.5 C 19.8 22.5 21.6 20.7 21.6 18.5 L 21.6 13.4 C 21.6 12.1 21.1 10.9 20.2 10 L 14 4.1 C 13.5 3.6 12.8 3.2 12 3.2 Z"
          fill={color}
          mask="url(#home-active-cutout)"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 3.2 C 11.2 3.2 10.5 3.6 10 4.1 L 3.8 10 C 2.9 10.9 2.4 12.1 2.4 13.4 L 2.4 18.5 C 2.4 20.7 4.2 22.5 6.4 22.5 L 17.6 22.5 C 19.8 22.5 21.6 20.7 21.6 18.5 L 21.6 13.4 C 21.6 12.1 21.1 10.9 20.2 10 L 14 4.1 C 13.5 3.6 12.8 3.2 12 3.2 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 12 15.2 L 12 18.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function AnimatedTabButton({
  activeBgColor,
  color,
  icon,
  isFocused,
  label,
  onPress,
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const focusProgress = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(focusProgress, {
      toValue: isFocused ? 1 : 0,
      damping: 14,
      stiffness: 190,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [focusProgress, isFocused]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.84,
      damping: 18,
      stiffness: 360,
      mass: 0.55,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      damping: 9,
      stiffness: 230,
      mass: 0.65,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  const focusScale = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });
  const focusLift = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1.5],
  });

  return (
    <TouchableOpacity
      accessibilityLabel={`${label} tab`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButtonWrapper}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeTabPill,
          { backgroundColor: activeBgColor, opacity: focusProgress },
        ]}
      />
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View
          style={[
            styles.tabButton,
            { transform: [{ translateY: focusLift }, { scale: focusScale }] },
          ]}
        >
          {icon}
          <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '600' }]}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const CustomTabBar = ({ state, navigation }) => {
  const { colors: themeColors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const glassTint = isIOS
    ? (isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight')
    : (isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight');

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          bottom: Math.max(insets.bottom, 10),
          shadowColor: isDark ? '#000000' : '#172FC7',
          shadowOpacity: isDark ? 0.3 : 0.11,
        },
      ]}
    >
      <BlurView
        tint={glassTint}
        intensity={isIOS ? 94 : (isDark ? 72 : 82)}
        blurReductionFactor={isIOS ? 1 : 3}
        experimentalBlurMethod={isIOS ? undefined : 'dimezisBlurView'}
        style={[
          styles.tabBar,
          {
            backgroundColor: isIOS
              ? (isDark ? 'rgba(13, 16, 24, 0.28)' : 'rgba(255, 255, 255, 0.2)')
              : (isDark ? 'rgba(12, 15, 22, 0.72)' : 'rgba(255, 255, 255, 0.68)'),
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.18)'
              : 'rgba(255, 255, 255, 0.86)',
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.glassHighlight,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.78)' },
          ]}
        />
        {state.routes.map((route, index) => {
          const label = route.name === 'Stats' ? 'Stats' : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const activeColor = isDark ? '#5B78FF' : themeColors.primary;
          const inactiveColor = themeColors.textSecondary;
          const color = isFocused ? activeColor : inactiveColor;
          const activeBgColor = isDark
            ? 'rgba(91, 120, 255, 0.22)'
            : 'rgba(23, 47, 199, 0.12)';

          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = <ExactHomeIcon color={color} size={22} isFocused={isFocused} />;
          } else if (route.name === 'Cards') {
            IconComponent = <Card size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'Stats') {
            IconComponent = <Chart2 size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'More') {
            IconComponent = <More size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          }

          return (
            <AnimatedTabButton
              activeBgColor={activeBgColor}
              color={color}
              icon={IconComponent}
              isFocused={isFocused}
              key={route.key}
              label={label}
              onPress={onPress}
            />
          );
        })}
      </BlurView>
    </View>
  );
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cards" component={ChooseCardScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="More" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 22,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    height: 66,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  glassHighlight: {
    borderRadius: 1,
    height: 1,
    left: 22,
    position: 'absolute',
    right: 22,
    top: 1,
  },
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    position: 'relative',
  },
  activeTabPill: {
    borderRadius: 22,
    bottom: 5,
    left: 3,
    position: 'absolute',
    right: 3,
    top: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    minWidth: 68,
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 2,
  },
});
