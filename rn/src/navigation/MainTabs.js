import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Card, Chart2, More } from 'iconsax-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import ChooseCardScreen from '../screens/cards/ChooseCardScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function ExactHomeIcon({ color, size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        clipRule="evenodd"
        d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z"
        fill={color}
        fillRule="evenodd"
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
    outputRange: [0, -0.75],
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
          bottom: Math.max(insets.bottom - 7, 5),
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
            ? 'rgba(91, 120, 255, 0.24)'
            : 'rgba(23, 47, 199, 0.1)';

          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = <ExactHomeIcon color={color} size={22} />;
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
    left: 10,
    right: 10,
    zIndex: 1000,
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 22,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 38,
    borderWidth: 1,
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    position: 'relative',
  },
  activeTabPill: {
    borderRadius: 32,
    bottom: 4,
    left: 2,
    position: 'absolute',
    right: 2,
    top: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    minWidth: 72,
    borderRadius: 28,
  },
  tabLabel: {
    fontSize: 11.5,
    marginTop: 3,
  },
});
