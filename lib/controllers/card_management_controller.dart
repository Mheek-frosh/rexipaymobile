import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CardManagementController extends GetxController {
  final cards = <Map<String, String>>[].obs;

  // Form fields
  final nameController = TextEditingController();
  final cardNumberController = TextEditingController();
  final expiryController = TextEditingController();
  final cvvController = TextEditingController();

  // PIN field
  final pin = "".obs;

  @override
  void onInit() {
    super.onInit();
  }

  void addPinDigit(String digit) {
    if (pin.value.length < 4) {
      pin.value += digit;
    }

    if (pin.value.length == 4) {
      // PIN complete, proceed to success
    }
  }

  void removePinDigit() {
    if (pin.value.isNotEmpty) {
      pin.value = pin.value.substring(0, pin.value.length - 1);
    }
  }

  void clearForm() {
    nameController.clear();
    cardNumberController.clear();
    expiryController.clear();
    cvvController.clear();
    pin.value = "";
  }

  void addCard() {
    // In a real app, we'd validate and send to API
    cards.add({
      'type': 'Debit Card',
      'last4': cardNumberController.text.substring(
        cardNumberController.text.length - 4,
      ),
      'network': 'Visa', // Dummy
      'image': 'assets/images/visa_logo.png', // Placeholder
    });
    clearForm();
  }

  void deleteCard(int index) {
    cards.removeAt(index);
  }

  @override
  void onClose() {
    nameController.dispose();
    cardNumberController.dispose();
    expiryController.dispose();
    cvvController.dispose();
    super.onClose();
  }
}
