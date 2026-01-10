import 'package:flutter/material.dart';
import 'package:get/get.dart';

class TransferController extends GetxController {
  final accountNumberController = TextEditingController();
  final amountController = TextEditingController();
  String get amount => amountController.text;
  final selectedBank = ''.obs;
  final recipientName = 'Divine Chiamaka'.obs;
  final recipientEmail = 'divine.ama9@gmail.com'.obs;
  final accountName = 'Access Bank PLC'.obs;

  void setRecipient(String name, String email) {
    recipientName.value = name;
    recipientEmail.value = email;
  }

  void reset() {
    accountNumberController.clear();
    amountController.clear();
    selectedBank.value = '';
  }

  @override
  void onClose() {
    accountNumberController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
