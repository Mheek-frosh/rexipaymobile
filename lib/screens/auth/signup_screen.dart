import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/segmented_progress_bar.dart';
import '../../widgets/custom_buttons.dart';
import '../../widgets/phone_verification_dialog.dart';

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AuthController());

    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                // Progress Bar
                SegmentedProgressBar(
                  totalSteps: 4,
                  currentStep: controller.currentStep.value,
                ),
                const SizedBox(height: 40),
                // Title
                Text(
                  AppStrings.createAccount,
                  style: AppText.header1.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 28,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  AppStrings.enterMobileVerify,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 40),
                // Phone Input
                Text(
                  AppStrings.phone,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    // Country Code
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 15,
                        vertical: 16,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[300]!),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Text('🇳🇬', style: const TextStyle(fontSize: 20)),
                          const SizedBox(width: 8),
                          Text(
                            '+234',
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Phone Number
                    Expanded(
                      child: TextField(
                        controller: controller.phoneController,
                        keyboardType: TextInputType.phone,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          color: AppColors.textPrimary,
                        ),
                        decoration: InputDecoration(
                          hintText: AppStrings.mobileNumber,
                          hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: Color(0xFF2E63F6),
                            ),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Password Input
                Text(
                  AppStrings.password,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controller.passwordController,
                  obscureText: !controller.isPasswordVisible.value,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: AppColors.textPrimary,
                  ),
                  decoration: InputDecoration(
                    hintText: '••••••••••',
                    hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                    prefixIcon: Icon(
                      Icons.lock_outline,
                      color: Colors.grey[400],
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        controller.isPasswordVisible.value
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: Colors.grey[400],
                      ),
                      onPressed: controller.togglePasswordVisibility,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey[300]!),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey[300]!),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFF2E63F6)),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
                  ),
                ),
                const Spacer(),
                // Sign Up Button
                AnimatedOpacity(
                  opacity: controller.isSignupButtonEnabled.value ? 1.0 : 0.5,
                  duration: const Duration(milliseconds: 200),
                  child: PrimaryButton(
                    text: AppStrings.signUp,
                    onPressed: controller.isSignupButtonEnabled.value
                        ? () {
                            Get.bottomSheet(
                              const PhoneVerificationDialog(),
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                            );
                          }
                        : () {},
                    width: double.infinity,
                    backgroundColor: controller.isSignupButtonEnabled.value
                        ? const Color(0xFF2E63F6)
                        : Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 20),
                // Login Link
                Center(
                  child: RichText(
                    text: TextSpan(
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        color: AppColors.textSecondary,
                      ),
                      children: [
                        TextSpan(text: AppStrings.alreadyHaveAccount),
                        WidgetSpan(
                          child: GestureDetector(
                            onTap: () => Get.toNamed('/login'),
                            child: Text(
                              AppStrings.login,
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                color: const Color(0xFF2E63F6),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
