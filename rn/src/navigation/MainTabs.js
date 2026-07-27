import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
  // Correctly map 'colors' from useTheme to 'themeColors'
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View style={styles.tabBarContainer}>
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

          const activeColor = '#2E63F6'; // Matching app primary blue
          const inactiveColor = isDark ? '#D1D5DB' : '#111827';
          const color = isFocused ? activeColor : inactiveColor;
          const activeBgColor = isDark ? themeColors.surfaceVariant : '#E5E7EB';

          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = <ExactHomeIcon color={color} size={25} isFocused={isFocused} isDark={isDark} />;
          } else if (route.name === 'Cards') {
            IconComponent = <Card size={26} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'Stats') {
            IconComponent = <Chart2 size={26} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
          } else if (route.name === 'More') {
            IconComponent = <More size={26} color={color} variant={isFocused ? 'Bold' : 'Outline'} />;
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
    bottom: 24, // Floating margin
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 40,
    height: 76,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
    paddingVertical: 10,
    paddingHorizontal: 26, // Increased padding for wider indicator
    minWidth: 84, // Ensure a minimum width for the active pill
    borderRadius: 30, // Make it a perfect pill
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  }
});
