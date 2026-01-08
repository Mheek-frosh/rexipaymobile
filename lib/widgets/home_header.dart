import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 80),
      decoration: const BoxDecoration(
        color: Color(0xFF2E63F6), // Main Blue
      ),
      child: Column(
        children: [
          // TOP ROW
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Icon(Icons.person, color: Colors.white, size: 28),

              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    _buildToggleOption(context, 'Bank', true),
                    _buildToggleOption(context, 'Crypto', false),
                  ],
                ),
              ),

              Row(
                children: const [
                  Icon(
                    Icons.headset_mic_outlined,
                    color: Colors.white,
                    size: 28,
                  ),
                  SizedBox(width: 15),
                  Icon(
                    Icons.notifications_outlined,
                    color: Colors.white,
                    size: 28,
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
                'NG Naria',
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
            'Available Balance',
            style: GoogleFonts.inter(color: Colors.white70, fontSize: 14),
          ),

          const SizedBox(height: 20),

          // ADD MONEY BUTTON
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(
              Icons.account_balance_wallet_outlined,
              color: Colors.white,
            ),
            label: Text(
              'Add Money',
              style: GoogleFonts.inter(color: Colors.white),
            ),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.white),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleOption(
    BuildContext context,
    String text,
    bool isSelected,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF2E63F6) : Colors.transparent,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(
          color: Colors.white,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          fontSize: 12,
        ),
      ),
    );
  }
}
