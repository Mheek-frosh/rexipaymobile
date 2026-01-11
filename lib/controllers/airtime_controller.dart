import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../widgets/airtime_confirmation_dialog.dart';

class AirtimeController extends GetxController {
  final selectedTab = 0.obs; // 0 for Airtime, 1 for Data
  final selectedNetwork = 'MTN'.obs;
  final phoneNumberController = TextEditingController();
  final amountController = TextEditingController();

  final networks = ['MTN', 'Airtel', 'Glo', '9mobile'];

  @override
  void onInit() {
    super.onInit();
    if (Get.arguments != null && Get.arguments['tab'] != null) {
      selectedTab.value = Get.arguments['tab'];
    }
  }

  void switchTab(int index) {
    selectedTab.value = index;
  }

  void setNetwork(String network) {
    selectedNetwork.value = network;
  }

  void buyAirtime() {
    if (phoneNumberController.text.isEmpty || amountController.text.isEmpty) {
      Get.snackbar(
        'Error',
        'Please fill in all fields',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.1),
        colorText: Colors.red,
      );
      return;
    }

    Get.bottomSheet(
      const AirtimeConfirmationDialog(),
      isScrollControlled: true,
    );
  }

  void confirmTransaction() {
    Get.back(); // Close dialog
    Get.toNamed(
      '/payment-success',
      arguments: {
        'recipientName': phoneNumberController.text,
        'amount': amountController.text,
        'network': selectedNetwork.value,
        'type': selectedTab.value == 0 ? 'Airtime' : 'Data',
      },
    );
  }

  void editDetails() {
    Get.back(); // Close dialog
  }

  @override
  void onClose() {
    phoneNumberController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
