import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../widgets/actions_buttons.dart';
import '../widgets/home_header.dart';
import '../widgets/quick_actions.dart';
import '../widgets/referral_banner.dart';
import '../utils/app_colors.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        body: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 100), // space for floating nav
          child: Column(
            children: [
              // 🔒 HEADER
              const HomeHeader(),

              // 🔒 ACTION BUTTONS (OVERLAP HEADER)
              Transform.translate(
                offset: const Offset(0, -25),
                child: const ActionButtons(),
              ),

              // 🔹 CONTENT STARTS IMMEDIATELY
              Transform.translate(
                offset: const Offset(0, -30),
                child: Column(children: [QuickActions(), ReferralBanner()]),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
