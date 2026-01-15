import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../controllers/card_management_controller.dart';
import 'card_success_dialog.dart';

class CardPinDialog extends GetView<CardManagementController> {
  const CardPinDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(width: 24),
              Text(
                AppStrings.enterPin,
                style: AppText.header2.copyWith(fontSize: 18),
              ),
              IconButton(
                onPressed: () => Get.back(),
                icon: const Icon(Icons.close),
              ),
            ],
          ),
          const SizedBox(height: 30),
          Obx(
            () => Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                bool isFilled = controller.pin.value.length > index;
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: isFilled
                          ? AppColors.primary
                          : AppColors.grey.withOpacity(0.3),
                      width: 1.5,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: isFilled
                        ? Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          )
                        : null,
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () {},
            child: Text(
              AppStrings.forgotPinQuestion,
              style: AppText.body2.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 20),
          _buildNumericKeypad(),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildNumericKeypad() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: ["1", "2", "3"].map((n) => _buildKey(n)).toList(),
        ),
        const SizedBox(height: 15),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: ["4", "5", "6"].map((n) => _buildKey(n)).toList(),
        ),
        const SizedBox(height: 15),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: ["7", "8", "9"].map((n) => _buildKey(n)).toList(),
        ),
        const SizedBox(height: 15),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildKey("faceid", isIcon: true),
            _buildKey("0"),
            _buildKey("backspace", isIcon: true),
          ],
        ),
      ],
    );
  }

  Widget _buildKey(String value, {bool isIcon = false}) {
    return GestureDetector(
      onTap: () {
        if (value == "backspace") {
          controller.removePinDigit();
        } else if (value == "faceid") {
          // FaceID logic
        } else {
          controller.addPinDigit(value);
          if (controller.pin.value.length == 4) {
            Get.back();
            Get.bottomSheet(
              const CardSuccessDialog(),
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
            );
          }
        }
      },
      child: Container(
        width: 70,
        height: 70,
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant.withOpacity(0.3),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: isIcon
              ? Icon(
                  value == "backspace" ? Icons.backspace_outlined : Icons.face,
                  color: AppColors.textPrimary,
                )
              : Text(value, style: AppText.header2.copyWith(fontSize: 24)),
        ),
      ),
    );
  }
}
