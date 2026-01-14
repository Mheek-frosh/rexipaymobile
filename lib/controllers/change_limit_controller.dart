import 'package:get/get.dart';

class ChangeLimitController extends GetxController {
  final transactionLimit = 5000000.0.obs;
  final withdrawalLimit = 500000.0.obs;

  final maxTransactionLimit = 15000000.0;
  final maxWithdrawalLimit = 2000000.0;

  void updateTransactionLimit(double value) {
    transactionLimit.value = value;
  }

  void updateWithdrawalLimit(double value) {
    withdrawalLimit.value = value;
  }

  void onNumberPressed(String number) {
    // This could be used for direct numeric entry if the design requires it.
    // For now, it's a placeholder as the primary interaction is the slider.
    print("Number pressed: $number");
  }

  void onBackspacePressed() {
    print("Backspace pressed");
  }

  void saveChanges() {
    // Logic to save limits (e.g., API call)
    Get.back();
    Get.snackbar(
      "Success",
      "Limits updated successfully",
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}
