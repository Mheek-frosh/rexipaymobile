import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_picker/country_picker.dart' as cp;
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/segmented_progress_bar.dart';
import '../../widgets/custom_buttons.dart';

class SelectCountryScreen extends StatefulWidget {
  const SelectCountryScreen({super.key});

  @override
  State<SelectCountryScreen> createState() => _SelectCountryScreenState();
}

class _SelectCountryScreenState extends State<SelectCountryScreen> {
  final AuthController controller = Get.find<AuthController>();
  final List<cp.Country> allCountries = cp.CountryService().getAll();
  late List<cp.Country> filteredCountries;
  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    filteredCountries = allCountries;
  }

  void _filterCountries(String query) {
    setState(() {
      filteredCountries = allCountries
          .where(
            (country) =>
                country.name.toLowerCase().contains(query.toLowerCase()) ||
                country.phoneCode.contains(query),
          )
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              // Progress Bar
              Obx(
                () => SegmentedProgressBar(
                  totalSteps: 4,
                  currentStep: controller.currentStep.value,
                ),
              ),
              const SizedBox(height: 40),
              // Title
              Text(
                'Select Country or Region',
                style: AppText.header1.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 28,
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
              const SizedBox(height: 30),
              // Search Bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextField(
                  controller: searchController,
                  onChanged: _filterCountries,
                  decoration: InputDecoration(
                    hintText: 'Search country or region',
                    hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                    icon: Icon(Icons.search, color: Colors.grey[400]),
                    border: InputBorder.none,
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
                        controller.selectedCountryFlag.value =
                            country.flagEmoji;
                        controller.selectedCountryDialCode.value =
                            '+${country.phoneCode}';
                      },
                      leading: Text(
                        country.flagEmoji,
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
                                  '+${country.phoneCode}'
                              ? Icons.radio_button_checked
                              : Icons.radio_button_off,
                          color:
                              controller.selectedCountryDialCode.value ==
                                  '+${country.phoneCode}'
                              ? const Color(0xFF2E63F6)
                              : Colors.grey[300],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
              // Continue Button
              PrimaryButton(
                text: 'Create Account',
                onPressed: () {
                  controller.completeSignup();
                },
                width: double.infinity,
                backgroundColor: const Color(0xFF2E63F6),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
