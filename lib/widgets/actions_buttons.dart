import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';

class ActionButtons extends StatelessWidget {
  const ActionButtons({super.key});

  @override
  Widget build(BuildContext context) {
    return Transform.translate(
      offset: const Offset(0, -30),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20),
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildActionButton(
              context,
              Icons.arrow_upward,
              'Send',
              Colors.orange,
            ),
            Container(
              height: 30,
              width: 1,
              color: AppColors.black.withOpacity(0.1),
            ),
            _buildActionButton(
              context,
              Icons.arrow_downward,
              'Receive',
              const Color(0xFF2E63F6),
            ),
            Container(
              height: 30,
              width: 1,
              color: AppColors.black.withOpacity(0.1),
            ),
            _buildActionButton(
              context,
              Icons.currency_exchange,
              'Convert',
              Colors.orange,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    IconData icon,
    String label,
    Color color,
  ) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        CircleAvatar(
          radius: 24,
          backgroundColor: isDark ? AppColors.surfaceVariant : color,
          child: Icon(icon, color: isDark ? color : Colors.white, size: 24),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
