import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_strings.dart';
import 'custom_buttons.dart';

class SuccessVerificationDialog extends StatelessWidget {
  const SuccessVerificationDialog({super.key});

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
            // Success Icon with decorative elements
            Stack(
              alignment: Alignment.center,
              children: [
                // Decorative stars/sparkles
                Positioned(
                  top: 0,
                  left: 30,
                  child: Icon(
                    Icons.add,
                    color: const Color(0xFF2EBD85).withOpacity(0.3),
                    size: 16,
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 20,
                  child: Icon(
                    Icons.add,
                    color: const Color(0xFF2EBD85).withOpacity(0.5),
                    size: 12,
                  ),
                ),
                Positioned(
                  bottom: 5,
                  left: 15,
                  child: Icon(
                    Icons.add,
                    color: const Color(0xFF2EBD85).withOpacity(0.4),
                    size: 14,
                  ),
                ),
                Positioned(
                  bottom: 15,
                  right: 25,
                  child: Icon(
                    Icons.add,
                    color: const Color(0xFF2EBD85).withOpacity(0.3),
                    size: 16,
                  ),
                ),
                // Main checkmark circle
                Container(
                  width: 100,
                  height: 100,
                  decoration: const BoxDecoration(
                    color: Color(0xFF2EBD85),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check, color: Colors.white, size: 60),
                ),
              ],
            ),
            const SizedBox(height: 30),
            // Title
            Text(
              AppStrings.congratulations,
              style: GoogleFonts.inter(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            // Subtitle
            Text(
              AppStrings.phoneVerified,
              style: GoogleFonts.inter(
                fontSize: 16,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 30),
            // Continue Button
            PrimaryButton(
              text: AppStrings.continueText,
              onPressed: () {
                Get.back();
                // Navigate to next step
                Get.offAllNamed('/home');
              },
              width: double.infinity,
              borderRadius: 12,
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
