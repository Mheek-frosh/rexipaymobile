import React, { useEffect, useRef, useState } from 'react';
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

const HOME_BODY_PATH = 'M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274Z';
const HOME_DOOR_CUTOUT_PATH = 'M11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z';

function ExactHomeIcon({ color, size = 26, isFocused }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFocused ? (
        <Path
          clipRule="evenodd"
          d={`${HOME_BODY_PATH}${HOME_DOOR_CUTOUT_PATH}`}
          fill={color}
          fillRule="evenodd"
        />
      ) : (
        <>
          <Path
            d={HOME_BODY_PATH}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <Path
            d="M12 15V18"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      )}
    </Svg>
  );
}

function AnimatedTabButton({
  color,
  icon,
  isFocused,
  label,
  onPress,
}) {
  const pressOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(pressOpacity, {
      toValue: 0.64,
      duration: 75,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressOpacity, {
      toValue: 1,
      duration: 130,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

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
      <Animated.View style={[styles.tabButton, { opacity: pressOpacity }]}>
        {icon}
        <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '600' }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const CustomTabBar = ({ state, navigation }) => {
  const { colors: themeColors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const [liquidMotion, setLiquidMotion] = useState({ index: state.index, key: 0 });
  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const trailTranslateX = useRef(new Animated.Value(0)).current;
  const liquidScaleX = useRef(new Animated.Value(1)).current;
  const liquidScaleY = useRef(new Animated.Value(1)).current;
  const trailOpacity = useRef(new Animated.Value(0)).current;
  const isIOS = Platform.OS === 'ios';
  const glassTint = isIOS
    ? (isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight')
    : (isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight');
  const activeBgColor = isDark
    ? 'rgba(91, 120, 255, 0.24)'
    : 'rgba(23, 47, 199, 0.1)';
  const tabCount = state.routes.length;
  const tabWidth = tabBarWidth > 0 ? (tabBarWidth - 8) / tabCount : 0;

  useEffect(() => {
    setLiquidMotion((current) => (
      current.index === state.index
        ? current
        : { index: state.index, key: current.key + 1 }
    ));
  }, [state.index]);

  useEffect(() => {
    if (!tabWidth) return;

    const targetTranslateX = liquidMotion.index * tabWidth;
    indicatorTranslateX.stopAnimation();
    trailTranslateX.stopAnimation();
    liquidScaleX.stopAnimation();
    liquidScaleY.stopAnimation();
    trailOpacity.stopAnimation();
    liquidScaleX.setValue(1);
    liquidScaleY.setValue(1);
    trailOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(indicatorTranslateX, {
        toValue: targetTranslateX,
        damping: 17,
        stiffness: 175,
        mass: 0.72,
        useNativeDriver: true,
      }),
      Animated.spring(trailTranslateX, {
        toValue: targetTranslateX,
        damping: 20,
        stiffness: 105,
        mass: 0.82,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(liquidScaleX, {
          toValue: 1.16,
          duration: 95,
          useNativeDriver: true,
        }),
        Animated.spring(liquidScaleX, {
          toValue: 1,
          damping: 9,
          stiffness: 210,
          mass: 0.55,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(liquidScaleY, {
          toValue: 0.9,
          duration: 95,
          useNativeDriver: true,
        }),
        Animated.spring(liquidScaleY, {
          toValue: 1,
          damping: 9,
          stiffness: 210,
          mass: 0.55,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(trailOpacity, {
          toValue: 0.5,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(trailOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    indicatorTranslateX,
    liquidMotion.index,
    liquidMotion.key,
    liquidScaleX,
    liquidScaleY,
    tabWidth,
    trailOpacity,
    trailTranslateX,
  ]);

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
        onLayout={(event) => setTabBarWidth(event.nativeEvent.layout.width)}
        style={[
          styles.tabBar,
          {
            backgroundColor: isIOS
              ? (isDark ? 'rgba(13, 16, 24, 0.28)' : 'rgba(255, 255, 255, 0.2)')
              : (isDark ? 'rgba(12, 15, 22, 0.72)' : 'rgba(255, 255, 255, 0.68)'),
          },
        ]}
      >
        {tabWidth > 0 ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.liquidTrail,
                {
                  backgroundColor: activeBgColor,
                  left: 4 + (tabWidth - 18) / 2,
                  opacity: trailOpacity,
                  transform: [{ translateX: trailTranslateX }],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.liquidIndicator,
                {
                  backgroundColor: activeBgColor,
                  width: Math.max(tabWidth - 4, 0),
                  transform: [
                    { translateX: indicatorTranslateX },
                    { scaleX: liquidScaleX },
                    { scaleY: liquidScaleY },
                  ],
                },
              ]}
            />
          </>
        ) : null}
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
              color={color}
              icon={IconComponent}
              isFocused={isFocused}
              key={route.key}
              label={label}
              onPress={() => {
                setLiquidMotion((current) => ({ index, key: current.key + 1 }));
                onPress();
              }}
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
  liquidIndicator: {
    borderRadius: 32,
    bottom: 4,
    left: 6,
    position: 'absolute',
    top: 4,
    overflow: 'hidden',
  },
  liquidTrail: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
    top: 27,
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
