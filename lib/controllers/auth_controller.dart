import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  // Text controllers
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final otpValue = ''.obs;

  // Observable states
  final isPasswordVisible = false.obs;
  final currentStep = 1.obs; // 1-4 for progress bar
  final isSignupButtonEnabled = false.obs;
  final isLoginButtonEnabled = false.obs;
  final isOtpComplete = false.obs;

  // Selected Country
  final selectedCountryFlag = '🇳🇬'.obs;
  final selectedCountryDialCode = '+234'.obs;

  @override
  void onInit() {
    super.onInit();
    // Listen to phone and password changes for signup/login
    phoneController.addListener(_validateSignupFields);
    passwordController.addListener(_validateSignupFields);

    passwordController.addListener(_validateSignupFields);
  }

  void _validateSignupFields() {
    isSignupButtonEnabled.value =
        phoneController.text.isNotEmpty && passwordController.text.isNotEmpty;
    isLoginButtonEnabled.value = isSignupButtonEnabled.value;
  }

  void validateOtpValue() {
    isOtpComplete.value = otpValue.value.length == 6;
  }

  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  void nextStep() {
    if (currentStep.value < 4) {
      currentStep.value++;
    }
  }

  void resetToSignup() {
    currentStep.value = 1;
    phoneController.clear();
    passwordController.clear();
  }

  void clearOtp() {
    otpValue.value = '';
    isOtpComplete.value = false;
  }

  String getFormattedPhone() {
    return '+234 ${phoneController.text}';
  }

  @override
  void onClose() {
    phoneController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
