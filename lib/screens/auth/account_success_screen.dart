import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../widgets/segmented_progress_bar.dart';
import '../../widgets/custom_buttons.dart';

class AccountSuccessScreen extends StatelessWidget {
  const AccountSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // final controller = Get.find<AuthController>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 20),
              // Progress Bar
              const SegmentedProgressBar(
                totalSteps: 4,
                currentStep: 4, // Final step
              ),
              const SizedBox(height: 80),

              // Illustration
              Image.asset(
                'assets/images/success_illustration.png',
                width: 250,
                height: 250,
                fit: BoxFit.contain,
              ),

              const SizedBox(height: 40),

              // Title
              Text(
                'Congratulations!\nWelcome to Rexipay',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),

              // Description
              Text(
                'we are happy to have you. its time\nto send, recieve and track your\nexpense.',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  color: Colors.grey[500],
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),

              const Spacer(),

              // Continue Button
              PrimaryButton(
                text: 'Continue',
                onPressed: () {
                  Get.offAllNamed('/home');
                },
                width: double.infinity,
                backgroundColor: const Color(0xFF2E63F6),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
