import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/banner_carousel_controller.dart';
import 'banner_card.dart';

class BannerCarousel extends StatelessWidget {
  const BannerCarousel({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(BannerCarouselController());

    final List<Widget> banners = [
      BannerCard(
        title: 'Refer and Earn',
        subtitle: 'Refer your friend and win crypto coins',
        buttonText: 'Refer Now',
        backgroundColor: const Color(0xFFFF9800),
        imagePath: 'assets/images/thumbs.png',
        onPressed: () {},
      ),
      BannerCard(
        title: 'Send BTC Free',
        subtitle: 'Send Bitcoin to any wallet without any charges',
        buttonText: 'Send Now',
        backgroundColor: const Color(0xFF673AB7),
        imagePath:
            'assets/images/thumbs.png', // Reusing thumbs or suitable icon
        onPressed: () {},
      ),
      BannerCard(
        title: 'Add New Card',
        subtitle: 'Connect your bank card for faster crypto buys',
        buttonText: 'Add Card',
        backgroundColor: const Color(0xFF2196F3),
        imagePath: 'assets/images/addcard.png',
        onPressed: () {},
      ),
    ];

    return Column(
      children: [
        SizedBox(
          height: 160, // Adjusted based on BannerCard constraints
          child: PageView.builder(
            controller: controller.pageController,
            onPageChanged: controller.onPageChanged,
            itemCount: banners.length,
            itemBuilder: (context, index) {
              return banners[index];
            },
          ),
        ),
        Obx(
          () => Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              banners.length,
              (index) => Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: controller.currentIndex.value == index
                      ? Colors
                            .blue // Or a color from AppColors
                      : Colors.grey.withOpacity(0.3),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
