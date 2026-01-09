import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import 'card_details_sheet.dart';

class PinEntryDialog extends StatefulWidget {
  const PinEntryDialog({super.key});

  @override
  State<PinEntryDialog> createState() => _PinEntryDialogState();
}

class _PinEntryDialogState extends State<PinEntryDialog> {
  final List<String> _pin = ['', '', '', ''];
  int _currentIndex = 0;

  void _onNumberPressed(String number) {
    if (_currentIndex < 4) {
      setState(() {
        _pin[_currentIndex] = number;
        _currentIndex++;
      });

      // Auto-proceed when all 4 digits entered
      if (_currentIndex == 4) {
        Future.delayed(const Duration(milliseconds: 300), () {
          Get.back(); // Close PIN dialog
          Get.bottomSheet(
            const CardDetailsSheet(),
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
          );
        });
      }
    }
  }

  void _onBackspace() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
        _pin[_currentIndex] = '';
      });
    }
  }

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
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 10),
            // Close Button
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Get.back(),
                icon: Icon(Icons.close, color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 10),
            // Title
            Text(
              'Enter Transaction PIN',
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 30),
            // PIN Input Boxes
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: const Color(0xFF2E63F6),
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      _pin[index].isEmpty ? '' : '●',
                      style: GoogleFonts.inter(
                        fontSize: 32,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 20),
            // Forgot PIN
            TextButton(
              onPressed: () {},
              child: Text(
                'Forgot PIN?',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: const Color(0xFF2E63F6),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Numeric Keypad
            _buildKeypad(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildKeypad() {
    return Column(
      children: [
        _buildKeypadRow(['1', '2', '3']),
        const SizedBox(height: 15),
        _buildKeypadRow(['4', '5', '6']),
        const SizedBox(height: 15),
        _buildKeypadRow(['7', '8', '9']),
        const SizedBox(height: 15),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            // Face ID Icon
            _buildKeypadButton(
              child: Icon(Icons.face, size: 32, color: AppColors.textPrimary),
              onTap: () {},
            ),
            // Zero
            _buildKeypadButton(
              child: Text(
                '0',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              onTap: () => _onNumberPressed('0'),
            ),
            // Backspace
            _buildKeypadButton(
              child: Icon(
                Icons.backspace_outlined,
                size: 28,
                color: AppColors.textPrimary,
              ),
              onTap: _onBackspace,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildKeypadRow(List<String> numbers) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: numbers.map((number) {
        return _buildKeypadButton(
          child: Text(
            number,
            style: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          onTap: () => _onNumberPressed(number),
        );
      }).toList(),
    );
  }

  Widget _buildKeypadButton({
    required Widget child,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(40),
      child: Container(
        width: 70,
        height: 70,
        decoration: BoxDecoration(
          color: Colors.grey[200],
          shape: BoxShape.circle,
        ),
        child: Center(child: child),
      ),
    );
  }
}
