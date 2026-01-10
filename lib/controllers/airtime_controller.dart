import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AirtimeController extends GetxController {
  final selectedTab = 0.obs; // 0 for Airtime, 1 for Data
  final selectedNetwork = 'MTN'.obs;
  final phoneNumberController = TextEditingController();
  final amountController = TextEditingController();

  final networks = ['MTN', 'Airtel', 'Glo', '9mobile'];

  void switchTab(int index) {
    selectedTab.value = index;
  }

  void setNetwork(String network) {
    selectedNetwork.value = network;
  }

  @override
  void onClose() {
    phoneNumberController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
