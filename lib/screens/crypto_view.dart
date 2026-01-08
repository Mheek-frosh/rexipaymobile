import 'package:flutter/material.dart';
import '../widgets/crypto_actions.dart';
import '../widgets/my_assets_list.dart';
import '../widgets/referral_banner.dart';

class CryptoView extends StatelessWidget {
  const CryptoView({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const CryptoActions(),
        const MyAssetsList(),
        const SizedBox(height: 25),
        const ReferralBanner(),
        const SizedBox(height: 100), // Space for bottom nav
      ],
    );
  }
}
