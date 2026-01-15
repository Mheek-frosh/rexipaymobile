import 'package:get/get.dart';
import '../controllers/card_management_controller.dart';

class CardBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CardManagementController>(() => CardManagementController());
  }
}
