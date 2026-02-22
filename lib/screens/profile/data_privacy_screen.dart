import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';

class DataPrivacyScreen extends StatelessWidget {
  const DataPrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Text(AppStrings.dataPrivacy, style: AppText.header2),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              'Data Collection',
              'We collect only the information necessary to provide our services: '
              'account details, transaction history, and device information for security.',
            ),
            const SizedBox(height: 24),
            _buildSection(
              'Data Usage',
              'Your data is used to process transactions, improve our services, '
              'and comply with legal requirements. We never sell your personal information.',
            ),
            const SizedBox(height: 24),
            _buildSection(
              'Data Security',
              'We use industry-standard encryption to protect your data. '
              'Your account is secured with PIN and optional biometric authentication.',
            ),
            const SizedBox(height: 24),
            _buildSection(
              'Your Rights',
              'You have the right to access, correct, or delete your personal data. '
              'Contact support@rexipay.com for any data-related requests.',
            ),
            const SizedBox(height: 24),
            _buildSection(
              'Cookies & Tracking',
              'We use minimal cookies for app functionality. '
              'We do not track your activity for advertising purposes.',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: AppText.body2,
          ),
        ],
      ),
    );
  }
}
