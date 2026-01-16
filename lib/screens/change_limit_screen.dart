import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/change_limit_controller.dart';
import '../widgets/custom_limit_slider.dart';
import '../widgets/numeric_keypad.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';

class ChangeLimitScreen extends GetView<ChangeLimitController> {
  const ChangeLimitScreen({super.key});

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
        title: Text("Change Limit", style: AppText.header2),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Obx(
              () => CustomLimitSlider(
                label: "Limit Per Transaction",
                value: controller.transactionLimit.value,
                min: 1,
                max: controller.maxTransactionLimit,
                onChanged: controller.updateTransactionLimit,
              ),
            ),
            const SizedBox(height: 30),
            Obx(
              () => CustomLimitSlider(
                label: "Cash Withdrawal Limit",
                value: controller.withdrawalLimit.value,
                min: 1,
                max: controller.maxWithdrawalLimit,
                onChanged: controller.updateWithdrawalLimit,
              ),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: controller.saveChanges,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: Text("Save Changes", style: AppText.button),
              ),
            ),
            const SizedBox(height: 40),
            NumericKeypad(
              onKeyTap: controller.onNumberPressed,
              onBackspace: controller.onBackspacePressed,
            ),
          ],
        ),
      ),
    );
  }
}
