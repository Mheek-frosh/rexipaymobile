import 'package:flutter/material.dart';

class SegmentedProgressBar extends StatelessWidget {
  final int totalSteps;
  final int currentStep;

  const SegmentedProgressBar({
    super.key,
    required this.totalSteps,
    required this.currentStep,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalSteps, (index) {
        final isCompleted = index < currentStep;
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(right: index < totalSteps - 1 ? 8 : 0),
            height: 4,
            decoration: BoxDecoration(
              color: isCompleted ? const Color(0xFF2E63F6) : Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        );
      }),
    );
  }
}
