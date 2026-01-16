import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/custom_buttons.dart';
import '../../widgets/country_selection_dialog.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

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
                InkWell(
                  onTap: () => Get.back(),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.arrow_back_ios_new,
                        color: AppColors.textPrimary,
                        size: 20,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        "Back",
                        style: GoogleFonts.inter(
                          color: AppColors.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Title
                Text(
                  AppStrings.logInToRexipay,
                  style: AppText.header1.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 28,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  AppStrings.enterRegisteredMobile,
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
                    GestureDetector(
                      onTap: () {
                        Get.bottomSheet(
                          CountrySelectionDialog(
                            onCountrySelected: (country) {
                              controller.selectedCountryFlag.value =
                                  country.flag;
                              controller.selectedCountryDialCode.value =
                                  country.dialCode;
                            },
                          ),
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                        );
                      },
                      child: Container(
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
                            Text(
                              controller.selectedCountryFlag.value,
                              style: const TextStyle(fontSize: 20),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              controller.selectedCountryDialCode.value,
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
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
                          hintText: '90 3444 8700',
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
                const SizedBox(height: 40),
                const Spacer(),
                // Login Button
                AnimatedOpacity(
                  opacity: controller.isLoginButtonEnabled.value ? 1.0 : 0.5,
                  duration: const Duration(milliseconds: 200),
                  child: PrimaryButton(
                    text: AppStrings.login,
                    onPressed: controller.isLoginButtonEnabled.value
                        ? () {
                            // TODO: Implement login logic
                            Get.offAllNamed('/home');
                          }
                        : () {},
                    width: double.infinity,
                    backgroundColor: controller.isLoginButtonEnabled.value
                        ? const Color(0xFF2E63F6)
                        : Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 20),
                // Sign Up Link
                Center(
                  child: RichText(
                    text: TextSpan(
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        color: AppColors.textSecondary,
                      ),
                      children: [
                        TextSpan(text: AppStrings.dontHaveAccount),
                        WidgetSpan(
                          child: GestureDetector(
                            onTap: () => Get.toNamed('/signup'),
                            child: Text(
                              AppStrings.signUp,
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
