import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-remix-icon';
import { Card, Chart2, More } from 'iconsax-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function ExactHomeIcon({ color, size = 26, isFocused, isDark }) {
  if (isFocused) {
    const keyholeColor = isDark ? '#1F222B' : '#FFFFFF';
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M 12 3.2 C 11.2 3.2 10.5 3.6 10 4.1 L 3.8 10 C 2.9 10.9 2.4 12.1 2.4 13.4 L 2.4 18.5 C 2.4 20.7 4.2 22.5 6.4 22.5 L 17.6 22.5 C 19.8 22.5 21.6 20.7 21.6 18.5 L 21.6 13.4 C 21.6 12.1 21.1 10.9 20.2 10 L 14 4.1 C 13.5 3.6 12.8 3.2 12 3.2 Z"
          fill={color}
        />
        <Path
          d="M 12 15.2 L 12 18.5"
          stroke={keyholeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
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

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors: themeColors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        { bottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <View style={[styles.tabBar, { 
        backgroundColor: themeColors.cardBackground,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? themeColors.border : 'transparent'
      }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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

          const activeColor = '#172FC7'; // RexiPay primary navy
          const inactiveColor = isDark ? '#D1D5DB' : '#111827';
          const color = isFocused ? activeColor : inactiveColor;
          const activeBgColor = isDark ? themeColors.surfaceVariant : '#E5E7EB';

          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = <ExactHomeIcon color={color} size={22} isFocused={isFocused} isDark={isDark} />;
          } else if (route.name === 'Cards') {
            IconComponent = <Card size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'Stats') {
            IconComponent = <Chart2 size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'More') {
            IconComponent = <More size={22} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={onPress}
              style={styles.tabButtonWrapper}
            >
              <View style={[styles.tabButton, isFocused && { backgroundColor: activeBgColor }]}>
                {IconComponent}
                <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '600' }]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
      <Tab.Screen name="Cards" component={CardsScreen} />
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
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 24,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 5,
  },
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 18,
    minWidth: 68,
    borderRadius: 18,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 2,
  }
});
