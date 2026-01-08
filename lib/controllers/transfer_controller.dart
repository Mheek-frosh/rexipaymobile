import 'package:flutter/material.dart';
import 'package:get/get.dart';

class TransferController extends GetxController {
  final accountController = TextEditingController();
  final amountController = TextEditingController();
  final selectedBank = ''.obs;
  final recipientName = 'Divine Chiamaka'.obs;
  final recipientEmail = 'divine.ama9@gmail.com'.obs;
  final accountName = 'Access Bank PLC'.obs;

  void setRecipient(String name, String email) {
    recipientName.value = name;
    recipientEmail.value = email;
  }

  void reset() {
    accountController.clear();
    amountController.clear();
    selectedBank.value = '';
  }

  @override
  void onClose() {
    accountController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
