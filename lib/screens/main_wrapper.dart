import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/main_controller.dart';
import '../widgets/floating_bottom_nav.dart';
import 'home_screen.dart';
import 'card_screen.dart';
import 'stats_screen.dart';
import 'profile_screen.dart';

class MainWrapper extends GetView<MainController> {
  const MainWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: Stack(
        children: [
          Obx(
            () => IndexedStack(
              index: controller.currentIndex,
              children: const [
                HomeScreen(),
                CardScreen(),
                StatsScreen(),
                ProfileScreen(),
              ],
            ),
          ),
          const Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: FloatingBottomNav(),
          ),
        ],
      ),
    );
  }
}
