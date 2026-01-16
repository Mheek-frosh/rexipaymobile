import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
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
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 60),
              // User Avatar/Icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Icon(
                    Icons.person_outline,
                    color: AppColors.primary,
                    size: 40,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Welcome back, Philip!',
                style: AppText.header1.copyWith(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Enter your passcode to continue',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 40),
              // PIN Dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  4,
                  (index) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 10),
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: index < pin.length
                          ? AppColors.primary
                          : Colors.grey[300],
                      border: Border.all(
                        color: index < pin.length
                            ? AppColors.primary
                            : Colors.transparent,
                      ),
                    ),
                  ),
                ),
              ),
              const Spacer(),
              // Numeric Keypad
              NumericKeypad(
                onKeyTap: _onKeyTap,
                onBackspace: _onBackspace,
                leftButtonIcon: Icons.face,
                onLeftButtonTap: () => controller.authenticateWithBiometrics(),
              ),
              const SizedBox(height: 40),
              TextButton(
                onPressed: () => Get.offAllNamed('/login'),
                child: Text(
                  'Switch account',
                  style: GoogleFonts.inter(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
