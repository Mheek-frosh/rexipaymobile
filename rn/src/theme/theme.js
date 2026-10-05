const BLUE_LIGHT = {
  primary: '#172FC7',
  primaryLight: 'rgba(23, 47, 199, 0.1)',
  accent: '#172FC7',
  onPrimary: '#FFFFFF',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  navBackground: '#FFFFFF',
  surfaceVariant: '#F0F0F0',
  textPrimary: '#000000',
  textSecondary: '#757575',
  border: '#E5E7EB',
  error: '#E53935',
  success: '#10B981',
  heroBackground: '#172FC7',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.8)',
  pillBackground: 'rgba(255,255,255,0.15)',
  pillText: '#FFFFFF',
  buttonRadius: 16,
};

const BLUE_DARK = {
  primary: '#4F6EFF',
  primaryLight: 'rgba(79, 110, 255, 0.2)',
  accent: '#4F6EFF',
  onPrimary: '#FFFFFF',
  background: '#0D0D0D',
  cardBackground: '#1F222B',
  navBackground: '#1F222B',
  surfaceVariant: '#2C2F3A',
  textPrimary: '#FFFFFF',
  textSecondary: '#9E9E9E',
  border: '#374151',
  error: '#E53935',
  success: '#10B981',
  heroBackground: '#172FC7',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.8)',
  pillBackground: 'rgba(255,255,255,0.15)',
  pillText: '#FFFFFF',
  buttonRadius: 16,
};

const BAMBOO_LIGHT = {
  primary: '#123D2E',
  primaryLight: 'rgba(18, 61, 46, 0.12)',
  accent: '#C6E84A',
  onPrimary: '#FFFFFF',
  background: '#F3F6F0',
  cardBackground: '#FFFFFF',
  navBackground: '#FFFFFF',
  surfaceVariant: '#E6EEE7',
  textPrimary: '#10241C',
  textSecondary: '#5E7068',
  border: '#D7E3DB',
  error: '#E53935',
  success: '#1F8A4C',
  heroBackground: '#0B241C',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.78)',
  pillBackground: '#D6F25A',
  pillText: '#0B241C',
  buttonRadius: 999,
};

const BAMBOO_DARK = {
  primary: '#C6F54E',
  primaryLight: 'rgba(198, 245, 78, 0.16)',
  accent: '#C6F54E',
  onPrimary: '#101010',
  background: '#0C0C0C',
  cardBackground: '#171717',
  navBackground: '#141414',
  surfaceVariant: '#242424',
  textPrimary: '#FFFFFF',
  textSecondary: '#8D8D93',
  border: '#2A2A2A',
  error: '#FF6B6B',
  success: '#C6F54E',
  heroBackground: '#171717',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.7)',
  pillBackground: '#C6F54E',
  pillText: '#101010',
  buttonRadius: 999,
};

export const LIME_DARK = {
  background: '#0C0C0C',
  card: '#171717',
  cardBorder: '#2A2A2A',
  lime: '#C6F54E',
  onLime: '#101010',
  text: '#FFFFFF',
  muted: '#8D8D93',
  bubble: '#242424',
  nav: '#141414',
  chip: '#202020',
  chipBorder: '#303030',
  switchBorder: 'rgba(255,255,255,0.55)',
  accentText: '#C6F54E',
  amountOut: '#D0D0D0',
};

export const LIME_LIGHT = {
  background: '#F4F5F7',
  card: '#FFFFFF',
  cardBorder: '#E4E4E7',
  lime: '#C6F54E',
  onLime: '#101010',
  text: '#111111',
  muted: '#6B7280',
  bubble: '#EEF0F3',
  nav: '#FFFFFF',
  chip: '#F3F4F6',
  chipBorder: '#E4E4E7',
  switchBorder: 'rgba(17,17,17,0.18)',
  accentText: '#3F6212',
  amountOut: '#374151',
};

export const LIME_UI = LIME_DARK;

function toThemeColors(ui) {
  return {
    primary: ui.lime,
    primaryLight: 'rgba(198, 245, 78, 0.22)',
    accent: ui.lime,
    onPrimary: ui.onLime,
    background: ui.background,
    cardBackground: ui.card,
    navBackground: ui.nav,
    surfaceVariant: ui.bubble,
    textPrimary: ui.text,
    textSecondary: ui.muted,
    border: ui.cardBorder,
    error: '#E53935',
    success: '#1F8A4C',
    heroBackground: LIME_DARK.card,
    heroText: LIME_DARK.text,
    heroMuted: 'rgba(255,255,255,0.78)',
    pillBackground: ui.lime,
    pillText: ui.onLime,
    accentText: ui.accentText,
    buttonRadius: 999,
  };
}

export const COLORS = BLUE_LIGHT;
export const DARK_COLORS = BLUE_DARK;

export const PALETTES = {
  blue: { id: 'blue', label: 'Blue', light: BLUE_LIGHT, dark: BLUE_DARK },
  bamboo: { id: 'bamboo', label: 'Bamboo', light: BAMBOO_LIGHT, dark: BAMBOO_DARK },
};

export function getPaletteColors(_palette, isDark) {
  return toThemeColors(isDark ? LIME_DARK : LIME_LIGHT);
}
