import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/airtime_controller.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../widgets/custom_buttons.dart';
import '../widgets/country_selection_dialog.dart';

class AirtimeScreen extends GetView<AirtimeController> {
  const AirtimeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Text(
          AppStrings.airtimeAndData,
          style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            _buildTabToggle(),
            const SizedBox(height: 30),
            _buildNetworkSection(),
            const SizedBox(height: 24),
            Obx(
              () => controller.selectedTab.value == 0
                  ? _buildAirtimeInput()
                  : _buildDataInput(),
            ),
            const SizedBox(height: 40),
            Obx(
              () => PrimaryButton(
                text: controller.selectedTab.value == 0
                    ? AppStrings.buyAirtime
                    : 'Buy Data',
                onPressed: () => controller.selectedTab.value == 0
                    ? controller.buyAirtime()
                    : controller.buyData(),
                width: double.infinity,
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildAirtimeInput() {
    return _buildTopUpSection();
  }

  Widget _buildDataInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Data Plan',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        _buildDataPlansGrid(),
      ],
    );
  }

  Widget _buildTabToggle() {
    return Container(
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Obx(
        () => Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => controller.switchTab(0),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: controller.selectedTab.value == 0
                        ? AppColors.cardBackground
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      AppStrings.airtime,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: controller.selectedTab.value == 0
                            ? AppColors.textPrimary
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: GestureDetector(
                onTap: () => controller.switchTab(1),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: controller.selectedTab.value == 1
                        ? AppColors.cardBackground
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      AppStrings.data,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: controller.selectedTab.value == 1
                            ? AppColors.textPrimary
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNetworkSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              AppStrings.network,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              AppStrings.contact,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              flex: 4,
              child: Container(
                height: 70,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    // Network Placeholder Logo
                    GestureDetector(
                      onTap: () => Get.bottomSheet(
                        CountrySelectionDialog(
                          onCountrySelected: (country) {
                            controller.selectedCountryFlag.value = country.flag;
                            controller.selectedDialCode.value =
                                country.dialCode;
                          },
                        ),
                        isScrollControlled: true,
                      ),
                      child: Row(
                        children: [
                          Obx(
                            () => Text(
                              controller.selectedCountryFlag.value,
                              style: const TextStyle(fontSize: 20),
                            ),
                          ),
                          const SizedBox(width: 4),
                          Obx(
                            () => Text(
                              controller.selectedDialCode.value,
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          const Icon(
                            Icons.keyboard_arrow_down,
                            size: 16,
                            color: Colors.grey,
                          ),
                        ],
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 15),
                      child: VerticalDivider(width: 20, thickness: 1),
                    ),
                    Expanded(
                      child: TextField(
                        controller: controller.phoneNumberController,
                        keyboardType: TextInputType.phone,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                        decoration: InputDecoration(
                          hintText: AppStrings.phoneNumberHint,
                          border: InputBorder.none,
                          hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              height: 70,
              width: 70,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.contact_phone_outlined,
                color: AppColors.textPrimary,
                size: 28,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTopUpSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.topUp,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          height: 70,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant.withOpacity(0.3),
            border: Border.all(color: Colors.grey[200]!),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Text(
                '₦',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: controller.amountController,
                  keyboardType: TextInputType.number,
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  decoration: InputDecoration(
                    hintText: AppStrings.enterAmount,
                    border: InputBorder.none,
                    hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDataPlansGrid() {
    return Obx(
      () => GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 2.5,
        ),
        itemCount: controller.dataPlans.length,
        itemBuilder: (context, index) {
          final plan = controller.dataPlans[index];
          final isSelected = controller.selectedDataPlan.value == plan['name'];

          return GestureDetector(
            onTap: () => controller.setDataPlan(plan['name']!, plan['price']!),
            child: Container(
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primary.withOpacity(0.1)
                    : AppColors.cardBackground,
                border: Border.all(
                  color: isSelected ? AppColors.primary : Colors.grey[300]!,
                  width: 1.5,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    plan['name']!,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '₦${plan['price']}',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
