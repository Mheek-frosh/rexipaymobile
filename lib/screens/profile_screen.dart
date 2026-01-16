import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../controllers/theme_controller.dart';
import '../widgets/logout_dialog.dart';
import '../routes/app_routes.dart';
import '../controllers/auth_controller.dart';

class ProfileScreen extends GetView<ThemeController> {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeController themeController = Get.find<ThemeController>();
    final AuthController authController = Get.find<AuthController>();

    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          automaticallyImplyLeading: false,
          title: Text(
            AppStrings.myProfile,
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
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
                    Stack(
                      children: [
                        Obx(
                          () => CircleAvatar(
                            radius: 40,
                            backgroundColor: Colors.grey[200],
                            backgroundImage:
                                authController.profileImage.value != null
                                ? FileImage(authController.profileImage.value!)
                                : const AssetImage('assets/user_avatar_2.png')
                                      as ImageProvider,
                            onBackgroundImageError: (_, __) {},
                            child: authController.profileImage.value == null
                                ? const Icon(
                                    Icons.person,
                                    color: Colors.white,
                                    size: 40,
                                  )
                                : null,
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: GestureDetector(
                            onTap: () =>
                                authController.showImageSourcePicker(context),
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: Color(0xFF2E63F6),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.camera_alt,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Obx(
                                () => Text(
                                  authController.userName.value,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary,
                                  ),
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
                          Obx(
                            () => Text(
                              '${AppStrings.accountNumber} ${authController.userPhone.value}',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Obx(
                            () => Text(
                              '${AppStrings.username} @${authController.userName.value.replaceAll(' ', '').toLowerCase()}',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
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
                      icon: themeController.isDarkMode
                          ? Icons.light_mode_outlined
                          : Icons.dark_mode_outlined,
                      iconBgColor: const Color(0xFFF5F5F5),
                      iconColor: Colors.black87,
                      title: themeController.isDarkMode
                          ? AppStrings.light
                          : AppStrings.dark,
                      trailing: Obx(
                        () => Switch(
                          value: themeController.isDarkMode,
                          onChanged: (value) => themeController.toggleTheme(),
                          activeColor: const Color(0xFF2E63F6),
                        ),
                      ),
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.account_balance_outlined,
                      iconBgColor: const Color(0xFFFFD166), // Yellow
                      title: AppStrings.cards,
                      onTap: () {
                        Get.toNamed(Routes.ADD_CARD_INTRO);
                      },
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.headset_mic_outlined,
                      iconBgColor: const Color(0xFFE8F5E9), // Light Green
                      iconColor: Colors.green,
                      title: AppStrings.support,
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.settings_outlined,
                      iconBgColor: const Color(0xFFE8F0FE), // Light Blue
                      iconColor: AppColors.primary,
                      title: AppStrings.settings,
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.storage_rounded,
                      iconBgColor: const Color(0xFFE8F5E9), // Light Green
                      iconColor: Colors.green,
                      title: AppStrings.dataPrivacy,
                      onTap: () {},
                    ),
                    _buildDivider(),

                    _buildMenuItem(
                      icon: Icons.logout_rounded,
                      iconBgColor: const Color(0xFFFFEBEE), // Light Red
                      iconColor: Colors.red,
                      title: AppStrings.logout,
                      onTap: () {
                        Get.bottomSheet(
                          const LogoutDialog(),
                          backgroundColor: Colors.transparent,
                        );
                      },
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
              .withOpacity(Get.find<ThemeController>().isDarkMode ? 0.2 : 1.0),
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
