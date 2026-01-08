import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../controllers/theme_controller.dart';
import '../controllers/main_controller.dart';

class ProfileScreen extends GetView<ThemeController> {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(
            'My Profile',
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
          backgroundColor: AppColors.background,
          elevation: 0,
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 20),
              // User Info Section
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.cardBackground,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 35,
                      backgroundImage: const AssetImage(
                        'assets/user_avatar_2.png',
                      ),
                      onBackgroundImageError: (_, __) {},
                      backgroundColor: Colors.grey,
                      child: const Icon(Icons.person, color: Colors.white),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Michael Ozeluah',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Icon(
                                Icons.copy_rounded,
                                size: 20,
                                color: AppColors.textSecondary,
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          RichText(
                            text: TextSpan(
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                              children: [
                                const TextSpan(text: 'Account number '),
                                TextSpan(
                                  text: '9034448700',
                                  style: GoogleFonts.inter(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 2),
                          RichText(
                            text: TextSpan(
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                              children: [
                                const TextSpan(text: 'Username '),
                                TextSpan(
                                  text: '@MheekfrOsh',
                                  style: GoogleFonts.inter(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // Menu List
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
                decoration: BoxDecoration(
                  color: AppColors.cardBackground,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    // Dark Mode Toggle
                    _buildMenuItem(
                      icon: controller.isDarkMode
                          ? Icons.light_mode_outlined
                          : Icons.dark_mode_outlined,
                      iconBgColor: Colors.grey[400]!,
                      title: controller.isDarkMode ? 'Dark' : 'Light',
                      trailing: Switch(
                        value: controller.isDarkMode,
                        activeColor: Colors.white,
                        activeTrackColor: AppColors.primary,
                        onChanged: (val) {
                          controller.toggleTheme();
                        },
                      ),
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.account_balance_outlined,
                      iconBgColor: const Color(0xFFFFD166), // Yellow
                      title: 'Cards',
                      onTap: () {
                        Get.find<MainController>().changePage(1);
                      },
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.headset_mic_outlined,
                      iconBgColor: const Color(0xFFE8F5E9), // Light Green
                      iconColor: Colors.green,
                      title: 'Support',
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.settings_outlined,
                      iconBgColor: const Color(0xFFE8F0FE), // Light Blue
                      iconColor: AppColors.primary,
                      title: 'Settings',
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.storage_rounded,
                      iconBgColor: const Color(0xFFE8F5E9), // Light Green
                      iconColor: Colors.green,
                      title: 'Data & Privacy',
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.logout_rounded,
                      iconBgColor: const Color(0xFFFFEBEE), // Light Red
                      iconColor: Colors.red,
                      title: 'Logout',
                      onTap: () {},
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color iconBgColor,
    Color? iconColor,
    required String title,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: (iconColor != null ? iconBgColor : Colors.grey[400]!)
              .withOpacity(controller.isDarkMode ? 0.2 : 1.0),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: iconColor != null ? iconColor : Colors.white,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary.withOpacity(0.7),
        ),
      ),
      trailing:
          trailing ??
          Icon(Icons.chevron_right, size: 24, color: AppColors.grey),
      onTap: onTap,
    );
  }

  Widget _buildDivider() {
    return Divider(height: 1, color: AppColors.grey.withOpacity(0.1));
  }
}
