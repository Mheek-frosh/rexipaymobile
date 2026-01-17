import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_picker/country_picker.dart' as cp;
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../controllers/auth_controller.dart';
import 'segmented_progress_bar.dart';
import 'custom_buttons.dart';

class Country {
  final String name;
  final String code;
  final String flag;
  final String dialCode;

  Country({
    required this.name,
    required this.code,
    required this.flag,
    required this.dialCode,
  });
}

class CountryWithProgressDialog extends StatefulWidget {
  final Function(Country) onCountrySelected;
  final VoidCallback onContinue;

  const CountryWithProgressDialog({
    super.key,
    required this.onCountrySelected,
    required this.onContinue,
  });

  @override
  State<CountryWithProgressDialog> createState() =>
      _CountryWithProgressDialogState();
}

class _CountryWithProgressDialogState extends State<CountryWithProgressDialog> {
  final AuthController controller = Get.find<AuthController>();
  final List<Country> countries = cp.CountryService()
      .getAll()
      .map(
        (c) => Country(
          name: c.name,
          code: c.countryCode,
          flag: c.flagEmoji,
          dialCode: '+${c.phoneCode}',
        ),
      )
      .toList();

  late List<Country> filteredCountries;
  final searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    filteredCountries = countries;
    searchController.addListener(_filterCountries);
  }

  void _filterCountries() {
    final query = searchController.text.toLowerCase();
    setState(() {
      filteredCountries = countries
          .where(
            (c) =>
                c.name.toLowerCase().contains(query) ||
                c.dialCode.contains(query),
          )
          .toList();
    });
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          // Pull Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Progress Bar
                  Obx(
                    () => SegmentedProgressBar(
                      totalSteps: 4,
                      currentStep: controller.currentStep.value,
                    ),
                  ),
                  const SizedBox(height: 30),
                  // Title
                  Text(
                    'Select Country or Region',
                    style: AppText.header1.copyWith(
                      fontWeight: FontWeight.w700,
                      fontSize: 24,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'This helps us customize your experience.',
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Search Bar
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariant.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: TextField(
                      controller: searchController,
                      decoration: InputDecoration(
                        hintText: 'Search country or region',
                        hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                        border: InputBorder.none,
                        icon: Icon(Icons.search, color: Colors.grey[400]),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Country List
                  Expanded(
                    child: ListView.separated(
                      itemCount: filteredCountries.length,
                      separatorBuilder: (context, index) =>
                          Divider(color: Colors.grey[200], height: 1),
                      itemBuilder: (context, index) {
                        final country = filteredCountries[index];
                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          onTap: () {
                            widget.onCountrySelected(country);
                          },
                          leading: Text(
                            country.flag,
                            style: const TextStyle(fontSize: 24),
                          ),
                          title: Text(
                            country.name,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          trailing: Obx(
                            () => Icon(
                              controller.selectedCountryDialCode.value ==
                                      country.dialCode
                                  ? Icons.radio_button_checked
                                  : Icons.radio_button_off,
                              color:
                                  controller.selectedCountryDialCode.value ==
                                      country.dialCode
                                  ? const Color(0xFF2E63F6)
                                  : Colors.grey[300],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 10),
                  // Continue Button
                  PrimaryButton(
                    text: 'Create Account',
                    onPressed: widget.onContinue,
                    width: double.infinity,
                    backgroundColor: const Color(0xFF2E63F6),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
