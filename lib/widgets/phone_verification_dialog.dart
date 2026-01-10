import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_strings.dart';
import '../controllers/auth_controller.dart';
import 'custom_buttons.dart';

class PhoneVerificationDialog extends StatelessWidget {
  const PhoneVerificationDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<AuthController>();

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
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ),
            const SizedBox(height: 10),
            // Email/Message Icon Illustration
            Container(
              width: 120,
              height: 120,
              decoration: const BoxDecoration(
                color: Color(0xFFE8F0FE),
                shape: BoxShape.circle,
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Decorative dots
                  Positioned(
                    top: 20,
                    left: 20,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFF2E63F6),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 25,
                    left: 15,
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E63F6).withOpacity(0.5),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 30,
                    right: 20,
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E63F6).withOpacity(0.3),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 20,
                    right: 25,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E63F6).withOpacity(0.4),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  // Email icon
                  const Icon(
                    Icons.mail_outline,
                    size: 50,
                    color: Color(0xFF2E63F6),
                  ),
                  // Checkmark
                  Positioned(
                    right: 25,
                    bottom: 35,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Color(0xFF2E63F6),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            // Title
            Text(
              AppStrings.sentCodeToNumber,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 15),
            // Phone Number
            Text(
              '${AppStrings.isThisCorrect}${controller.getFormattedPhone()}',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 30),
            // Yes Button
            PrimaryButton(
              text: AppStrings.yes,
              onPressed: () {
                Get.back();
                controller.nextStep(); // Move to step 2
                Get.toNamed('/otp-verification');
              },
              width: double.infinity,
              borderRadius: 12,
            ),
            const SizedBox(height: 12),
            // Change Button
            SecondaryButton(
              text: AppStrings.change,
              onPressed: () {
                Get.back();
                controller.resetToSignup();
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
