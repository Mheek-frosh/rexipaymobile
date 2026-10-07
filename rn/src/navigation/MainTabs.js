import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Clock, Home2, Profile } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import HomeScreen from '../screens/home/HomeScreen';
import ChooseCardScreen from '../screens/cards/ChooseCardScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_META = {
  Home: { label: 'Home', Icon: Home2 },
  Cards: { label: 'Cards', Icon: Card },
  Stats: { label: 'History', Icon: Clock },
  More: { label: 'Profile', Icon: Profile },
};

const SLOT = 56;
const ORB = 46;

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const focusX = useRef(new Animated.Value(state.index * SLOT)).current;

  useEffect(() => {
    Animated.spring(focusX, {
      toValue: state.index * SLOT,
      useNativeDriver: true,
      friction: 8,
      tension: 90,
    }).start();
  }, [focusX, state.index]);

  const onTabPress = (route, index) => {
    Haptics.selectionAsync().catch(() => {});
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom - 8, 0) }]} pointerEvents="box-none">
      <View style={styles.cluster} pointerEvents="box-none">
        <View
          style={[
            styles.pill,
            {
              backgroundColor: isDark ? '#3A3A3C' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : colors.border,
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.focus, { transform: [{ translateX: focusX }] }]}
          />
          {state.routes.map((route, index) => {
            const meta = TAB_META[route.name];
            const focused = state.index === index;
            const TabIcon = meta.Icon;
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={`${meta.label} tab`}
                accessibilityState={{ selected: focused }}
                activeOpacity={0.75}
                onPress={() => onTabPress(route, index)}
                hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
                style={styles.tab}
              >
                <TabIcon
                  size={22}
                  color={focused ? '#101010' : (isDark ? '#AEAEB2' : '#8E8E93')}
                  variant={focused ? 'Bold' : 'Linear'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
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
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 1000,
  },
  cluster: {
    position: 'relative',
    marginBottom: 0,
    overflow: 'visible',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
  tab: {
    width: SLOT,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  focus: {
    position: 'absolute',
    left: 6 + (SLOT - ORB) / 2,
    top: (54 - ORB) / 2,
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    backgroundColor: '#C6F54E',
    zIndex: 0,
  },
});
