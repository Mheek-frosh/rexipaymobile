import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/crypto_controller.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../utils/app_strings.dart';

class ChooseCryptoScreen extends GetView<CryptoController> {
  const ChooseCryptoScreen({super.key});

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
          AppStrings.chooseCrypto,
          style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Text(
              AppStrings.yourPortfolio,
              style: AppText.style(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: Obx(
                () => ListView.separated(
                  itemCount: controller.portfolio.length,
                  separatorBuilder: (context, index) => Divider(
                    color: AppColors.black.withOpacity(0.05),
                    height: 1,
                  ),
                  itemBuilder: (context, index) {
                    final coin = controller.portfolio[index];
                    return _buildCoinTile(coin);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCoinTile(Map<String, dynamic> coin) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 8),
      onTap: () => controller.selectCoin(coin),
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: _getCoinColor(coin['symbol']),
          shape: BoxShape.circle,
        ),
        child: Center(child: _getCoinIcon(coin['symbol'])),
      ),
      title: Text(
        coin['name'],
        style: AppText.style(fontSize: 16, fontWeight: FontWeight.w600),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '\$${coin['balance'].toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
            style: AppText.style(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(width: 8),
          Icon(
            Icons.arrow_forward_ios,
            size: 14,
            color: AppColors.textSecondary,
          ),
        ],
      ),
    );
  }

  Color _getCoinColor(String symbol) {
    switch (symbol) {
      case 'BTC':
        return const Color(0xFFF7931A).withOpacity(0.1);
      case 'ETH':
        return const Color(0xFF627EEA).withOpacity(0.1);
      case 'USDT':
        return const Color(0xFF26A17B).withOpacity(0.1);
      case 'LTC':
        return const Color(0xFF345D9D).withOpacity(0.1);
      default:
        return AppColors.primary.withOpacity(0.1);
    }
  }

  Widget _getCoinIcon(String symbol) {
    // Ideally use Image.asset or a crypto icon package
    // For now, using text as placeholder
    return Text(
      symbol,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: _getSymbolColor(symbol),
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
