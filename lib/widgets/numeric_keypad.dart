import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';

class NumericKeypad extends StatelessWidget {
  final Function(String) onKeyTap;
  final VoidCallback onBackspace;
  final IconData? leftButtonIcon;
  final VoidCallback? onLeftButtonTap;

  const NumericKeypad({
    super.key,
    required this.onKeyTap,
    required this.onBackspace,
    this.leftButtonIcon,
    this.onLeftButtonTap,
  });

  @override
  Widget build(BuildContext context) {
    bool isIOS = GetPlatform.isIOS;

    return Column(
      children: [
        _buildRow(['1', '2', '3'], isIOS),
        SizedBox(height: isIOS ? 12 : 20),
        _buildRow(['4', '5', '6'], isIOS),
        SizedBox(height: isIOS ? 12 : 20),
        _buildRow(['7', '8', '9'], isIOS),
        SizedBox(height: isIOS ? 12 : 20),
        _buildRow([
          leftButtonIcon != null ? 'leftItem' : '',
          '0',
          'backspace',
        ], isIOS),
      ],
    );
  }

  Widget _buildRow(List<String> items, bool isIOS) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: items.map((item) {
        if (item.isEmpty) return const SizedBox(width: 80);

        return GestureDetector(
          onTap: () {
            if (item == 'backspace') {
              onBackspace();
            } else if (item == 'leftItem') {
              onLeftButtonTap?.call();
            } else {
              onKeyTap(item);
            }
          },
          child: isIOS ? _buildIosButton(item) : _buildAndroidButton(item),
        );
      }).toList(),
    );
  }

  Widget _buildIosButton(String item) {
    return Container(
      width: 75,
      height: 75,
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant.withOpacity(0.5),
        shape: BoxShape.circle,
      ),
      child: Center(child: _buildItemChild(item, true)),
    );
  }

  Widget _buildAndroidButton(String item) {
    return Container(
      width: 85,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(child: _buildItemChild(item, false)),
    );
  }

  Widget _buildItemChild(String item, bool isIOS) {
    if (item == 'backspace') {
      return Icon(
        Icons.backspace_outlined,
        color: AppColors.textPrimary,
        size: isIOS ? 24 : 28,
      );
    } else if (item == 'leftItem') {
      return Icon(
        leftButtonIcon,
        color: AppColors.textPrimary,
        size: isIOS ? 28 : 32,
      );
    } else {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            item,
            style: GoogleFonts.inter(
              fontSize: isIOS ? 28 : 24,
              fontWeight: isIOS ? FontWeight.w400 : FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          if (isIOS && item != '0')
            Text(
              _getIosSubtext(item),
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 2,
                color: AppColors.textPrimary.withOpacity(0.6),
              ),
            ),
        ],
      );
    }
  }

  String _getIosSubtext(String item) {
    switch (item) {
      case '2':
        return 'ABC';
      case '3':
        return 'DEF';
      case '4':
        return 'GHI';
      case '5':
        return 'JKL';
      case '6':
        return 'MNO';
      case '7':
        return 'PQRS';
      case '8':
        return 'TUV';
      case '9':
        return 'WXYZ';
      default:
        return '';
    }
  }
}
