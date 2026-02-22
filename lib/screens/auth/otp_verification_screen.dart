import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pinput/pinput.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/segmented_progress_bar.dart';
import '../../widgets/custom_buttons.dart';
import '../../widgets/success_verification_dialog.dart';

class OtpVerificationScreen extends StatelessWidget {
  const OtpVerificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<AuthController>();
    final isLogin = Get.arguments?['isLogin'] == true;

    final defaultPinTheme = PinTheme(
      width: 56,
      height: 56,
      textStyle: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[300]!, width: 2)),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyDecorationWith(
      border: const Border(
        bottom: BorderSide(color: Color(0xFF2E63F6), width: 2),
      ),
    );

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
                SegmentedProgressBar(
                  totalSteps: 4,
                  currentStep: controller.currentStep.value,
                ),
                const SizedBox(height: 40),
                Text(
                  AppStrings.confirmYourPhone,
                  style: AppText.header1.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 28,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  '${AppStrings.sentSixDigitsCode}${controller.getFormattedPhone()}',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 50),
                Center(
                  child: Pinput(
                    length: 6,
                    onChanged: (value) {
                      controller.otpValue.value = value;
                      controller.validateOtpValue();
                    },
                    defaultPinTheme: defaultPinTheme,
                    focusedPinTheme: focusedPinTheme,
                    separatorBuilder: (index) => const SizedBox(width: 8),
                    showCursor: true,
                  ),
                ),
                const SizedBox(height: 24),
                // Resend with countdown
                Center(
                  child: controller.resendCountdown.value > 0
                      ? Text(
                          'Resend code in ${controller.resendCountdown.value}s',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                          ),
                        )
                      : RichText(
                          text: TextSpan(
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: AppColors.textSecondary,
                            ),
                            children: [
                              const TextSpan(text: "Didn't get a code? "),
                              WidgetSpan(
                                child: GestureDetector(
                                  onTap: () => controller.resendOtp(),
                                  child: Text(
                                    AppStrings.resend,
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
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
                const Spacer(),
                Obx(
                  () => AnimatedOpacity(
                    opacity: controller.isOtpComplete.value ? 1.0 : 0.5,
                    duration: const Duration(milliseconds: 200),
                    child: PrimaryButton(
                      text: controller.isLoading.value
                          ? 'Verifying...'
                          : AppStrings.verifyNumber,
                      onPressed: controller.isLoading.value || !controller.isOtpComplete.value
                          ? null
                          : () async {
                              if (isLogin) {
                                await controller.login();
                              } else {
                                final verified = await controller.verifyOtp();
                                if (verified) {
                                  Get.bottomSheet(
                                    const SuccessVerificationDialog(),
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                  );
                                }
                              }
                            },
                      width: double.infinity,
                      backgroundColor: controller.isOtpComplete.value
                          ? const Color(0xFF2E63F6)
                          : Colors.grey[400],
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
