import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../controllers/auth_controller.dart';

class AccountDetailsScreen extends StatelessWidget {
  const AccountDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AuthController authController = Get.find<AuthController>();

    // Dummy data for display matching the design
    final username = "@mheek_frosh";
    final accountNumber = "2013711308";
    final email = "m.usidamen@gmail.com";
    final phone = "+234 9034 4487 00";
    final address = "No 112 dokaje street romi\nkaduna , Kaduna, Nigeria";

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Account Details', style: AppText.header2),
            const SizedBox(width: 8),
            Image.asset('assets/images/ng.png', width: 20, height: 20),
          ],
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            // Profile Image & Name
            Center(
              child: Column(
                children: [
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: AppColors.surfaceVariant,
                        child: Icon(
                          Icons.person,
                          size: 50,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppColors.cardBackground,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.edit,
                            color: AppColors.primary,
                            size: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Obx(
                    () => Text(
                      authController.userName.value.isNotEmpty
                          ? authController.userName.value
                          : "Usidamen, Ozeluah Michael",
                      style: AppText.header2,
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.emoji_events,
                        color: AppColors.textSecondary,
                        size: 16,
                      ),
                      const SizedBox(width: 4),
                      Text("T2", style: AppText.body2),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Copyable Fields
            _buildCopyableField("Your Username", username),
            const SizedBox(height: 16),
            _buildCopyableField("Your Account Number", accountNumber),
            const SizedBox(height: 16),

            // Limits
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Balance Limit", style: AppText.body2),
                      const SizedBox(height: 4),
                      Text(
                        "₦500,000",
                        style: AppText.button.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Transfer Limit", style: AppText.body2),
                      const SizedBox(height: 4),
                      Text(
                        "₦100,000",
                        style: AppText.button.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFD700), // Gold color
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Text(
                      "Upgrade",
                      style: GoogleFonts.inter(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Details List
            _buildDetailItem(username, "Username"),
            _buildDetailItem("Usidamen, Ozeluah Michael", "Account Name"),
            _buildDetailItem(address, "Address", isUnverified: true),
            _buildDetailItem(phone, "Phone Number"),
            _buildDetailItem(email, "Email Address"),
            _buildDetailItem("123456789", "NIN", isLast: true), // Placeholder
          ],
        ),
      ),
    );
  }

  Widget _buildCopyableField(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppText.body2),
              const SizedBox(height: 4),
              Text(value, style: AppText.header2.copyWith(fontSize: 18)),
            ],
          ),
          GestureDetector(
            onTap: () {
              Clipboard.setData(ClipboardData(text: value));
              Get.snackbar(
                "Copied",
                "$label copied to clipboard",
                snackPosition: SnackPosition.BOTTOM,
                backgroundColor: AppColors.primary,
                colorText: Colors.white,
                duration: const Duration(seconds: 1),
              );
            },
            child: Row(
              children: [
                Text(
                  "Copy",
                  style: TextStyle(
                    color: AppColors.green,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(Icons.copy, color: AppColors.green, size: 18),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem(
    String title,
    String subtitle, {
    bool isUnverified = false,
    bool isLast = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppText.body1.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(subtitle, style: AppText.body2),
              ],
            ),
          ),
          Row(
            children: [
              if (isUnverified)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  margin: const EdgeInsets.only(right: 8),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: Colors.red.withOpacity(0.5)),
                  ),
                  child: Text(
                    "Unverified",
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              Icon(
                Icons.arrow_forward_ios,
                color: AppColors.textSecondary,
                size: 16,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
