import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
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
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Pull Handle
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 10),
            // Close Button
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Get.back(),
                icon: Icon(Icons.close, color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 10),
            // Title
            Text(
              'Logout',
              style: GoogleFonts.inter(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: const Color(0xFFE53935), // Red color
              ),
            ),
            const SizedBox(height: 20),
            // Message
            Text(
              'Are you sure you want to logout?',
              style: GoogleFonts.inter(
                fontSize: 16,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            // Buttons
            Row(
              children: [
                // Cancel Button
                Expanded(
                  child: SecondaryButton(
                    text: 'Cancel',
                    onPressed: () => Get.back(),
                    borderRadius: 30,
                    borderWidth: 2,
                  ),
                ),
                const SizedBox(width: 15),
                // Logout Button
                Expanded(
                  child: PrimaryButton(
                    text: 'Logout',
                    onPressed: () {
                      Get.back();
                      Get.offAllNamed('/');
                    },
                    borderRadius: 30,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
