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
  primary: '#D6F25A',
  primaryLight: 'rgba(214, 242, 90, 0.16)',
  accent: '#D6F25A',
  onPrimary: '#071910',
  background: '#071910',
  cardBackground: '#0F2C22',
  navBackground: '#0C261E',
  surfaceVariant: '#17362B',
  textPrimary: '#FFFFFF',
  textSecondary: '#A7BDB2',
  border: '#1E4336',
  error: '#FF6B6B',
  success: '#3DDC97',
  heroBackground: '#0B241C',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255,255,255,0.75)',
  pillBackground: '#D6F25A',
  pillText: '#071910',
  buttonRadius: 999,
};

export const COLORS = BLUE_LIGHT;
export const DARK_COLORS = BLUE_DARK;

export const PALETTES = {
  blue: { id: 'blue', label: 'Blue', light: BLUE_LIGHT, dark: BLUE_DARK },
  bamboo: { id: 'bamboo', label: 'Bamboo', light: BAMBOO_LIGHT, dark: BAMBOO_DARK },
};

export function getPaletteColors(palette, isDark) {
  const entry = PALETTES[palette] || PALETTES.bamboo;
  return isDark ? entry.dark : entry.light;
}
