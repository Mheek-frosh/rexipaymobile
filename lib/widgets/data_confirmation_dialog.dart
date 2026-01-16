import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/airtime_controller.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import 'custom_buttons.dart';

class DataConfirmationDialog extends GetView<AirtimeController> {
  const DataConfirmationDialog({super.key});

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
            // Network Logo Placeholder
            Center(
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: controller.selectedNetwork.value == 'MTN'
                      ? const Color(0xFFFFD100)
                      : AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    controller.selectedNetwork.value,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: controller.selectedNetwork.value == 'MTN'
                          ? Colors.blue
                          : AppColors.primary,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Title
            Text(
              AppStrings.details,
              style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 30),
            // Info Rows
            _buildInfoRow(AppStrings.network, controller.selectedNetwork.value),
            const SizedBox(height: 15),
            _buildInfoRow(
              AppStrings.phoneNumberHint,
              controller.phoneNumberController.text,
            ),
            const SizedBox(height: 15),
            _buildInfoRow('Data Plan', controller.selectedDataPlan.value),
            const SizedBox(height: 15),
            _buildInfoRow(
              AppStrings.amount,
              '₦ ${controller.amountController.text}',
              isAmount: true,
            ),
            const SizedBox(height: 15),
            _buildInfoRow(AppStrings.transactionFee, '₦ 0.00'),
            const SizedBox(height: 15),
            _buildInfoRow(
              AppStrings.wallet,
              AppStrings.ngAccount,
              isWallet: true,
            ),
            const SizedBox(height: 40),
            // Buttons
            Row(
              children: [
                Expanded(
                  child: SecondaryButton(
                    text: AppStrings.edit,
                    onPressed: () => controller.editDetails(),
                    width: double.infinity,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: PrimaryButton(
                    text: AppStrings.confirm,
                    onPressed: () => controller.confirmTransaction(),
                    width: double.infinity,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(
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
