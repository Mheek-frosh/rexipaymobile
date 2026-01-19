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
      backgroundColor:
          Colors.transparent, // Transparent to show underlying screen
      body: Row(
        children: [
          Container(
            width: Get.width * 0.85, // "Not fully" - 85% width
            height: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.background,
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  offset: const Offset(5, 0),
                ),
              ],
            ),
            child: Column(
              children: [
                AppBar(
                  backgroundColor: Colors.transparent, // Match container
                  elevation: 0,
                  leading: IconButton(
                    icon: const Icon(
                      Icons.arrow_back_ios_new,
                      color: Colors.white,
                    ),
                    onPressed: () => Get.back(),
                  ),
                  title: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Account Details',
                        style: AppText.header2.copyWith(color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      Image.asset(
                        'assets/images/ng.png', // Assuming this asset exists as seen in HomeHeader
                        width: 20,
                        height: 20,
                      ),
                    ],
                  ),
                  centerTitle: true,
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 20,
                    ),
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
                                    backgroundImage: const AssetImage(
                                      'assets/images/avatar.png',
                                    ), // Placeholder or actual image
                                    // fallback to icon if image fails
                                    onForegroundImageError: (_, __) {},
                                    child: const Icon(
                                      Icons.person,
                                      size: 40,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  Positioned(
                                    bottom: 0,
                                    right: 0,
                                    child: Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: const BoxDecoration(
                                        color: Colors.white,
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
                                  style: AppText.header2.copyWith(
                                    color: Colors.white,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.emoji_events,
                                    color: Color(0xFFC0C0C0),
                                    size: 16,
                                  ), // Silver/Metal color
                                  const SizedBox(width: 4),
                                  Text(
                                    "T2",
                                    style: AppText.body2.copyWith(
                                      color: Colors.white70,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 30),

                        // Copyable Fields
                        _buildCopyableField("Your Username", username),
                        const SizedBox(height: 16),
                        _buildCopyableField(
                          "Your Account Number",
                          accountNumber,
                        ),
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
                                      color: Colors.white,
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
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(
                                    0xFFFFD700,
                                  ), // Gold color
                                  foregroundColor: Colors.black,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  minimumSize: Size.zero,
                                  tapTargetSize:
                                      MaterialTapTargetSize.shrinkWrap,
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
                        _buildDetailItem(
                          "Usidamen, Ozeluah Michael",
                          "Account Name",
                        ), // Hardcoded for design match
                        _buildDetailItem(
                          address,
                          "Address",
                          isUnverified: true,
                        ),
                        _buildDetailItem(phone, "Phone Number"),
                        _buildDetailItem(email, "Email Address"),
                        _buildDetailItem(
                          "123456789",
                          "NIN",
                          isLast: true,
                        ), // Placeholder
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => Get.back(),
              child: Container(color: Colors.transparent),
            ),
          ),
        ],
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
              Text(
                value,
                style: AppText.header2.copyWith(
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
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
                  style: AppText.body1.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
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
              Icon(Icons.arrow_forward_ios, color: Colors.white30, size: 16),
            ],
          ),
        ],
      ),
    );
  }
}
