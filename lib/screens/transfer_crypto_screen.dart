import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/crypto_controller.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import '../widgets/custom_buttons.dart';

class TransferCryptoScreen extends GetView<CryptoController> {
  const TransferCryptoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Text(
          AppStrings.transferCrypto,
          style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            _buildLabel(AppStrings.coin),
            const SizedBox(height: 8),
            _buildCoinSelector(),
            const SizedBox(height: 24),
            _buildLabel(AppStrings.address),
            const SizedBox(height: 8),
            _buildAddressInput(),
            const SizedBox(height: 24),
            _buildLabel(AppStrings.network),
            const SizedBox(height: 8),
            _buildNetworkSelector(),
            const SizedBox(height: 24),
            _buildAmountHeader(),
            const SizedBox(height: 8),
            _buildAmountInput(),
            const SizedBox(height: 30),
            _buildWarningCard(),
            const SizedBox(height: 40),
            PrimaryButton(
              text: AppStrings.proceed,
              onPressed: () => controller.proceedToConfirmation(),
              width: double.infinity,
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: AppText.style(fontSize: 16, fontWeight: FontWeight.w600),
    );
  }

  Widget _buildCoinSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Row(
        children: [
          _getCoinIcon(controller.selectedCoin.value),
          const SizedBox(width: 12),
          Text(
            controller.selectedCoin.value,
            style: AppText.style(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          Text(
            controller.selectedCoinName.value,
            style: AppText.style(fontSize: 14, color: AppColors.textSecondary),
          ),
          const Spacer(),
          const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildAddressInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller.addressController,
              decoration: InputDecoration(
                hintText: AppStrings.addressHint,
                border: InputBorder.none,
                hintStyle: AppText.style(color: Colors.grey[400]!),
              ),
            ),
          ),
          Icon(Icons.qr_code_scanner, color: AppColors.textPrimary),
        ],
      ),
    );
  }

  Widget _buildNetworkSelector() {
    return Obx(
      () => Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[300]!),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: controller.selectedNetwork.value,
            isExpanded: true,
            icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            items: controller.networks.map((String value) {
              return DropdownMenuItem<String>(value: value, child: Text(value));
            }).toList(),
            onChanged: (val) => controller.setNetwork(val),
          ),
        ),
      ),
    );
  }

  Widget _buildAmountHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildLabel(AppStrings.amount),
        Obx(
          () => Text(
            'Bal: \$${controller.balance.value.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
            style: AppText.style(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAmountInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller.amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                hintText: '${AppStrings.minWithdrawal} 1',
                border: InputBorder.none,
                hintStyle: AppText.style(color: Colors.grey[400]!),
              ),
            ),
          ),
          Text(
            controller.selectedCoin.value,
            style: AppText.style(fontSize: 14, color: Colors.grey[400]!),
          ),
          const SizedBox(width: 8),
          Text(
            AppStrings.maxValue,
            style: AppText.style(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWarningCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        AppStrings.destinationWarning,
        style: AppText.style(fontSize: 12, color: Colors.red[400]!),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _getCoinIcon(String symbol) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: _getSymbolColor(symbol).withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          symbol,
          style: TextStyle(
            fontSize: 8,
            fontWeight: FontWeight.bold,
            color: _getSymbolColor(symbol),
          ),
        ),
      ),
    );
  }

  Color _getSymbolColor(String symbol) {
    switch (symbol) {
      case 'BTC':
        return const Color(0xFFF7931A);
      case 'ETH':
        return const Color(0xFF627EEA);
      case 'USDT':
        return const Color(0xFF26A17B);
      case 'LTC':
        return const Color(0xFF345D9D);
      default:
        return AppColors.primary;
    }
  }
}
