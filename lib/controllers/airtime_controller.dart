import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../widgets/airtime_confirmation_dialog.dart';
import '../widgets/data_confirmation_dialog.dart';
import '../widgets/airtime_data_success_dialog.dart';
import '../routes/app_routes.dart';

class AirtimeController extends GetxController {
  final selectedTab = 0.obs; // 0 for Airtime, 1 for Data
  final selectedNetwork = 'MTN'.obs;
  final phoneNumberController = TextEditingController();
  final amountController = TextEditingController();

  final networks = ['MTN', 'Airtel', 'Glo', '9mobile'];

  // Data specific
  final selectedDataPlan = ''.obs;
  final dataPlans = [
    {'name': '1GB / 30 Days', 'price': '300'},
    {'name': '2GB / 30 Days', 'price': '500'},
    {'name': '5GB / 30 Days', 'price': '1000'},
    {'name': '10GB / 30 Days', 'price': '2000'},
    {'name': '20GB / 30 Days', 'price': '3500'},
    {'name': '40GB / 30 Days', 'price': '5000'},
  ].obs;

  @override
  void onInit() {
    super.onInit();
    if (Get.arguments != null && Get.arguments['tab'] != null) {
      selectedTab.value = Get.arguments['tab'];
    }
  }

  void switchTab(int index) {
    selectedTab.value = index;
    if (index == 0) {
      Get.offNamed(Routes.AIRTIME);
    } else {
      Get.offNamed(Routes.DATA);
    }
  }

  void setNetwork(String network) {
    selectedNetwork.value = network;
  }

  void setDataPlan(String plan, String price) {
    selectedDataPlan.value = plan;
    amountController.text = price;
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

  void buyData() {
    if (phoneNumberController.text.isEmpty || selectedDataPlan.value.isEmpty) {
      Get.snackbar(
        'Error',
        'Please fill in all fields',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.1),
        colorText: Colors.red,
      );
      return;
    }

    Get.bottomSheet(const DataConfirmationDialog(), isScrollControlled: true);
  }

  void confirmTransaction() {
    Get.back(); // Close confirmation dialog
    Get.bottomSheet(
      const AirtimeDataSuccessDialog(),
      isScrollControlled: true,
      isDismissible: false,
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
