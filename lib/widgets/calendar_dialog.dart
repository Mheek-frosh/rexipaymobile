import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../widgets/custom_buttons.dart';

class CalendarDialog extends StatefulWidget {
  final Function(DateTime) onDateSelected;

  const CalendarDialog({super.key, required this.onDateSelected});

  @override
  State<CalendarDialog> createState() => _CalendarDialogState();
}

class _CalendarDialogState extends State<CalendarDialog> {
  DateTime selectedDate = DateTime.now();
  DateTime displayedMonth = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Calendar Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: () {
                    setState(() {
                      displayedMonth = DateTime(
                        displayedMonth.year,
                        displayedMonth.month - 1,
                      );
                    });
                  },
                  icon: const Icon(Icons.chevron_left),
                ),
                Text(
                  _getMonthName(displayedMonth.month) +
                      " " +
                      displayedMonth.year.toString(),
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      displayedMonth = DateTime(
                        displayedMonth.year,
                        displayedMonth.month + 1,
                      );
                    });
                  },
                  icon: const Icon(Icons.chevron_right),
                ),
              ],
            ),
            const SizedBox(height: 10),
            // Days of Week
            _buildDaysOfWeek(),
            const SizedBox(height: 10),
            // Date Grid
            _buildDateGrid(),
            const SizedBox(height: 20),
            // Confirm Button
            PrimaryButton(
              text: 'Confirm',
              onPressed: () {
                widget.onDateSelected(selectedDate);
                Get.back();
              },
              width: double.infinity,
              backgroundColor: const Color(0xFF2E63F6),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDaysOfWeek() {
    final days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: days
          .map(
            (day) => Text(
              day,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildDateGrid() {
    final daysInMonth = DateUtils.getDaysInMonth(
      displayedMonth.year,
      displayedMonth.month,
    );
    final firstDayOffset =
        DateTime(displayedMonth.year, displayedMonth.month, 1).weekday % 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
      ),
      itemCount: daysInMonth + firstDayOffset,
      itemBuilder: (context, index) {
        if (index < firstDayOffset) {
          return const SizedBox();
        }
        final day = index - firstDayOffset + 1;
        final date = DateTime(displayedMonth.year, displayedMonth.month, day);
        final isSelected = DateUtils.isSameDay(date, selectedDate);
        final isToday = DateUtils.isSameDay(date, DateTime.now());

        return GestureDetector(
          onTap: () {
            setState(() {
              selectedDate = date;
            });
          },
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF2E63F6) : Colors.transparent,
              shape: BoxShape.circle,
            ),
            child: Text(
              day.toString(),
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected
                    ? Colors.white
                    : (isToday
                          ? const Color(0xFF2E63F6)
                          : AppColors.textPrimary),
              ),
            ),
          ),
        );
      },
    );
  }

  String _getMonthName(int month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}
