import 'package:get/get.dart';
import 'package:flutter/material.dart';

class AuthController extends GetxController {
  // Text controllers
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final otpControllers = List.generate(6, (_) => TextEditingController());

  // Observable states
  final isPasswordVisible = false.obs;
  final currentStep = 1.obs; // 1-4 for progress bar
  final isSignupButtonEnabled = false.obs;
  final isLoginButtonEnabled = false.obs;
  final isOtpComplete = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Listen to phone and password changes for signup/login
    phoneController.addListener(_validateSignupFields);
    passwordController.addListener(_validateSignupFields);

    // Listen to OTP changes
    for (var controller in otpControllers) {
      controller.addListener(_validateOtp);
    }
  }

  void _validateSignupFields() {
    isSignupButtonEnabled.value =
        phoneController.text.isNotEmpty && passwordController.text.isNotEmpty;
    isLoginButtonEnabled.value = isSignupButtonEnabled.value;
  }

  void _validateOtp() {
    isOtpComplete.value = otpControllers.every((c) => c.text.isNotEmpty);
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
    for (var controller in otpControllers) {
      controller.clear();
    }
  }

  String getFormattedPhone() {
    return '+234 ${phoneController.text}';
  }

  @override
  void onClose() {
    phoneController.dispose();
    passwordController.dispose();
    for (var controller in otpControllers) {
      controller.dispose();
    }
    super.onClose();
  }
}
