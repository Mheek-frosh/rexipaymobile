import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../controllers/transfer_controller.dart';
import '../widgets/amount_bottom_sheet.dart';

class TransferScreen extends StatelessWidget {
  const TransferScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<TransferController>();

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
            AppStrings.transferToBank,
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 10),
              _buildRecipientCard(context, controller),
              const SizedBox(height: 20),
              _buildRecentSection(controller),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecipientCard(
    BuildContext context,
    TransferController controller,
  ) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.recipientAccount,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: controller.accountNumberController,
            decoration: InputDecoration(
              hintText: AppStrings.enterAccountNumber,
              hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF2E63F6)),
              ),
            ),
            keyboardType: TextInputType.number,
            style: GoogleFonts.inter(color: AppColors.textPrimary),
          ),
          const SizedBox(height: 24),
          Obx(
            () => DropdownButtonFormField<String>(
              value: controller.selectedBank.value.isEmpty
                  ? null
                  : controller.selectedBank.value,
              decoration: InputDecoration(
                hintText: AppStrings.selectBank,
                hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
              ),
              items: const [
                DropdownMenuItem(
                  value: 'Access Bank',
                  child: Text('Access Bank'),
                ),
                DropdownMenuItem(value: 'GTBank', child: Text('GTBank')),
                DropdownMenuItem(
                  value: 'Zenith Bank',
                  child: Text('Zenith Bank'),
                ),
              ],
              onChanged: (val) {
                controller.selectedBank.value = val ?? '';
                controller.accountName.value = '$val PLC';
              },
              icon: const Icon(Icons.keyboard_arrow_down),
              dropdownColor: AppColors.cardBackground,
              style: GoogleFonts.inter(color: AppColors.textPrimary),
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: () {
                Get.bottomSheet(
                  AmountBottomSheet(
                    name: controller.recipientName.value,
                    email: controller.recipientEmail.value,
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
                AppStrings.next,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSection(TransferController controller) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: AppColors.background.withOpacity(0.5),
              borderRadius: BorderRadius.circular(25),
            ),
            child: TextField(
              decoration: InputDecoration(
                hintText: AppStrings.searchRecipientName,
                hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                border: InputBorder.none,
                suffixIcon: Icon(Icons.search, color: Colors.grey[400]),
              ),
            ),
          ),
          const SizedBox(height: 30),
          Text(
            AppStrings.mostRecent,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 20),
          _buildRecentItem(
            controller,
            'Isaac Folarin',
            'isaac.folarin@gmail.com',
            '-₦5000',
          ),
          _buildRecentItem(
            controller,
            'Grace Michelle',
            'grace.mich@gmail.com',
            '-₦2500',
          ),
          _buildRecentItem(
            controller,
            'Steve Peters',
            'steve.peters@gmail.com',
            '-₦15,000',
          ),
          _buildRecentItem(
            controller,
            'Martha Kenneth',
            'martha.ken@gmail.com',
            '-₦8500',
          ),
          _buildRecentItem(
            controller,
            'Grace Michelle',
            'grace.mich@gmail.com',
            '-₦2500',
          ),
          const SizedBox(height: 50),
        ],
      ),
    );
  }

  Widget _buildRecentItem(
    TransferController controller,
    String name,
    String email,
    String amount,
  ) {
    return Column(
      children: [
        InkWell(
          onTap: () {
            controller.setRecipient(name, email);
            Get.bottomSheet(
              AmountBottomSheet(name: name, email: email),
              isScrollControlled: true,
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Icon(Icons.person, color: AppColors.primary),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        email,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  amount,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFFE53935),
                  ),
                ),
              ],
            ),
          ),
        ),
        Divider(height: 1, color: AppColors.black.withOpacity(0.05)),
      ],
    );
  }
}
