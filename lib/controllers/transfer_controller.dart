import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:nigerian_banks_nuban/nigerian_banks_nuban.dart';
import '../services/bank_service.dart';

class TransferController extends GetxController {
  final accountNumberController = TextEditingController();
  final amountController = TextEditingController();
  String get amount => amountController.text;
  final selectedBank = Rxn<Bank>();
  final recipientName = 'Divine Chiamaka'.obs;
  final recipientEmail = 'divine.ama9@gmail.com'.obs;
  final accountName = ''.obs;
  final isResolving = false.obs;

  Timer? _resolveDebounce;

  static final _nigerianBanks = NigerianBanks();

  List<Bank> get banks => _nigerianBanks.getBanks();

  List<Bank> getBanksByAccountNumber(String accountNumber) {
    if (accountNumber.replaceAll(RegExp(r'\D'), '').length != 10) return [];
    return _nigerianBanks.getBanksByAccountNumber(accountNumber);
  }

  @override
  void onInit() {
    super.onInit();
    accountNumberController.addListener(_onAccountNumberChanged);
  }

  void _onAccountNumberChanged() {
    _resolveDebounce?.cancel();
    final account = accountNumberController.text.replaceAll(RegExp(r'\D'), '');
    if (account.length == 10) {
      _resolveDebounce = Timer(const Duration(milliseconds: 500), () {
        _autoDetectAndResolve();
      });
    } else {
      selectedBank.value = null;
      recipientName.value = '';
    }
  }

  Future<void> _autoDetectAndResolve() async {
    final account = accountNumberController.text.replaceAll(RegExp(r'\D'), '');
    if (account.length != 10) return;

    final probableBanks = getBanksByAccountNumber(account);
    if (probableBanks.isNotEmpty) {
      final code = probableBanks.first.code;
      try {
        selectedBank.value = banks.firstWhere((b) => b.code == code);
      } catch (_) {
        selectedBank.value = probableBanks.first;
      }
      accountName.value = selectedBank.value!.name;
      await resolveAccountName();
    } else if (selectedBank.value != null) {
      await resolveAccountName();
    }
  }

  void onBankChanged(Bank? bank) {
    selectedBank.value = bank;
    if (bank != null) {
      accountName.value = bank.name;
      final account = accountNumberController.text.replaceAll(RegExp(r'\D'), '');
      if (account.length == 10) {
        resolveAccountName();
      }
    } else {
      accountName.value = '';
      recipientName.value = '';
    }
  }

  Future<void> resolveAccountName() async {
    final bank = selectedBank.value;
    final account = accountNumberController.text.replaceAll(RegExp(r'\D'), '');
    if (bank == null || account.length != 10) return;

    isResolving.value = true;
    recipientName.value = '';
    try {
      final result = await BankService.resolveAccount(
        accountNumber: account,
        bankCode: bank.code,
      );
      if (result.success && result.accountName != null) {
        recipientName.value = result.accountName!;
        recipientEmail.value = '';
      } else {
        Get.snackbar(
          'Account Not Found',
          result.error ?? 'Could not resolve account name',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.orange,
          colorText: Colors.white,
        );
      }
    } finally {
      isResolving.value = false;
    }
  }

  void setRecipient(String name, String email) {
    recipientName.value = name;
    recipientEmail.value = email;
  }

  void reset() {
    accountNumberController.clear();
    amountController.clear();
    selectedBank.value = null;
    accountName.value = '';
    recipientName.value = '';
  }

  @override
  void onClose() {
    _resolveDebounce?.cancel();
    accountNumberController.removeListener(_onAccountNumberChanged);
    accountNumberController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
