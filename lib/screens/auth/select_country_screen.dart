import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../utils/app_colors.dart';
import '../../widgets/country_with_progress_dialog.dart';

class SelectCountryScreen extends StatefulWidget {
  const SelectCountryScreen({super.key});

  @override
  State<SelectCountryScreen> createState() => _SelectCountryScreenState();
}

class _SelectCountryScreenState extends State<SelectCountryScreen> {
  final AuthController controller = Get.find<AuthController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CountryWithProgressDialog(
          onCountrySelected: (country) {
            controller.selectedCountryFlag.value = country.flag;
            controller.selectedCountryDialCode.value = country.dialCode;
          },
          onContinue: () {
            controller.completeSignup();
          },
        ),
      ),
    );
  }
}
