import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/card_management_controller.dart';
import '../../routes/app_routes.dart';

class CardListScreen extends GetView<CardManagementController> {
  const CardListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: AppColors.textPrimary),
          onPressed: () => Get.back(),
        ),
        title: Text(
          AppStrings.cards,
          style: AppText.header2.copyWith(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
      ),
      body: Obx(() {
        if (controller.cards.isEmpty) {
          // Ideally should navigate to ADD_CARD_INTRO if empty, but for now show empty
          return Center(
            child: Text("No cards added yet", style: AppText.body1),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: controller.cards.length,
          itemBuilder: (context, index) {
            final card = controller.cards[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 15),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 40,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF5B86FC), Color(0xFF2E63F6)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    // In a real app, use Image.asset with logos
                    child: Center(
                      child: Icon(
                        Icons.credit_card,
                        color: Colors.white.withOpacity(0.8),
                        size: 20,
                      ),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${card['type']} **** ${card['last4']}',
                          style: AppText.body1.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text('${card['network']}', style: AppText.body2),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () => controller.deleteCard(index),
                  ),
                ],
              ),
            );
          },
        );
      }),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        onPressed: () => Get.toNamed(Routes.ADD_CARD_INTRO),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
