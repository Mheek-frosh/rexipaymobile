import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-remix-icon';
import { Card, Chart2, More } from 'iconsax-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

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

          const activeColor = '#007AFF'; // Perfect iOS blue matching the design
          const inactiveColor = isDark ? '#D1D5DB' : '#111827';
          const color = isFocused ? activeColor : inactiveColor;
          const activeBgColor = isDark ? themeColors.surfaceVariant : '#E5E7EB';

          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = <Icon name={isFocused ? "home-5-fill" : "home-5-line"} size={26} color={color} />;
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
