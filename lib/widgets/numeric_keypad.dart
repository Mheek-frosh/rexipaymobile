import 'package:flutter/material.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';

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
    return Column(
      children: [
        _buildRow(['1', '2', '3']),
        const SizedBox(height: 15),
        _buildRow(['4', '5', '6']),
        const SizedBox(height: 15),
        _buildRow(['7', '8', '9']),
        const SizedBox(height: 15),
        _buildRow([leftButtonIcon != null ? 'leftItem' : '', '0', 'backspace']),
      ],
    );
  }

  Widget _buildRow(List<String> items) {
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
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              shape: BoxShape.circle,
            ),
            child: Center(child: _buildItemChild(item)),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildItemChild(String item) {
    if (item == 'backspace') {
      return Icon(Icons.backspace_outlined, color: AppColors.textPrimary);
    } else if (item == 'leftItem') {
      return Icon(leftButtonIcon, color: AppColors.textPrimary, size: 28);
    } else {
      return Text(item, style: AppText.header2.copyWith(fontSize: 24));
    }
  }
}
