import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/actions_buttons.dart';
import '../widgets/home_header.dart';
import '../widgets/quick_actions.dart';
import '../widgets/referral_banner.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              alignment: Alignment.bottomCenter,
              clipBehavior: Clip.none,
              children: [const HomeHeader()],
            ),
            const SizedBox(
              height: 20,
            ), // Spacing before ActionButtons
            const ActionButtons(),
            const SizedBox(
              height: 40,
            ), // Spacing after ActionButtons
            const QuickActions(),
            const ReferralBanner(),
            const SizedBox(height: 20),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 10,
            ),
          ],
        ),
        child: SafeArea(
          // Ensure it respects bottom safe area on devices like iPhone
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(Icons.home, 'Home', 0),
              _buildNavItem(Icons.credit_card, '', 1),
              _buildNavItem(Icons.pie_chart_outline, '', 2),
              _buildNavItem(Icons.person_outline, '', 3),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    bool isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: isSelected
                ? BoxDecoration(
              color: const Color(0xFF2E63F6),
              borderRadius: BorderRadius.circular(12),
            )
                : null,
            child: Icon(
              icon,
              color: isSelected
                  ? Colors.white
                  : Colors.grey, // Active: White, Inactive: Grey
              size: 24,
            ),
          ),
          if (isSelected && label.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                label,
                style: GoogleFonts.inter(
                  color: const Color(0xFF2E63F6),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
