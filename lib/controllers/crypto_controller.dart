import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../widgets/crypto_confirmation_dialog.dart';

class CryptoController extends GetxController {
  final selectedCoin = 'BTC'.obs;
  final selectedCoinName = 'Bitcoin'.obs;
  final selectedCoinIcon = 'BTC'.obs; // Placeholder for icon logic
  final selectedNetwork = 'BTC Network'.obs;
  final balance = 230000.0.obs;

  final addressController = TextEditingController();
  final amountController = TextEditingController();

  final portfolio = [
    {'symbol': 'BTC', 'name': 'Bitcoin', 'balance': 230000.0, 'icon': 'BTC'},
    {'symbol': 'ETH', 'name': 'Ethereum', 'balance': 130000.0, 'icon': 'ETH'},
    {'symbol': 'USDT', 'name': 'USDT', 'balance': 100000.0, 'icon': 'USDT'},
    {'symbol': 'LTC', 'name': 'LTC', 'balance': 40000.0, 'icon': 'LTC'},
  ].obs;

  final networks = ['BTC Network', 'ERC20', 'TRC20', 'BEP20'].obs;

  void selectCoin(Map<String, dynamic> coin) {
    selectedCoin.value = coin['symbol'];
    selectedCoinName.value = coin['name'];
    balance.value = coin['balance'];
    Get.toNamed('/transfer-crypto');
  }

  void setNetwork(String? network) {
    if (network != null) {
      selectedNetwork.value = network;
    }
  }

  void proceedToConfirmation() {
    if (addressController.text.isEmpty || amountController.text.isEmpty) {
      Get.snackbar(
        'Error',
        'Please enter address and amount',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.withOpacity(0.1),
        colorText: Colors.red,
      );
      return;
    }

    Get.bottomSheet(const CryptoConfirmationDialog(), isScrollControlled: true);
  }

  void confirmTransfer() {
    Get.back(); // Close dialog
    Get.toNamed(
      '/payment-success',
      arguments: {
        'recipientName': addressController.text,
        'amount': amountController.text,
        'network': selectedNetwork.value,
        'type': 'Crypto',
        'coin': selectedCoin.value,
      },
    );
  }

  @override
  void onClose() {
    addressController.dispose();
    amountController.dispose();
    super.onClose();
  }
}
