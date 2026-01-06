import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class QuickActions extends StatelessWidget {
  const QuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      {
        'icon': Icons.wifi,
        'label': 'Airtime',
        'color': Colors.orange[100],
        'iconColor': Colors.orange,
      },
      {
        'icon': Icons.public,
        'label': 'Internet',
        'color': Colors.green[100],
        'iconColor': Colors.green,
      },
      {
        'icon': Icons.electric_bolt,
        'label': 'Electricity',
        'color': Colors.yellow[100],
        'iconColor': Colors.orangeAccent,
      },
      {
        'icon': Icons.receipt_long,
        'label': 'History',
        'color': Colors.orange[50],
        'iconColor': Colors.orange,
      },
      {
        'icon': Icons.shopping_cart_outlined,
        'label': 'Shopping',
        'color': Colors.purple[50],
        'iconColor': Colors.purple,
      },
      {
        'icon': Icons.volunteer_activism,
        'label': 'Deals',
        'color': Colors.pink[50],
        'iconColor': Colors.pink,
      },
      {
        'icon': Icons.health_and_safety_outlined,
        'label': 'Health',
        'color': Colors.green[50],
        'iconColor': Colors.green,
      },
      {
        'icon': Icons.beach_access,
        'label': 'Insurance',
        'color': Colors.blue[50],
        'iconColor': Colors.cyan,
      },
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Quick Actions',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            ],
          ),
          const SizedBox(height: 20),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              childAspectRatio: 0.8,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: actions.length,
            itemBuilder: (context, index) {
              final action = actions[index];
              return Column(
                children: [
                  Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      color: action['color'] as Color,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      action['icon'] as IconData,
                      color: action['iconColor'] as Color,
                      size: 24,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    action['label'] as String,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.grey[700],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
