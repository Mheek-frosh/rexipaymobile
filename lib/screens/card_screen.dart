import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:rexipaymobile/utils/app_colors.dart';
import 'package:rexipaymobile/utils/app_text.dart';
import 'package:rexipaymobile/utils/app_strings.dart';
import 'package:rexipaymobile/controllers/card_controller.dart';
import 'package:rexipaymobile/widgets/pin_entry_dialog.dart';

class CardScreen extends StatelessWidget {
  const CardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final CardController controller = Get.put(CardController());

    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: AppColors.textPrimary),
            onPressed: () => Get.back(),
          ),
          title: Text(
            AppStrings.virtualCard,
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                // Tab Switch
                Obx(
                  () => Container(
                    decoration: BoxDecoration(
                      color: AppColors.white, // Surface color
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => controller.changeTab(0),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: controller.selectedTab == 0
                                    ? AppColors.primary
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(25),
                                border: controller.selectedTab == 0
                                    ? null
                                    : Border.all(color: AppColors.primary),
                              ),
                              child: Center(
                                child: Text(
                                  'Details',
                                  style: GoogleFonts.inter(
                                    color: controller.selectedTab == 0
                                        ? Colors.white
                                        : AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 15),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => controller.changeTab(1),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: controller.selectedTab == 1
                                    ? AppColors.primary
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(25),
                                border: controller.selectedTab == 1
                                    ? null
                                    : Border.all(color: AppColors.primary),
                              ),
                              child: Center(
                                child: Text(
                                  'Transactions',
                                  style: GoogleFonts.inter(
                                    color: controller.selectedTab == 1
                                        ? Colors.white
                                        : AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // Balance
                Text(
                  'Bal: ₦250,000',
                  style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
                ),

                const SizedBox(height: 20),

                // Virtual Card (Tappable)
                GestureDetector(
                  onTap: () {
                    Get.bottomSheet(
                      const PinEntryDialog(),
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                    );
                  },
                  child: Container(
                    height: 200,
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2E63F6), Color(0xFF5B86FC)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Debit.',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              'COOLPAY.NG',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        // Chip and Logo placeholder
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Simple Chip representation
                            Container(
                              width: 40,
                              height: 30,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE0E0E0),
                                borderRadius: BorderRadius.circular(5),
                              ),
                              child: const Icon(
                                Icons.grid_3x3,
                                size: 20,
                                color: Colors.grey,
                              ), // Placeholder for chip lines
                            ),
                            // Mastercard logo placeholder (using circles)
                            SizedBox(
                              height: 40,
                              child: Stack(
                                children: [
                                  Container(
                                    width: 30,
                                    height: 30,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.white, // red
                                    ),
                                  ),
                                  Positioned(
                                    left: 15,
                                    child: Container(
                                      width: 30,
                                      height: 30,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Colors.white.withOpacity(
                                          0.7,
                                        ), // orange
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const Spacer(),
                        Text(
                          '5355  ****  ****  ****',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w500,
                            letterSpacing: 2,
                          ),
                        ),
                        const SizedBox(height: 15),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "VALID\nTHRU",
                                  style: GoogleFonts.inter(
                                    color: Colors.white70,
                                    fontSize: 8,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              "**/**",
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 14,
                              ),
                            ),
                            const Spacer(),
                          ],
                        ),
                        const SizedBox(height: 5),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'USIDAMEN OZELUAH MIKE',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              'Verve',
                              style: GoogleFonts.inter(
                                color: Colors.red, // Verve color roughly
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 15),
                Center(
                  child: Text(
                    AppStrings.tapToSeeCardDetails,
                    style: GoogleFonts.inter(
                      color: Colors.white70,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // Limit Settings
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.white, // Card background
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.1),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                    border: Border.all(color: AppColors.grey.withOpacity(0.2)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Limit Settings',
                            style: AppText.header2.copyWith(fontSize: 16),
                          ),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 10,
                              ),
                            ),
                            child: Text(
                              'Edit',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Divider(color: AppColors.grey.withOpacity(0.2)),
                      const SizedBox(height: 15),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Limit Per Transaction', style: AppText.body2),
                          Text(
                            '₦10M',
                            style: AppText.body1.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 15),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Cash Withdrawal Limit', style: AppText.body2),
                          Text(
                            '₦5M',
                            style: AppText.body1.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 50),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
