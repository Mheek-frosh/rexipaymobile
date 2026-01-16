import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../routes/app_routes.dart';
import '../controllers/airtime_controller.dart';
import 'custom_buttons.dart';

class AirtimeDataSuccessDialog extends GetView<AirtimeController> {
  const AirtimeDataSuccessDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final isAirtime = controller.selectedTab.value == 0;

    return Container(
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Center(
            child: Container(
              width: 50,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 30),
          // Success Icon
          Container(
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
          const SizedBox(height: 24),
          Text(
            AppStrings.done,
            style: AppText.header2.copyWith(
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isAirtime
                ? 'Airtime Purchase Successful'
                : 'Data Subscription Successful',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              color: AppColors.textSecondary,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 30),
          // Short details card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.cardBackground,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                _buildRow(AppStrings.network, controller.selectedNetwork.value),
                const SizedBox(height: 12),
                _buildRow(
                  AppStrings.phoneNumberHint,
                  controller.phoneNumberController.text,
                ),
                const SizedBox(height: 12),
                if (!isAirtime) ...[
                  _buildRow('Plan', controller.selectedDataPlan.value),
                  const SizedBox(height: 12),
                ],
                _buildRow(
                  AppStrings.amount,
                  '₦ ${controller.amountController.text}',
                  isBold: true,
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          PrimaryButton(
            text: AppStrings.finish,
            onPressed: () => Get.offAllNamed(Routes.HOME),
            width: double.infinity,
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isBold = false}) {
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
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: isBold ? FontWeight.w700 : FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
