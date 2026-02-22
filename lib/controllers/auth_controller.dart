import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:local_auth/local_auth.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthController extends GetxController with WidgetsBindingObserver {
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final usernameController = TextEditingController();
  final dobController = TextEditingController();
  final otpValue = ''.obs;

  final userName = 'Michael Ozeluah'.obs;
  final userPhone = '9034448700'.obs;
  final userEmail = 'mheekfrosh@gmail.com'.obs;

  final isPasswordVisible = false.obs;
  final currentStep = 1.obs;
  final isSignupButtonEnabled = false.obs;
  final isLoginButtonEnabled = false.obs;
  final isOtpComplete = false.obs;

  final LocalAuthentication auth = LocalAuthentication();
  final canCheckBiometrics = false.obs;
  final isBiometricAuthenticated = false.obs;

  final selectedCountryFlag = '🇳🇬'.obs;
  final selectedCountryDialCode = '+234'.obs;

  final profileImage = Rxn<File>();
  final _picker = ImagePicker();

  final isLoading = false.obs;

  // OTP Resend countdown (seconds remaining)
  final resendCountdown = 0.obs;
  Timer? _countdownTimer;

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addObserver(this);
    nameController.addListener(_validateSignupFields);
    phoneController.addListener(_validateSignupFields);
    passwordController.addListener(_validateSignupFields);
  }

  void _validateSignupFields() {
    isSignupButtonEnabled.value =
        nameController.text.isNotEmpty && phoneController.text.isNotEmpty;
    isLoginButtonEnabled.value =
        phoneController.text.isNotEmpty && passwordController.text.isNotEmpty;
  }

  void validateOtpValue() {
    isOtpComplete.value = otpValue.value.length == 6;
  }

  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  void nextStep() {
    if (currentStep.value < 4) currentStep.value++;
  }

  void resetToSignup() {
    currentStep.value = 1;
    phoneController.clear();
    passwordController.clear();
    otpValue.value = '';
    isOtpComplete.value = false;
    _countdownTimer?.cancel();
    resendCountdown.value = 0;
  }

  void clearOtp() {
    otpValue.value = '';
    isOtpComplete.value = false;
  }

  String getFormattedPhone() {
    return '${selectedCountryDialCode.value} ${phoneController.text}';
  }

  @override
  void onClose() {
    WidgetsBinding.instance.removeObserver(this);
    _countdownTimer?.cancel();
    nameController.dispose();
    phoneController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
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
        Get.offAllNamed('/');
      }
    } catch (e) {
      debugPrint('Biometric Error: $e');
    }
  }

  /// Send OTP and show snackbar, start countdown
  Future<bool> sendOtp({bool isSignup = true}) async {
    if (phoneController.text.trim().isEmpty) return false;
    isLoading.value = true;
    try {
      final result = await AuthService.sendOtp(
        phone: phoneController.text.trim(),
        countryCode: selectedCountryDialCode.value,
      );
      if (result.success) {
        Get.snackbar(
          'OTP Sent',
          'Verification code sent to ${getFormattedPhone()}',
          snackPosition: SnackPosition.TOP,
          backgroundColor: const Color(0xFF2E63F6),
          colorText: Colors.white,
          margin: const EdgeInsets.all(16),
          borderRadius: 12,
          duration: const Duration(seconds: 3),
          icon: const Icon(Icons.check_circle, color: Colors.white, size: 24),
        );
        _startResendCountdown();
        return true;
      } else {
        Get.snackbar(
          'Error',
          result.error ?? 'Failed to send OTP',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return false;
      }
    } finally {
      isLoading.value = false;
    }
  }

  void _startResendCountdown() {
    _countdownTimer?.cancel();
    resendCountdown.value = 60;
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (resendCountdown.value > 0) {
        resendCountdown.value--;
      } else {
        t.cancel();
      }
    });
  }

  Future<bool> verifyOtp() async {
    if (otpValue.value.length != 6) return false;
    isLoading.value = true;
    try {
      final result = await AuthService.verifyOtp(
        phone: phoneController.text.trim(),
        code: otpValue.value,
        countryCode: selectedCountryDialCode.value,
        name: nameController.text.trim().isNotEmpty ? nameController.text.trim() : null,
      );
      if (result.success && result.user != null) {
        userName.value = result.user!.name;
        userPhone.value = result.user!.phone.replaceAll(RegExp(r'[^\d]'), '');
        userEmail.value = '${result.user!.phone}@rexipay.com';
        return true;
      } else {
        Get.snackbar(
          'Verification Failed',
          result.error ?? 'Invalid or expired code',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return false;
      }
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resendOtp() async {
    if (resendCountdown.value > 0) return;
    await sendOtp();
  }

  Future<void> completeSignup() async {
    final verified = await verifyOtp();
    if (verified) {
      Get.snackbar(
        'Success',
        'Account created successfully!',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      showSuccessAndNavigate();
    }
  }

  Future<void> login() async {
    final verified = await verifyOtp();
    if (verified) {
      Get.offAllNamed('/');
    }
  }

  void loginWithOtpFlow() async {
    if (phoneController.text.trim().isEmpty) {
      Get.snackbar('Error', 'Enter phone number', backgroundColor: Colors.red, colorText: Colors.white);
      return;
    }
    final sent = await sendOtp(isSignup: false);
    if (sent) {
      clearOtp();
      Get.toNamed('/otp-verification', arguments: {'isLogin': true});
    }
  }

  void showSuccessAndNavigate() {
    Get.offAllNamed('/account-success');
  }

  Future<void> pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        imageQuality: 80,
      );
      if (pickedFile != null) {
        profileImage.value = File(pickedFile.path);
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
    }
  }

  void showImageSourcePicker(BuildContext context) {
    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Select Image Source',
              style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildSourceOption(
                  icon: Icons.camera_alt_outlined,
                  label: 'Camera',
                  onTap: () {
                    Get.back();
                    pickImage(ImageSource.camera);
                  },
                ),
                _buildSourceOption(
                  icon: Icons.photo_library_outlined,
                  label: 'Gallery',
                  onTap: () {
                    Get.back();
                    pickImage(ImageSource.gallery);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSourceOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF2E63F6).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: const Color(0xFF2E63F6), size: 30),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
