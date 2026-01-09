import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../routes/app_routes.dart';
import 'custom_buttons.dart';

class ConfirmationDialog extends StatelessWidget {
  final String recipientName;
  final String accountName;
  final String amount;
  final String fee;

  const ConfirmationDialog({
    super.key,
    required this.recipientName,
    required this.accountName,
    required this.amount,
    this.fee = '₦50',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Pull Handle
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 10),
            // Close Button
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Get.back(),
                icon: Icon(Icons.close, color: AppColors.textSecondary),
              ),
            ),
            // Profile Photo
            Center(
              child: CircleAvatar(
                radius: 40,
                backgroundColor: AppColors.primary.withOpacity(0.1),
                child: Icon(Icons.person, size: 40, color: AppColors.primary),
              ),
            ),
            const SizedBox(height: 20),
            // Details Section
            _buildDetailRow('Recipients', recipientName),
            const SizedBox(height: 16),
            _buildDetailRow('Account Name', accountName),
            const SizedBox(height: 16),
            _buildDetailRow('Amount', amount, isAmount: true),
            const SizedBox(height: 16),
            _buildDetailRow('Transaction Fee', fee),
            const SizedBox(height: 16),
            _buildDetailRow('Wallet', 'NG account', isWallet: true),
            const SizedBox(height: 30),
            // Send Button
            PrimaryButton(
              text: 'Send',
              onPressed: () {
                Get.back();
                Get.toNamed(
                  Routes.PAYMENT_SUCCESS,
                  arguments: {
                    'recipientName': recipientName,
                    'accountName': accountName,
                    'amount': amount,
                  },
                );
              },
              width: double.infinity,
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    String label,
    String value, {
    bool isAmount = false,
    bool isWallet = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        if (isWallet)
          Row(
            children: [
              Image.asset(
                'assets/images/ng.png',
                width: 16,
                errorBuilder: (_, __, ___) => const Icon(Icons.flag, size: 16),
              ),
              const SizedBox(width: 6),
              Text(
                value,
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2E63F6),
                ),
              ),
            ],
          )
        else
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: isAmount ? FontWeight.w700 : FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
      ],
    );
  }
}
