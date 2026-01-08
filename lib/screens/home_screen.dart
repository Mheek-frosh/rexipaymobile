import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/main_controller.dart';
import 'crypto_view.dart';
import '../widgets/actions_buttons.dart';
import '../widgets/home_header.dart';
import '../widgets/quick_actions.dart';
import '../widgets/referral_banner.dart';
import '../utils/app_colors.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final MainController controller = Get.find<MainController>();

    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        body: SingleChildScrollView(
          child: Column(
            children: [
              // 🔒 HEADER (Common for both)
              const HomeHeader(),

              // 🔒 DYNAMIC VIEW SWITCHING
              controller.homeView == 0 ? _buildBankView() : const CryptoView(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBankView() {
    return Column(
      children: [
        // 🔒 ACTION BUTTONS (OVERLAP HEADER)
        const ActionButtons(),

        // 🔹 CONTENT
        QuickActions(),
        const ReferralBanner(),
        const SizedBox(height: 100), // space for floating nav
      ],
    );
  }
}
