import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:local_auth/local_auth.dart';

class AuthController extends GetxController with WidgetsBindingObserver {
  // Text controllers
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final usernameController = TextEditingController();
  final dobController = TextEditingController();
  final otpValue = ''.obs;

  // User details (Global state)
  final userName = 'Michael Ozeluah'.obs; // Default for demo
  final userPhone = '9034448700'.obs;
  final userEmail = 'mheekfrosh@gmail.com'.obs;

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

  // Profile Image
  final profileImage = Rxn<File>();
  final _picker = ImagePicker();

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
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
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
            const SizedBox(height: 20),
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

  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addObserver(this);
    // Listen to fields for validation
    nameController.addListener(_validateSignupFields);
    phoneController.addListener(_validateSignupFields);
    passwordController.addListener(_validateSignupFields);
  }

  void _validateSignupFields() {
    isSignupButtonEnabled.value =
        nameController.text.isNotEmpty &&
        phoneController.text.isNotEmpty &&
        passwordController.text.isNotEmpty;
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
    nameController.dispose();
    phoneController.dispose();
    emailController.dispose();
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

  void completeSignup() {
    // Update global state with entered data
    userName.value = nameController.text;
    userPhone.value = phoneController.text;
    // userEmail.value = emailController.text;

    // Reset controllers for next time (optional)
    // nameController.clear();
    // usernameController.clear();
    // dobController.clear();

    // In a real app, this would hit an API
    Get.offAllNamed('/home');
  }
}
