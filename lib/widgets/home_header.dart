import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_strings.dart';
import '../controllers/main_controller.dart';
import '../routes/app_routes.dart';
import 'custom_buttons.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final MainController controller = Get.find<MainController>();

    return Container(
      padding: const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 80),
      decoration: const BoxDecoration(
        color: Color(0xFF2E63F6), // Main Blue
      ),
      child: Column(
        children: [
          // TOP ROW
          Stack(
            alignment: Alignment.center,
            children: [
              // TOGGLE (Centered)
              Obx(
                () => Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildToggleOption(
                        context,
                        AppStrings.bank,
                        controller.homeView == 0,
                        () => controller.switchHomeView(0),
                      ),
                      _buildToggleOption(
                        context,
                        AppStrings.crypto,
                        controller.homeView == 1,
                        () => controller.switchHomeView(1),
                      ),
                    ],
                  ),
                ),
              ),
              // ICONS (Spread out)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Icon(Icons.person, color: Colors.white, size: 28),
                  Row(
                    children: [
                      const Icon(
                        Icons.headset_mic_outlined,
                        color: Colors.white,
                        size: 28,
                      ),
                      const SizedBox(width: 15),
                      GestureDetector(
                        onTap: () => Get.toNamed(Routes.NOTIFICATIONS),
                        child: const Icon(
                          Icons.notifications_outlined,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 30),

          // NG FLAG + TEXT
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/ng.png',
                width: 20,
                height: 20,
                fit: BoxFit.contain,
              ),
              const SizedBox(width: 8),
              Text(
                AppStrings.ngNaira,
                style: GoogleFonts.inter(color: Colors.white70, fontSize: 14),
              ),
              const Icon(
                Icons.keyboard_arrow_down,
                color: Colors.white70,
                size: 16,
              ),
            ],
          ),

          const SizedBox(height: 10),

          // BALANCE
          Text(
            '₦250,000',
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),

          Text(
            AppStrings.availableBalance,
            style: GoogleFonts.inter(color: Colors.white70, fontSize: 14),
          ),

          const SizedBox(height: 20),

          // ADD MONEY BUTTON
          IconOutlinedButton(
            text: 'Add Money',
            icon: Icons.account_balance_wallet_outlined,
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildToggleOption(
    BuildContext context,
    String text,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2E63F6) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            color: Colors.white,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}
