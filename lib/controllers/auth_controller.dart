import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:local_auth/local_auth.dart';

class AuthController extends GetxController with WidgetsBindingObserver {
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

  // Biometrics
  final LocalAuthentication auth = LocalAuthentication();
  final canCheckBiometrics = false.obs;
  final isBiometricAuthenticated = false.obs;

  // Selected Country
  final selectedCountryFlag = '🇳🇬'.obs;
  final selectedCountryDialCode = '+234'.obs;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addObserver(this);
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
    WidgetsBinding.instance.removeObserver(this);
    phoneController.dispose();
    passwordController.dispose();
    super.onClose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // Only show welcome back if user is logged in (for demo, if we are not on auth screens)
      final currentRoute = Get.currentRoute;
      if (currentRoute != '/signup' &&
          currentRoute != '/login' &&
          currentRoute != '/welcome-back') {
        Get.toNamed('/welcome-back');
      }
    }
  }

  Future<void> checkBiometrics() async {
    try {
      canCheckBiometrics.value = await auth.canCheckBiometrics;
    } catch (e) {
      canCheckBiometrics.value = false;
    }
  }

  Future<void> authenticateWithBiometrics() async {
    try {
      final bool authenticated = await auth.authenticate(
        localizedReason: 'Please authenticate to continue',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
      if (authenticated) {
        isBiometricAuthenticated.value = true;
        Get.offAllNamed('/home');
      }
    } catch (e) {
      debugPrint('Biometric Error: $e');
    }
  }
}
