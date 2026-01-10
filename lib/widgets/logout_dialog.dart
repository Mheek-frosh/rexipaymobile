import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_strings.dart';
import 'custom_buttons.dart';

class LogoutDialog extends StatelessWidget {
  const LogoutDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Close Icon
          Align(
            alignment: Alignment.topRight,
            child: IconButton(
              onPressed: () => Get.back(),
              icon: Icon(Icons.close, color: AppColors.textSecondary, size: 24),
            ),
          ),
          const SizedBox(height: 10),
          // Title
          Text(
            AppStrings.logout,
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: const Color(0xFFFF4B4B), // Red title
            ),
          ),
          const SizedBox(height: 16),
          // Message
          Text(
            AppStrings.sureToLogout,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          // Buttons
          Row(
            children: [
              Expanded(
                child: SecondaryButton(
                  text: AppStrings.cancel,
                  onPressed: () => Get.back(),
                ),
              ),
              const SizedBox(width: 15),
              Expanded(
                child: PrimaryButton(
                  text: AppStrings.logout,
                  onPressed: () {
                    Get.back();
                    // TODO: Implement actual logout logic
                    Get.offAllNamed('/signup');
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
