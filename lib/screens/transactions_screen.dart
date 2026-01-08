import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';

class TransactionsScreen extends StatelessWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 0,
          leading: IconButton(
            icon: Icon(
              Icons.chevron_left,
              color: AppColors.textPrimary,
              size: 32,
            ),
            onPressed: () => Get.back(),
          ),
          title: Text(
            'Transactions',
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
          actions: [
            IconButton(
              icon: Icon(
                Icons.file_download_outlined,
                color: AppColors.textPrimary,
              ),
              onPressed: () {},
            ),
          ],
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            // Filter Button & Month Label
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Filter',
                          style: GoogleFonts.inter(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          Icons.keyboard_arrow_down,
                          size: 18,
                          color: AppColors.textPrimary,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'This Month',
                    style: GoogleFonts.inter(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Transactions List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildTransactionItem(
                    context,
                    name: 'Isaac Folarin',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦50,000',
                    isSuccess: true,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Grace Michelle',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: false,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Steve Peters',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: true,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Grace Michelle',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: true,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Mark Judiths',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: false,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Isaac Folarin',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: true,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  _buildTransactionItem(
                    context,
                    name: 'Isaac Folarin',
                    date: 'March 24, 2025 | 11:36 AM',
                    amount: '₦3000',
                    isSuccess: true,
                    avatar: 'assets/user_avatar_2.png',
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem(
    BuildContext context, {
    required String name,
    required String date,
    required String amount,
    required bool isSuccess,
    required String avatar,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 25,
            backgroundImage: AssetImage(avatar),
            onBackgroundImageError: (_, __) {},
            backgroundColor: Colors.grey[200],
            child: const Icon(Icons.person, color: Colors.grey),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: GoogleFonts.inter(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '+$amount',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                  color: isSuccess
                      ? const Color(0xFF2EBD85)
                      : const Color(0xFFF7931A),
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? (isSuccess
                                ? const Color(0xFF2EBD85)
                                : const Color(0xFFF7931A))
                            .withOpacity(0.1)
                      : (isSuccess
                            ? const Color(0xFFE8F5E9)
                            : const Color(0xFFFFF3E0)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isSuccess ? 'Success' : 'Pending',
                  style: GoogleFonts.inter(
                    color: isSuccess
                        ? const Color(0xFF2EBD85)
                        : const Color(0xFFF7931A),
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
