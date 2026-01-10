import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
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
                // OTP Input Boxes
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(6, (index) {
                    return _buildOtpBox(controller, index);
                  }),
                ),
                const SizedBox(height: 30),
                // Resend Link
                Center(
                  child: RichText(
                    text: TextSpan(
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                      children: [
                        TextSpan(text: AppStrings.didntGetCode),
                        WidgetSpan(
                          child: GestureDetector(
                            onTap: () {
                              // TODO: Implement resend logic
                            },
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
                // Verify Button
                AnimatedOpacity(
                  opacity: controller.isOtpComplete.value ? 1.0 : 0.5,
                  duration: const Duration(milliseconds: 200),
                  child: PrimaryButton(
                    text: AppStrings.verifyNumber,
                    onPressed: controller.isOtpComplete.value
                        ? () {
                            Get.bottomSheet(
                              const SuccessVerificationDialog(),
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                            );
                          }
                        : () {},
                    width: double.infinity,
                    backgroundColor: controller.isOtpComplete.value
                        ? const Color(0xFF2E63F6)
                        : Colors.grey[400],
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

  Widget _buildOtpBox(AuthController controller, int index) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: controller.otpControllers[index].text.isNotEmpty
                ? const Color(0xFF2E63F6)
                : Colors.grey[300]!,
            width: 2,
          ),
        ),
      ),
      child: TextField(
        controller: controller.otpControllers[index],
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        maxLength: 1,
        style: GoogleFonts.inter(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        decoration: const InputDecoration(
          counterText: '',
          border: InputBorder.none,
        ),
        onChanged: (value) {
          if (value.isNotEmpty && index < 5) {
            FocusScope.of(Get.context!).nextFocus();
          } else if (value.isEmpty && index > 0) {
            FocusScope.of(Get.context!).previousFocus();
          }
        },
      ),
    );
  }
}
