import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowSwapHorizontal, Card, Clock, Home2, Profile } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { LIME_UI } from '../theme/theme';
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

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

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
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          const focused = state.index === index;
          const color = focused ? LIME_UI.lime : LIME_UI.muted;
          const TabIcon = meta.Icon;
          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                accessibilityRole="tab"
                accessibilityLabel={`${meta.label} tab`}
                accessibilityState={{ selected: focused }}
                activeOpacity={0.75}
                onPress={() => onTabPress(route, index)}
                style={styles.tab}
              >
                <TabIcon size={22} color={color} variant={focused ? 'Bold' : 'Linear'} />
                <Text style={[styles.label, { color, fontWeight: focused ? '700' : '500' }]}>
                  {meta.label}
                </Text>
              </TouchableOpacity>
              {route.name === 'Cards' ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Send money"
                  activeOpacity={0.85}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    navigation.navigate('Transfer');
                  }}
                  style={styles.centerButton}
                >
                  <ArrowSwapHorizontal size={28} color={LIME_UI.onLime} variant="Bold" />
                </TouchableOpacity>
              ) : null}
            </React.Fragment>
          );
        })}
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
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: LIME_UI.nav,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#242424',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    gap: 3,
  },
  label: {
    fontSize: 11,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -36,
    marginHorizontal: 4,
    backgroundColor: LIME_UI.lime,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: LIME_UI.lime,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
});
