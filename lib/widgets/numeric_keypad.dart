import 'package:flutter/material.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';

class NumericKeypad extends StatelessWidget {
  final Function(String) onNumberPressed;
  final VoidCallback onBackspacePressed;

  const NumericKeypad({
    super.key,
    required this.onNumberPressed,
    required this.onBackspacePressed,
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
        _buildRow(['', '0', 'backspace']),
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
              onBackspacePressed();
            } else {
              onNumberPressed(item);
            }
          },
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: item == 'backspace'
                  ? Icon(Icons.backspace_outlined, color: AppColors.textPrimary)
                  : Text(item, style: AppText.header2.copyWith(fontSize: 24)),
            ),
          ),
        );
      }).toList(),
    );
  }
}
