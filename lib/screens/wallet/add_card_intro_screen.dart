import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../widgets/add_card_dialog.dart';

class AddCardIntroScreen extends StatelessWidget {
  const AddCardIntroScreen({super.key});

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
        title: Text(
          AppStrings.cards,
          style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Stacked cards illustration from assets
            Image.asset(
              'assets/images/addcard.png',
              height: 250,
              width: 250,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                Get.bottomSheet(
                  const AddCardDialog(),
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                );
              },
              icon: const Icon(Icons.add, color: Colors.white),
              label: Text(AppStrings.addCard, style: AppText.button),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
