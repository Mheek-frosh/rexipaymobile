import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
// import 'package:lottie/lottie.dart'; // Commented out as per user request
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../routes/app_routes.dart';
import '../widgets/custom_buttons.dart';

class PaymentSuccessScreen extends StatelessWidget {
  const PaymentSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Get arguments passed from confirmation dialog
    final args = Get.arguments as Map<String, dynamic>? ?? {};
    final recipientName = args['recipientName'] ?? 'Faith Adeyemi';
    final amount = args['amount'] ?? '0';
    final type = args['type'] ?? 'Transfer';
    final network = args['network'];

    return Scaffold(
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
                AppStrings.paymentSuccess,
                style: AppText.header2.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 24,
                ),
              ),
              const SizedBox(height: 8),
              // Subtitle
              Text(
                AppStrings.paymentSuccessful,
                style: GoogleFonts.inter(
                  color: AppColors.textSecondary,
                  fontSize: 14,
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
                    _buildDetailRow(
                      AppStrings.amount,
                      '₦ $amount',
                      isAmount: true,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow(
                      AppStrings.status,
                      AppStrings.success,
                      isStatus: true,
                    ),
                    const SizedBox(height: 20),
                    Divider(color: AppColors.black.withOpacity(0.05)),
                    const SizedBox(height: 20),
                    _buildDetailRow(AppStrings.transactionId, 'QWERTYUIOPASD'),
                    const SizedBox(height: 16),
                    _buildDetailRow(AppStrings.sender, 'Faith Adeyemi'),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      type == 'Airtime' || type == 'Data'
                          ? 'Recipient'
                          : AppStrings.receiver,
                      recipientName,
                    ),
                    if (network != null) ...[
                      const SizedBox(height: 16),
                      _buildDetailRow(AppStrings.network, network),
                    ],
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      AppStrings.paymentMethod,
                      type == 'Airtime' || type == 'Data'
                          ? 'Wallet'
                          : AppStrings.bankTransfer,
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      AppStrings.paymentTime,
                      'May 27, 2025, 15:26:10',
                    ),
                  ],
                ),
              ),
              const Spacer(),
              // Action Buttons
              const SizedBox(height: 12),
              PrimaryButton(
                text: AppStrings.backToHomepage,
                onPressed: () => Get.offAllNamed(Routes.HOME),
                width: double.infinity,
              ),
              const SizedBox(height: 20),
            ],
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
