import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import '../../utils/app_colors.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/numeric_keypad.dart';

class WelcomeBackScreen extends StatefulWidget {
  const WelcomeBackScreen({super.key});

  @override
  State<WelcomeBackScreen> createState() => _WelcomeBackScreenState();
}

class _WelcomeBackScreenState extends State<WelcomeBackScreen> {
  final AuthController controller = Get.find<AuthController>();
  final List<String> pin = [];

  void _onKeyTap(String value) {
    if (pin.length < 4) {
      setState(() {
        pin.add(value);
      });
      if (pin.length == 4) {
        _verifyPin();
      }
    }
  }

  void _onBackspace() {
    if (pin.isNotEmpty) {
      setState(() {
        pin.removeLast();
      });
    }
  }

  void _verifyPin() {
    // For demo purposes, we'll just navigate to home
    Get.offAllNamed('/home');
  }

  @override
  void initState() {
    super.initState();
    // Auto-trigger biometrics if available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.authenticateWithBiometrics();
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isIOS = GetPlatform.isIOS;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.primary.withOpacity(0.05), AppColors.background],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                const SizedBox(height: 40),
                // Face ID / User Avatar
                Center(
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Lottie.network(
                        'https://lottie.host/9326f534-1c6f-45b1-8406-8d76e469501a/Xn9B1A0x6U.json',
                        width: 100,
                        height: 100,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(
                            isIOS ? Icons.face : Icons.fingerprint,
                            color: AppColors.primary,
                            size: 60,
                          );
                        },
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Welcome back!',
                  style: GoogleFonts.outfit(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Obx(
                  () => Text(
                    '${controller.userName.value.split(' ').first}, please verify your identity',
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                const SizedBox(height: 48),
                // PIN Dots
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    4,
                    (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.symmetric(horizontal: 12),
                      width: index < pin.length ? 18 : 16,
                      height: index < pin.length ? 18 : 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: index < pin.length
                            ? AppColors.primary
                            : AppColors.surfaceVariant,
                        boxShadow: index < pin.length
                            ? [
                                BoxShadow(
                                  color: AppColors.primary.withOpacity(0.3),
                                  blurRadius: 8,
                                  spreadRadius: 2,
                                ),
                              ]
                            : [],
                      ),
                    ),
                  ),
                ),
                const Spacer(),
                // Numeric Keypad
                NumericKeypad(
                  onKeyTap: _onKeyTap,
                  onBackspace: _onBackspace,
                  leftButtonIcon: isIOS ? Icons.face : Icons.fingerprint,
                  onLeftButtonTap: () =>
                      controller.authenticateWithBiometrics(),
                ),
                const SizedBox(height: 30),
                TextButton(
                  onPressed: () => Get.offAllNamed('/login'),
                  child: Text(
                    'Switch account',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
