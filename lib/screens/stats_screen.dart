import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_colors.dart';
import '../utils/app_text.dart';
import '../routes/app_routes.dart';

class StatsScreen extends StatefulWidget {
  const StatsScreen({super.key});

  @override
  State<StatsScreen> createState() => _StatsScreenState();
}

class _StatsScreenState extends State<StatsScreen> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(
            'Statistics Graph',
            style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
          backgroundColor: AppColors.background,
          elevation: 0,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                const SizedBox(height: 10),
                // Dropdown
                Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primary),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'This Week',
                          style: GoogleFonts.inter(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.keyboard_arrow_down,
                          color: AppColors.primary,
                          size: 16,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Pie Chart
                SizedBox(
                  height: 250,
                  child: PieChart(
                    PieChartData(
                      pieTouchData: PieTouchData(
                        touchCallback: (FlTouchEvent event, pieTouchResponse) {
                          setState(() {
                            if (!event.isInterestedForInteractions ||
                                pieTouchResponse == null ||
                                pieTouchResponse.touchedSection == null) {
                              touchedIndex = -1;
                              return;
                            }
                            touchedIndex = pieTouchResponse
                                .touchedSection!
                                .touchedSectionIndex;
                          });
                        },
                      ),
                      borderData: FlBorderData(show: false),
                      sectionsSpace: 0,
                      centerSpaceRadius: 60,
                      sections: showingSections(),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Chart Legend
                Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 20,
                  runSpacing: 10,
                  children: [
                    _buildLegendItem('Salary', const Color(0xFF5B86FC)),
                    _buildLegendItem('Food & Drink', const Color(0xFFFF6B6B)),
                    _buildLegendItem('E-Wallet', const Color(0xFF7B61FF)),
                    _buildLegendItem('Internet', const Color(0xFF2EC4B6)),
                    _buildLegendItem('Shopping', const Color(0xFFFFD166)),
                  ],
                ),

                const SizedBox(height: 30),

                // Income/Expense Cards
                Row(
                  children: [
                    Expanded(
                      child: _buildSummaryCard(
                        icon: Icons.arrow_downward,
                        iconBgColor: const Color(0xFFE8F0FE), // Light Blue
                        iconColor: AppColors.primary,
                        amount: '\$2670.40',
                        label: 'Income',
                      ),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: _buildSummaryCard(
                        icon: Icons.arrow_upward,
                        iconBgColor: const Color(0xFFFFEBEE), // Light Red
                        iconColor: Colors.red,
                        amount: '\$1265.70',
                        label: 'Expense',
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 30),

                // Transactions
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Transactions',
                      style: AppText.header2.copyWith(fontSize: 18),
                    ),
                    GestureDetector(
                      onTap: () => Get.toNamed(Routes.TRANSACTIONS),
                      child: Text(
                        'See All',
                        style: GoogleFonts.inter(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 15),

                // Transaction List Item
                Container(
                  margin: const EdgeInsets.only(bottom: 100), // Space for nav
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.cardBackground,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey[200],
                          image: const DecorationImage(
                            image: AssetImage('assets/user_avatar_2.png'),
                            // Use a placeholder if asset doesn't exist
                            // onError: (exception, stackTrace) => {},
                          ),
                        ),
                        child: const Icon(Icons.person, color: Colors.grey),
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Isaac Folarin',
                              style: GoogleFonts.inter(
                                fontWeight: FontWeight.w600,
                                fontSize: 16,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'March 24, 2025 | 11:36 AM',
                              style: GoogleFonts.inter(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: Colors.grey),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        BoxShapeDot(color: color),
        const SizedBox(width: 6),
        Text(
          label,
          style: GoogleFonts.inter(
            color: AppColors.textSecondary,
            fontWeight: FontWeight.w600,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryCard({
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String amount,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: iconBgColor,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                amount,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: GoogleFonts.inter(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<PieChartSectionData> showingSections() {
    return List.generate(5, (i) {
      final isTouched = i == touchedIndex;
      final radius = isTouched ? 70.0 : 60.0;
      return switch (i) {
        0 => PieChartSectionData(
          color: const Color(0xFF5B86FC), // Salary Blue
          value: 40,
          title: '40%',
          radius: radius,
          badgeWidget: _Badge(
            '40%',
            size: 40,
            borderColor: const Color(0xFF5B86FC),
          ),
          badgePositionPercentageOffset: .98,
          showTitle: false,
        ),
        1 => PieChartSectionData(
          color: const Color(0xFFFF6B6B), // Food Red
          value: 20,
          title: '20%',
          radius: radius,
          badgeWidget: _Badge(
            '20%',
            size: 40,
            borderColor: const Color(0xFFFF6B6B),
          ),
          badgePositionPercentageOffset: .98,
          showTitle: false,
        ),
        2 => PieChartSectionData(
          color: const Color(0xFF7B61FF), // E-Wallet Purple
          value: 15,
          title: '15%',
          radius: radius,
          badgeWidget: _Badge(
            '15%',
            size: 40,
            borderColor: const Color(0xFF7B61FF),
          ),
          badgePositionPercentageOffset: .98,
          showTitle: false,
        ),
        3 => PieChartSectionData(
          color: const Color(0xFF2EC4B6), // Internet Green
          value: 5,
          title: '5%',
          radius: radius,
          badgeWidget: _Badge(
            '5%',
            size: 30,
            borderColor: const Color(0xFF2EC4B6),
          ),
          badgePositionPercentageOffset: .98,
          showTitle: false,
        ),
        4 => PieChartSectionData(
          color: const Color(0xFFFFD166), // Shopping Yellow
          value: 20,
          title: '20%',
          radius: radius,
          badgeWidget: _Badge(
            '20%',
            size: 40,
            borderColor: const Color(0xFFFFD166),
          ),
          badgePositionPercentageOffset: .98,
          showTitle: false,
        ),
        _ => throw Error(),
      };
    });
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.text, {required this.size, required this.borderColor});
  final String text;
  final double size;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: PieChart.defaultDuration,
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.cardBackground, width: 0),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: Colors.black.withOpacity(.1),
            offset: const Offset(3, 3),
            blurRadius: 3,
          ),
        ],
      ),
      padding: const EdgeInsets.all(0),
      child: Center(
        child: Text(
          text,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary.withOpacity(0.7),
          ),
        ),
      ),
    );
  }
}

class BoxShapeDot extends StatelessWidget {
  final Color color;
  const BoxShapeDot({super.key, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}
