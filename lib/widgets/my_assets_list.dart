import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:get/get.dart';
import '../utils/app_colors.dart';
import '../routes/app_routes.dart';
import '../controllers/crypto_controller.dart';

class MyAssetsList extends StatelessWidget {
  const MyAssetsList({super.key});

  @override
  Widget build(BuildContext context) {
    // Ensure controller is available
    final controller = Get.put(CryptoController());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'My Assets',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              GestureDetector(
                onTap: () => Get.toNamed(Routes.CHOOSE_CRYPTO),
                child: Icon(
                  Icons.arrow_forward,
                  color: AppColors.textSecondary,
                  size: 20,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 15),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              _buildAssetItem(
                context,
                'Bitcoin',
                'BTC',
                '\$230,000',
                Colors.orange,
                Icons.currency_bitcoin,
                onTap: () => controller.selectCoin({
                  'symbol': 'BTC',
                  'name': 'Bitcoin',
                  'balance': 230000.0,
                }),
              ),
              _buildDivider(),
              _buildAssetItem(
                context,
                'Ethereum',
                'ETH',
                '\$130,000',
                const Color(0xFF627EEA),
                Icons.token_outlined,
                onTap: () => controller.selectCoin({
                  'symbol': 'ETH',
                  'name': 'Ethereum',
                  'balance': 130000.0,
                }),
              ),
              _buildDivider(),
              _buildAssetItem(
                context,
                'USDT',
                'USDT',
                '\$100,000',
                const Color(0xFF26A17B),
                Icons.attach_money,
                onTap: () => controller.selectCoin({
                  'symbol': 'USDT',
                  'name': 'USDT',
                  'balance': 100000.0,
                }),
              ),
              _buildDivider(),
              _buildAssetItem(
                context,
                'LTC',
                'Litecoin',
                '\$40,000',
                Colors.blueGrey,
                Icons.currency_lira,
                onTap: () => controller.selectCoin({
                  'symbol': 'LTC',
                  'name': 'LTC',
                  'balance': 40000.0,
                }),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAssetItem(
    BuildContext context,
    String name,
    String symbol,
    String price,
    Color color,
    IconData icon, {
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
              height: 48,
              width: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  children: [
                    Text(
                      price,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.chevron_right,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      indent: 80,
      endIndent: 20,
      color: AppColors.black.withOpacity(0.05),
    );
  }
}
