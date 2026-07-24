import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-remix-icon';
import { Card, Chart2, More } from 'iconsax-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, color }) => {
  const size = focused ? 23 : 28;
  const iconColor = focused ? '#FFFFFF' : color;
  let icon = null;

  if (name === 'Home') {
    icon = <Icon name="home-5-fill" size={size} color={iconColor} />;
  } else {
    const common = { size, color: iconColor };
    if (name === 'Cards') icon = <Card {...common} />;
    if (name === 'Stats') icon = <Chart2 {...common} />;
    if (name === 'More') icon = <More {...common} />;
  }

  if (!icon) return null;

  return focused ? (
    <View style={[styles.focusedIcon, { backgroundColor: color }]}>
      {icon}
    </View>
  ) : (
    <View style={styles.inactiveIcon}>{icon}</View>
  );
};

const GlassTabButton = ({ children, style, isDark, ...props }) => {
  const focused = props['aria-selected'];

  return (
    <Pressable {...props} style={[style, styles.tabButton]}>
      <View
        pointerEvents="none"
        style={[
          styles.tabButtonContent,
          focused && styles.focusedTab,
          focused && isDark && styles.focusedTabDark,
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
};

export default function MainTabs() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#F5F5F7' : '#111111',
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          height: 88,
          paddingHorizontal: 7,
          paddingVertical: 7,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderRadius: 40,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.32 : 0.14,
          shadowRadius: 20,
          elevation: 12,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={60}
            tint={isDark ? 'systemThinMaterialDark' : 'systemThinMaterialLight'}
            experimentalBlurMethod="dimezisBlurView"
            style={[
              StyleSheet.absoluteFill,
              styles.glassBackground,
              {
                backgroundColor: isDark
                  ? 'rgba(31, 34, 43, 0.78)'
                  : 'rgba(255, 255, 255, 0.84)',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(255, 255, 255, 0.9)',
              },
            ]}
          />
        ),
        tabBarButton: (props) => <GlassTabButton {...props} isDark={isDark} />,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="More" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  glassBackground: {
    borderRadius: 40,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabButton: {
    padding: 0,
  },
  tabButtonContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  focusedTab: {
    backgroundColor: 'rgba(120, 120, 128, 0.18)',
  },
  focusedTabDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  focusedIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  inactiveIcon: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
});
