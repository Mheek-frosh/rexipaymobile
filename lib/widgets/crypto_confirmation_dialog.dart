import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/crypto_controller.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';
import 'custom_buttons.dart';

class CryptoConfirmationDialog extends GetView<CryptoController> {
  const CryptoConfirmationDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Pull Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Close Button
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Get.back(),
                icon: Icon(Icons.close, color: AppColors.textSecondary),
              ),
            ),
            // Coin Icon
            Center(
              child: _getCoinIcon(controller.selectedCoin.value, size: 80),
            ),
            const SizedBox(height: 30),
            // Details
            _buildInfoRow(
              AppStrings.recipients,
              _maskAddress(controller.addressController.text),
            ),
            const SizedBox(height: 15),
            _buildInfoRow(AppStrings.network, controller.selectedNetwork.value),
            const SizedBox(height: 15),
            _buildInfoRow(
              '${controller.selectedCoin.value} ${AppStrings.amount}',
              '\$${controller.amountController.text}',
              isAmount: true,
            ),
            const SizedBox(height: 15),
            _buildInfoRow(AppStrings.transactionFee, '\$120'),
            const SizedBox(height: 15),
            _buildInfoRow(
              AppStrings.wallet,
              '${controller.selectedCoin.value} Wallet',
              isCryptoWallet: true,
            ),
            const SizedBox(height: 40),
            // Send Button
            PrimaryButton(
              text: AppStrings.send,
              onPressed: () => controller.confirmTransfer(),
              width: double.infinity,
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  String _maskAddress(String address) {
    if (address.length < 10) return address;
    return '${address.substring(0, 8)}******';
  }

  Widget _buildInfoRow(
    String label,
    String value, {
    bool isAmount = false,
    bool isCryptoWallet = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        if (isCryptoWallet)
          Row(
            children: [
              _getCoinIcon(controller.selectedCoin.value, size: 16),
              const SizedBox(width: 6),
              Text(
                value,
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2E63F6),
                ),
              ),
            ],
          )
        else
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: isAmount ? FontWeight.w700 : FontWeight.w600,
              color: isAmount ? AppColors.textPrimary : AppColors.textSecondary,
            ),
          ),
      ],
    );
  }

  Widget _getCoinIcon(String symbol, {double size = 40}) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _getSymbolColor(symbol).withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          symbol,
          style: TextStyle(
            fontSize: size * 0.25,
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
