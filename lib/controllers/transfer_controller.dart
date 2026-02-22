import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:nigerian_banks_nuban/nigerian_banks_nuban.dart';

class TransferController extends GetxController {
  final accountNumberController = TextEditingController();
  final amountController = TextEditingController();
  String get amount => amountController.text;
  final selectedBank = ''.obs;
  final recipientName = 'Divine Chiamaka'.obs;
  final recipientEmail = 'divine.ama9@gmail.com'.obs;
  final accountName = 'Access Bank PLC'.obs;

  static final _nigerianBanks = NigerianBanks();

  /// All Nigerian banks for the dropdown
  List<Bank> get banks => _nigerianBanks.getBanks();

  /// Detect probable banks from 10-digit NUBAN account number
  List<Bank> getBanksByAccountNumber(String accountNumber) {
    if (accountNumber.replaceAll(RegExp(r'\D'), '').length != 10) return [];
    return _nigerianBanks.getBanksByAccountNumber(accountNumber);
  }

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
