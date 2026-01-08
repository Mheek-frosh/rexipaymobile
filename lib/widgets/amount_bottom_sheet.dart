import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../controllers/transfer_controller.dart';
import 'confirmation_dialog.dart';

class AmountBottomSheet extends StatelessWidget {
  final String name;
  final String email;

  const AmountBottomSheet({super.key, required this.name, required this.email});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<TransferController>();
    final keyboardHeight = MediaQuery.of(context).viewInsets.bottom;

    return AnimatedPadding(
      padding: EdgeInsets.only(bottom: keyboardHeight),
      duration: const Duration(milliseconds: 100),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
        ),
        child: SingleChildScrollView(
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
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 15),
                // Name & Email
                Text(
                  name,
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  email,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 25),
                // Currency Selector
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/ng.png',
                      width: 20,
                      errorBuilder: (_, __, ___) =>
                          const Icon(Icons.flag, size: 20),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'NG Naira',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF2E63F6),
                      ),
                    ),
                    const Icon(
                      Icons.keyboard_arrow_down,
                      size: 18,
                      color: Color(0xFF2E63F6),
                    ),
                  ],
                ),
                const SizedBox(height: 15),
                // Amount Input with Naira Symbol
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      '₦',
                      style: GoogleFonts.inter(
                        fontSize: 32,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Flexible(
                      child: IntrinsicWidth(
                        child: TextField(
                          controller: controller.amountController,
                          autofocus: true,
                          textAlign: TextAlign.center,
                          keyboardType: TextInputType.number,
                          style: GoogleFonts.inter(
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                          decoration: InputDecoration(
                            hintText: '0,000',
                            hintStyle: GoogleFonts.inter(
                              fontSize: 32,
                              fontWeight: FontWeight.w700,
                              color: Colors.grey,
                            ),
                            border: InputBorder.none,
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Container(width: 150, height: 2, color: Colors.grey[200]),
                const SizedBox(height: 30),
                // Next Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.back(); // Close amount sheet
                      Get.bottomSheet(
                        ConfirmationDialog(
                          recipientName: name,
                          accountName: controller.accountName.value,
                          amount:
                              '₦${controller.amountController.text.isEmpty ? "0" : controller.amountController.text}',
                          fee: '₦50',
                        ),
                        isScrollControlled: true,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E63F6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'Next',
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
}
