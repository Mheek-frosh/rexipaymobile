import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/theme_controller.dart';

class AppColors {
  static const Color primary = Color(0xFF2E63F6);
  static const Color secondary = Color(0xFF0D0D0D);

  static bool get _isDark {
    try {
      return Get.find<ThemeController>().isDarkMode;
    } catch (_) {
      return Get.isDarkMode;
    }
  }

  static Color get background =>
      _isDark ? const Color(0xFF0D0D0D) : const Color(0xFFF5F5F5);

  static Color get white => _isDark ? const Color(0xFF1C1E23) : Colors.white;

  static Color get black => _isDark ? Colors.white : Colors.black;

  static Color get grey => Colors.grey;
  static Color get red => Colors.red;
  static Color get green => Colors.green;

  static Color get cardBackground =>
      _isDark ? const Color(0xFF1C1E23) : Colors.white;

  static Color get textPrimary => _isDark ? Colors.white : Colors.black;

  static Color get textSecondary =>
      _isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575);

  static Color get navBackground =>
      _isDark ? const Color(0xFF121317) : Colors.white;
}
