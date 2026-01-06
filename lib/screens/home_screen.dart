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

  static const Color _blue = Color(0xFF2E63F6);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      extendBody: true, // ✅ allows floating effect

      body: Stack(
        children: [
          // ✅ MAIN CONTENT (pad bottom so it doesn't hide behind floating nav)
          Padding(
            padding: const EdgeInsets.only(bottom: 95),
            child: Column(
              children: [
                // 🔒 FIXED HEADER
                const HomeHeader(),

                // 🔒 FIXED ACTION BUTTONS (OVERLAPPING HEADER)
                Transform.translate(
                  offset: const Offset(0, -25),
                  child: const ActionButtons(),
                ),

                // 🔽 SCROLLABLE CONTENT ONLY
                Expanded(
                  child: Transform.translate(
                    offset: const Offset(0, -15),
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.only(top: 10),
                      child: Column(
                        children: const [
                          QuickActions(),
                          ReferralBanner(),
                          SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          Positioned(
            left: 16,
            right: 16,
            bottom: 14,
            child: SafeArea(
              top: false,
              child: Container(
                height: 70,
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white, // ✅ white background
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 18,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildNavItem(Icons.home_rounded, 'Home', 0),
                    _buildNavItem(Icons.credit_card_rounded, 'Cards', 1),
                    _buildNavItem(Icons.pie_chart_outline, 'Stats', 2),
                    _buildNavItem(Icons.person_outline_rounded, 'Profile', 3),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final bool isSelected = _currentIndex == index;

    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: () => setState(() => _currentIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 14 : 10,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          color: isSelected ? _blue : Colors.transparent, // ✅ blue pill only when selected
          borderRadius: BorderRadius.circular(22),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22,
              color: isSelected ? Colors.white : Colors.grey, // ✅ blue/white theme
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.inter(
                  color: Colors.white, // ✅ text inside the blue pill
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
