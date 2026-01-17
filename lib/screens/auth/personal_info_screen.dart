import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../utils/app_colors.dart';
import '../../utils/app_text.dart';
import '../../utils/app_strings.dart';
import '../../controllers/auth_controller.dart';
import '../../widgets/segmented_progress_bar.dart';
import '../../widgets/custom_buttons.dart';

class PersonalInfoScreen extends StatelessWidget {
  const PersonalInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<AuthController>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverFillRemaining(
              hasScrollBody: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    // Progress Bar
                    Obx(
                      () => SegmentedProgressBar(
                        totalSteps: 4,
                        currentStep: controller.currentStep.value,
                      ),
                    ),
                    const SizedBox(height: 40),
                    // Title
                    Text(
                      AppStrings.personalInfoTitle,
                      style: AppText.header1.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 28,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'This info needs to be accurate with your ID document.',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 40),
                    // Full Name Field
                    _buildLabel('Full Name'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: controller.nameController,
                      hintText: 'Michael Usidamen',
                      icon: Icons.person_outline,
                    ),
                    const SizedBox(height: 20),
                    // Username Field
                    _buildLabel('Username'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: controller.usernameController,
                      hintText: 'Mheek Frosh',
                      icon: Icons.person_outline,
                    ),
                    const SizedBox(height: 20),
                    // Date of Birth Field
                    _buildLabel('Date of Birth'),
                    const SizedBox(height: 8),
                    _buildDateField(context, controller),
                    const Spacer(),
                    // Continue Button
                    PrimaryButton(
                      text: 'Continue',
                      onPressed: () {
                        controller.nextStep();
                        Get.toNamed('/select-country');
                      },
                      width: double.infinity,
                      backgroundColor: const Color(0xFF2E63F6),
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
<<<<<<< HEAD
            ),
          ],
=======
              const SizedBox(height: 40),
              // Title
              Text(
                AppStrings.personalInfoTitle,
                style: AppText.header1.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 28,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'This info needs to be accurate with your ID document.',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 40),
              // Full Name Field
              _buildLabel('Full Name'),
              const SizedBox(height: 8),
              _buildTextField(
                controller: controller.nameController,
                hintText: 'Michael Usidamen',
                icon: Icons.person_outline,
              ),
              const SizedBox(height: 20),
              // Username Field
              _buildLabel('Username'),
              const SizedBox(height: 8),
              _buildTextField(
                controller: controller.usernameController,
                hintText: 'Mheek Frosh',
                icon: Icons.person_outline,
              ),
              const SizedBox(height: 20),
              // Date of Birth Field
              _buildLabel('Date of Birth'),
              const SizedBox(height: 8),
              _buildDateField(context, controller),
              const Spacer(),
              // Continue Button
              PrimaryButton(
                text: 'Continue',
                onPressed: () {
                  controller.nextStep();
                  Get.toNamed('/select-country');
                },
                width: double.infinity,
                backgroundColor: const Color(0xFF2E63F6),
              ),
              const SizedBox(height: 30),
            ],
          ),
>>>>>>> 838d3a447f19534c83d2b1598deb5347a9a98ebe
        ),
      ),
    );
  }

  Widget _buildLabel(String label) {
    return Text(
      label,
      style: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: controller,
        style: GoogleFonts.inter(
          fontSize: 16,
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
          icon: Icon(icon, color: Colors.grey[400]),
          border: InputBorder.none,
        ),
      ),
    );
  }

  Widget _buildDateField(BuildContext context, AuthController controller) {
    return GestureDetector(
      onTap: () async {
        final DateTime? picked = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime(1900),
          lastDate: DateTime.now(),
          builder: (context, child) {
            return Theme(
              data: Theme.of(context).copyWith(
                colorScheme: const ColorScheme.light(
                  primary: Color(0xFF2E63F6),
                  onPrimary: Colors.white,
                  onSurface: Colors.black,
                ),
                textButtonTheme: TextButtonThemeData(
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF2E63F6),
                  ),
                ),
              ),
              child: child!,
            );
          },
        );
        if (picked != null) {
          controller.dobController.text =
              "${picked.month.toString().padLeft(2, '0')}/${picked.day.toString().padLeft(2, '0')}/${picked.year}";
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(Icons.calendar_today_outlined, color: Colors.grey[400]),
            const SizedBox(width: 16),
            Obx(
              () => Text(
                controller.dobController.text.isEmpty
                    ? 'MM/DD/YYYY'
                    : controller.dobController.text,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: controller.dobController.text.isEmpty
                      ? Colors.grey[400]
                      : AppColors.textPrimary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
