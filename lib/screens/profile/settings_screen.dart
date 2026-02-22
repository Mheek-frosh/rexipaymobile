import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/theme_controller.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeController themeController = Get.find<ThemeController>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Text(AppStrings.settings, style: AppText.header2),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            _buildSettingsSection('Appearance', [
              _buildSettingsItem(
                icon: Icons.palette_outlined,
                title: 'Theme',
                subtitle: 'Light, Dark, or System',
                trailing: Obx(
                  () => Text(
                    themeController.isDarkMode ? 'Dark' : 'Light',
                    style: AppText.body2,
                  ),
                ),
                onTap: () => themeController.toggleTheme(),
              ),
            ]),
            const SizedBox(height: 24),
            _buildSettingsSection('Security', [
              _buildSettingsItem(
                icon: Icons.lock_outline,
                title: 'Change PIN',
                subtitle: 'Update your transaction PIN',
                onTap: () {},
              ),
              _buildSettingsItem(
                icon: Icons.fingerprint,
                title: 'Biometrics',
                subtitle: 'Use fingerprint or face ID',
                onTap: () {},
              ),
            ]),
            const SizedBox(height: 24),
            _buildSettingsSection('Notifications', [
              _buildSettingsItem(
                icon: Icons.notifications_outlined,
                title: 'Push Notifications',
                subtitle: 'Receive transaction alerts',
                onTap: () {},
              ),
              _buildSettingsItem(
                icon: Icons.email_outlined,
                title: 'Email Notifications',
                subtitle: 'Receive updates via email',
                onTap: () {},
              ),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildSettingsItem({
    required IconData icon,
    required String title,
    required String subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.primary, size: 22),
      ),
      title: Text(
        title,
        style: AppText.body1.copyWith(fontWeight: FontWeight.w600),
      ),
      subtitle: Text(subtitle, style: AppText.body2),
      trailing: trailing ?? Icon(Icons.chevron_right, color: AppColors.grey),
      onTap: onTap,
    );
  }
}
