import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import 'package:country_picker/country_picker.dart' as cp;

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

class CountrySelectionDialog extends StatefulWidget {
  final Function(Country) onCountrySelected;

  const CountrySelectionDialog({super.key, required this.onCountrySelected});

  @override
  State<CountrySelectionDialog> createState() => _CountrySelectionDialogState();
}

class _CountrySelectionDialogState extends State<CountrySelectionDialog> {
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
      height: Get.height * 0.7,
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Select Country',
                  style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
                ),
                IconButton(
                  onPressed: () => Get.back(),
                  icon: Icon(Icons.close, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant.withOpacity(0.3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: TextField(
                controller: searchController,
                decoration: InputDecoration(
                  hintText: 'Search country or code',
                  hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                  border: InputBorder.none,
                  icon: Icon(Icons.search, color: Colors.grey[400]),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              itemCount: filteredCountries.length,
              itemBuilder: (context, index) {
                final country = filteredCountries[index];
                return ListTile(
                  onTap: () {
                    widget.onCountrySelected(country);
                    Get.back();
                  },
                  leading: Text(
                    country.flag,
                    style: const TextStyle(fontSize: 24),
                  ),
                  title: Text(
                    country.name,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  trailing: Text(
                    country.dialCode,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
