import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackButton from '../../components/AppBackButton';
import { useTheme } from '../../theme/ThemeContext';

const GIFT_CARDS = [
  { id: 'apple', name: 'Apple', subtitle: 'App Store & iTunes', color: '#111827', icon: 'apple' },
  { id: 'google', name: 'Google Play', subtitle: 'Apps, games & more', color: '#16A34A', icon: 'play-arrow' },
  { id: 'amazon', name: 'Amazon', subtitle: 'Shop millions of items', color: '#F59E0B', icon: 'shopping-cart' },
  { id: 'netflix', name: 'Netflix', subtitle: 'Movies and series', color: '#DC2626', icon: 'live-tv' },
  { id: 'steam', name: 'Steam', subtitle: 'PC games and content', color: '#2563EB', icon: 'sports-esports' },
  { id: 'spotify', name: 'Spotify', subtitle: 'Music and podcasts', color: '#16A34A', icon: 'headphones' },
];

export default function GiftCardsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const openGiftCard = (giftCard) => {
    Alert.alert(giftCard.name, `${giftCard.name} gift card purchases will be available soon.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Gift cards</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="card-giftcard" size={30} color={colors.primary} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Give something they will love</Text>
            <Text style={styles.heroSubtitle}>Choose a popular digital gift card and pay with RexiPay.</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Popular gift cards</Text>
        {GIFT_CARDS.map((giftCard) => (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.78}
            key={giftCard.id}
            onPress={() => openGiftCard(giftCard)}
            style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <View style={[styles.cardIcon, { backgroundColor: `${giftCard.color}18` }]}>
              <MaterialIcons name={giftCard.icon} size={25} color={giftCard.color} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{giftCard.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{giftCard.subtitle}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSpacer: { height: 40, width: 40 },
  content: { paddingHorizontal: 20 },
  hero: { alignItems: 'center', borderRadius: 20, flexDirection: 'row', padding: 18 },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  heroCopy: { flex: 1, marginLeft: 14 },
  heroTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  heroSubtitle: { color: 'rgba(255,255,255,0.86)', fontSize: 12, lineHeight: 17, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 24 },
  card: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 11,
    minHeight: 72,
    padding: 13,
  },
  cardIcon: { alignItems: 'center', borderRadius: 14, height: 46, justifyContent: 'center', width: 46 },
  cardCopy: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardSubtitle: { fontSize: 12, marginTop: 4 },
});
