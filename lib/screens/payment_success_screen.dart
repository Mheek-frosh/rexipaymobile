import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
// import 'package:lottie/lottie.dart'; // Commented out as per user request
import '../utils/app_colors.dart';
import '../routes/app_routes.dart';

class PaymentSuccessScreen extends StatelessWidget {
  const PaymentSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Get arguments passed from confirmation dialog
    final args = Get.arguments as Map<String, dynamic>? ?? {};
    final recipientName = args['recipientName'] ?? 'Faith Adeyemi';
    final amount = args['amount'] ?? '₦1,000,000';

    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                const SizedBox(height: 40),
                // Success Icon (Static)
                Center(
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: const BoxDecoration(
                      color: Color(0xFFE8F5E9),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.check_circle,
                        color: Color(0xFF2EBD85),
                        size: 60,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Title
                Text(
                  'Payment Success!',
                  style: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your payment was successful.',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 40),
                // Details Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.cardBackground,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    children: [
                      _buildDetailRow('Amount', amount, isAmount: true),
                      const SizedBox(height: 12),
                      _buildDetailRow('Status', 'Success', isStatus: true),
                      const SizedBox(height: 20),
                      Divider(color: AppColors.black.withOpacity(0.05)),
                      const SizedBox(height: 20),
                      _buildDetailRow('Transaction ID', 'QWERTYUIOPASD'),
                      const SizedBox(height: 16),
                      _buildDetailRow('Sender', 'Faith Adeyemi'),
                      const SizedBox(height: 16),
                      _buildDetailRow('Receiver', recipientName),
                      const SizedBox(height: 16),
                      _buildDetailRow('Payment Method', 'Bank Transfer'),
                      const SizedBox(height: 16),
                      _buildDetailRow('Payment Time', 'May 27, 2025, 15:26:10'),
                    ],
                  ),
                ),
                const Spacer(),
                // Action Buttons
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton(
                    onPressed: () => Get.offNamed(Routes.TRANSFER),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(
                        color: Color(0xFF2E63F6),
                        width: 1.5,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Make another Payment',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF2E63F6),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () => Get.offAllNamed(Routes.HOME),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E63F6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'Back to Homepage',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    String label,
    String value, {
    bool isAmount = false,
    bool isStatus = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        if (isStatus)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFE8F5E9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'Success',
              style: TextStyle(
                color: Color(0xFF2EBD85),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          )
        else
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: isAmount ? 18 : 14,
              fontWeight: isAmount ? FontWeight.w700 : FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
      ],
    );
  }
}
